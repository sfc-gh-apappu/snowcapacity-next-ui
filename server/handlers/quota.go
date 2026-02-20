package handlers

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"

	"snowcapacity-server/models"
)

// ─── Quota Handlers ─────────────────────────────────────────

// QuotaFilters returns the distinct filter values from AZURE_QUOTA_USAGE.
func (h *Handler) QuotaFilters(c *gin.Context) {
	filters, err := h.fetchQuotaFilters(c.Request.Context())
	if err != nil {
		models.Error(c, http.StatusInternalServerError, models.ErrCodeQueryFailed, err.Error())
		return
	}
	models.Success(c, filters)
}

// CurrentUsage returns filtered current usage rows from AZURE_QUOTA_USAGE.
func (h *Handler) CurrentUsage(c *gin.Context) {
	var params models.QuotaQueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		models.Error(c, http.StatusBadRequest, models.ErrCodeValidation, err.Error())
		return
	}

	rows, err := h.fetchCurrentUsage(c.Request.Context(), params)
	if err != nil {
		models.Error(c, http.StatusInternalServerError, models.ErrCodeQueryFailed, err.Error())
		return
	}

	totalCount := len(rows)
	models.SuccessPaginated(c, rows, &totalCount, "")
}

// QuotaAdjustments returns filtered adjustment records joined with usage data.
func (h *Handler) QuotaAdjustments(c *gin.Context) {
	var params models.QuotaQueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		models.Error(c, http.StatusBadRequest, models.ErrCodeValidation, err.Error())
		return
	}

	rows, err := h.fetchQuotaAdjustments(c.Request.Context(), params)
	if err != nil {
		models.Error(c, http.StatusInternalServerError, models.ErrCodeQueryFailed, err.Error())
		return
	}

	totalCount := len(rows)
	models.SuccessPaginated(c, rows, &totalCount, "")
}

// ─── Internal helpers ───────────────────────────────────────

// buildQuotaWhereClauses builds optional WHERE clauses from the shared filter params.
// cloudCol may be empty if the table has no cloud column.
func buildQuotaWhereClauses(params models.QuotaQueryParams, regionCol, tenantCol, subCol, instanceCol string) ([]string, []interface{}) {
	return buildQuotaWhereClausesWithCloud(params, "", regionCol, tenantCol, subCol, instanceCol)
}

func buildQuotaWhereClausesWithCloud(params models.QuotaQueryParams, cloudCol, regionCol, tenantCol, subCol, instanceCol string) ([]string, []interface{}) {
	var clauses []string
	var args []interface{}

	if params.Cloud != "" && cloudCol != "" {
		clauses = append(clauses, "LOWER("+cloudCol+") = LOWER(?)")
		args = append(args, params.Cloud)
	}
	if params.Region != "" {
		clauses = append(clauses, regionCol+" = ?")
		args = append(args, params.Region)
	}
	if params.TenantID != "" {
		clauses = append(clauses, tenantCol+" = ?")
		args = append(args, params.TenantID)
	}
	if params.SubscriptionID != "" {
		clauses = append(clauses, subCol+" = ?")
		args = append(args, params.SubscriptionID)
	}
	if params.InstanceType != "" {
		clauses = append(clauses, instanceCol+" = ?")
		args = append(args, params.InstanceType)
	}

	return clauses, args
}

func (h *Handler) fetchCurrentUsage(ctx context.Context, params models.QuotaQueryParams) ([]models.CurrentUsageRow, error) {
	clauses, args := buildQuotaWhereClauses(params, "REGION", "TENANT_ID", "SUBSCRIPTION_ID", "INSTANCE_TYPE")

	query := `
		SELECT DISTINCT
			REGION,
			TENANT_ID,
			SUBSCRIPTION_ID,
			SUBSCRIPTION_NAME,
			PROVIDER_NAMESPACE,
			INSTANCE_TYPE,
			QUOTA_NAME,
			CURRENT_USAGE,
			QUOTA_LIMIT,
			USAGE_PERCENT,
			UNIT,
			LAST_UPDATED
		FROM AZURE_QUOTA_USAGE
	`

	if len(clauses) > 0 {
		query += " WHERE " + strings.Join(clauses, " AND ")
	}
	query += " ORDER BY USAGE_PERCENT DESC"

	rows, err := h.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query current usage: %w", err)
	}
	defer rows.Close()

	var results []models.CurrentUsageRow
	for rows.Next() {
		var r models.CurrentUsageRow
		if err := rows.Scan(
			&r.Region, &r.TenantID, &r.SubscriptionID, &r.SubscriptionName,
			&r.ProviderNamespace, &r.InstanceType, &r.QuotaName,
			&r.CurrentUsage, &r.QuotaLimit, &r.UsagePercent, &r.Unit, &r.LastUpdated,
		); err != nil {
			return nil, fmt.Errorf("scan current usage: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration: %w", err)
	}

	if results == nil {
		results = []models.CurrentUsageRow{}
	}
	return results, nil
}

func (h *Handler) fetchQuotaAdjustments(ctx context.Context, params models.QuotaQueryParams) ([]models.QuotaAdjustmentRow, error) {
	clauses, args := buildQuotaWhereClauses(params,
		"adjustments.region",
		"quota.tenant_id",
		"adjustments.subscription_id",
		"adjustments.instance_type",
	)

	// Base WHERE: subscription_name must exist from the join
	baseClauses := []string{
		"quota.subscription_name IS NOT NULL",
		"quota.subscription_name != ''",
	}
	allClauses := append(baseClauses, clauses...)

	query := `
		SELECT DISTINCT
			COALESCE(adjustments.id, ''),
			COALESCE(adjustments.quota_id, ''),
			COALESCE(adjustments.region, ''),
			COALESCE(adjustments.tenant_id, ''),
			COALESCE(adjustments.subscription_id, ''),
			COALESCE(quota.subscription_name, ''),
			COALESCE(adjustments.instance_type, ''),
			COALESCE(adjustments.quota_name, ''),
			COALESCE(adjustments.limit_before_adjustment, 0),
			COALESCE(adjustments.requested_new_limit, 0),
			COALESCE(adjustments.usage_percent, 0),
			COALESCE(adjustments.unit, ''),
			COALESCE(adjustments.request_status, ''),
			COALESCE(adjustments.csp_support_request_id, ''),
			COALESCE(TO_VARCHAR(adjustments.csp_support_request_timestamp), ''),
			COALESCE(TO_VARCHAR(adjustments.last_adjustment_status_check), ''),
			COALESCE(adjustments.status_check_count, 0),
			COALESCE(adjustments.justification, ''),
			COALESCE(adjustments.message, ''),
			COALESCE(TO_VARCHAR(adjustments.created_at), '') AS created_at,
			COALESCE(TO_VARCHAR(adjustments.last_updated), '') AS last_updated,
			CASE
				WHEN COALESCE(adjustments.portal_request_id, '') != ''
				THEN 'Request Portal'
				ELSE 'Automated Adjustment'
			END AS requestor
		FROM AZURE_QUOTA_ADJUSTMENTS adjustments
		LEFT JOIN AZURE_QUOTA_USAGE quota
			ON adjustments.subscription_id = quota.subscription_id
		WHERE ` + strings.Join(allClauses, " AND ") + `
		ORDER BY created_at DESC
	`

	rows, err := h.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query quota adjustments: %w", err)
	}
	defer rows.Close()

	var results []models.QuotaAdjustmentRow
	for rows.Next() {
		var r models.QuotaAdjustmentRow
		if err := rows.Scan(
			&r.ID, &r.QuotaID, &r.Region, &r.TenantID, &r.SubscriptionID,
			&r.SubscriptionName, &r.InstanceType, &r.QuotaName,
			&r.LimitBeforeAdjustment, &r.RequestedNewLimit, &r.UsagePercent,
			&r.Unit, &r.RequestStatus, &r.CspSupportRequestID,
			&r.CspSupportRequestTimestamp, &r.LastAdjustmentStatusCheck,
			&r.StatusCheckCount, &r.Justification, &r.Message,
			&r.CreatedAt, &r.LastUpdated, &r.Requestor,
		); err != nil {
			return nil, fmt.Errorf("scan quota adjustment: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration: %w", err)
	}

	if results == nil {
		results = []models.QuotaAdjustmentRow{}
	}
	return results, nil
}

func (h *Handler) fetchQuotaFilters(ctx context.Context) (*models.QuotaFilters, error) {
	query := `
		SELECT DISTINCT
			REGION,
			TENANT_ID,
			SUBSCRIPTION_ID,
			SUBSCRIPTION_NAME,
			INSTANCE_TYPE
		FROM AZURE_QUOTA_USAGE
		ORDER BY REGION, TENANT_ID, SUBSCRIPTION_NAME, INSTANCE_TYPE
	`

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query quota filters: %w", err)
	}
	defer rows.Close()

	regionSet := make(map[string]bool)
	tenantSet := make(map[string]bool)
	subIDSet := make(map[string]bool)
	subNameSet := make(map[string]bool)
	instanceSet := make(map[string]bool)

	for rows.Next() {
		var region, tenantID, subID, subName, instanceType string
		if err := rows.Scan(&region, &tenantID, &subID, &subName, &instanceType); err != nil {
			return nil, fmt.Errorf("scan quota filters: %w", err)
		}
		if region != "" {
			regionSet[region] = true
		}
		if tenantID != "" {
			tenantSet[tenantID] = true
		}
		if subID != "" {
			subIDSet[subID] = true
		}
		if subName != "" {
			subNameSet[subName] = true
		}
		if instanceType != "" {
			instanceSet[instanceType] = true
		}
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration: %w", err)
	}

	return &models.QuotaFilters{
		Regions:           sortedKeys(regionSet),
		TenantIDs:         sortedKeys(tenantSet),
		SubscriptionIDs:   sortedKeys(subIDSet),
		SubscriptionNames: sortedKeys(subNameSet),
		InstanceTypes:     sortedKeys(instanceSet),
	}, nil
}

// sortedKeys extracts the keys from a set map and returns them sorted.
func sortedKeys(m map[string]bool) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	for i := 1; i < len(keys); i++ {
		for j := i; j > 0 && keys[j] < keys[j-1]; j-- {
			keys[j], keys[j-1] = keys[j-1], keys[j]
		}
	}
	return keys
}

// ─── Quota Overview ─────────────────────────────────────────

// QuotaOverview returns the aggregated overview blob for the Quota Overview tab.
func (h *Handler) QuotaOverview(c *gin.Context) {
	models.MarkStart(c)

	var params models.QuotaQueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		models.Error(c, http.StatusBadRequest, models.ErrCodeValidation, err.Error())
		return
	}

	ctx := c.Request.Context()
	var (
		mu       sync.Mutex
		response models.QuotaOverviewResponse
	)

	g, gCtx := errgroup.WithContext(ctx)

	// Group 1: KPI counts + critical chips + top 10 bar chart (AZURE_QUOTA_USAGE, last 1 day)
	g.Go(func() error {
		kpiCounts, criticalChips, topBars, err := h.fetchOverviewSnapshot(gCtx, params)
		if err != nil {
			return fmt.Errorf("snapshot: %w", err)
		}
		mu.Lock()
		response.KPIs.TotalQuotas = kpiCounts.TotalQuotas
		response.KPIs.Critical = kpiCounts.Critical
		response.KPIs.CriticalQuotas = criticalChips
		response.Charts.TopQuotasByUsage = topBars
		mu.Unlock()
		return nil
	})

	// Group 2: 90-day usage trends (AZURE_QUOTA_USAGE)
	g.Go(func() error {
		trends, err := h.fetchOverviewTrends(gCtx, params)
		if err != nil {
			return fmt.Errorf("trends: %w", err)
		}
		mu.Lock()
		response.Charts.UsageTrend = trends
		mu.Unlock()
		return nil
	})

	// Group 3: Adjustment stats + at-risk quotas (AZURE_QUOTA_ADJUSTMENTS + AZURE_QUOTA_USAGE)
	g.Go(func() error {
		adjStats, atRisk, err := h.fetchOverviewAdjustments(gCtx, params)
		if err != nil {
			return fmt.Errorf("adjustments: %w", err)
		}
		mu.Lock()
		response.KPIs.OpenTickets = adjStats.OpenTickets
		response.KPIs.FailedIncreases = adjStats.FailedIncreases
		response.KPIs.RecentAdjustments30d = adjStats.RecentAdjustments30d
		response.AtRiskQuotas = atRisk
		mu.Unlock()
		return nil
	})

	// Group 4: Raw quota rows (always unfiltered — for client-side re-aggregation)
	g.Go(func() error {
		rows, err := h.fetchOverviewQuotaRows(gCtx)
		if err != nil {
			return fmt.Errorf("raw quotas: %w", err)
		}
		mu.Lock()
		response.Quotas = rows
		mu.Unlock()
		return nil
	})

	// Group 5: Raw adjustment rows (always unfiltered — for client-side re-aggregation)
	g.Go(func() error {
		rows, err := h.fetchOverviewAdjustmentRows(gCtx)
		if err != nil {
			return fmt.Errorf("raw adjustments: %w", err)
		}
		mu.Lock()
		response.Adjustments = rows
		mu.Unlock()
		return nil
	})

	if err := g.Wait(); err != nil {
		models.Error(c, http.StatusInternalServerError, models.ErrCodeQueryFailed, err.Error())
		return
	}

	models.Success(c, response)
}

// snapshotCounts holds the aggregate counts from the snapshot query.
type snapshotCounts struct {
	TotalQuotas int
	Critical    int
}

// adjStatCounts holds the aggregate adjustment statistics.
type adjStatCounts struct {
	RecentAdjustments30d int
	OpenTickets          int
	FailedIncreases      int
}

func (h *Handler) fetchOverviewSnapshot(ctx context.Context, params models.QuotaQueryParams) (snapshotCounts, []models.CriticalQuotaChip, []models.TopQuotaBar, error) {
	clauses, args := buildQuotaWhereClauses(params, "REGION", "TENANT_ID", "SUBSCRIPTION_ID", "INSTANCE_TYPE")
	clauses = append([]string{"LAST_UPDATED >= DATEADD(day, -1, CURRENT_TIMESTAMP())"}, clauses...)

	whereSQL := " WHERE " + strings.Join(clauses, " AND ")

	// Query A: KPI counts
	countQuery := `
		SELECT
			COUNT(*)                        AS total_quotas,
			COUNT_IF(USAGE_PERCENT >= 90)   AS critical_quotas
		FROM AZURE_QUOTA_USAGE
	` + whereSQL

	var counts snapshotCounts
	row := h.DB.QueryRowContext(ctx, countQuery, args...)
	if err := row.Scan(&counts.TotalQuotas, &counts.Critical); err != nil {
		return counts, nil, nil, fmt.Errorf("count query: %w", err)
	}

	// Query B: Critical chips (>= 90%)
	chipQuery := `
		SELECT
			QUOTA_NAME,
			ROUND(USAGE_PERCENT, 2) AS usage_pct
		FROM AZURE_QUOTA_USAGE
	` + whereSQL + ` AND USAGE_PERCENT >= 90 ORDER BY USAGE_PERCENT DESC`

	chipRows, err := h.DB.QueryContext(ctx, chipQuery, args...)
	if err != nil {
		return counts, nil, nil, fmt.Errorf("critical chips query: %w", err)
	}
	defer chipRows.Close()

	var chips []models.CriticalQuotaChip
	for chipRows.Next() {
		var c models.CriticalQuotaChip
		if err := chipRows.Scan(&c.QuotaName, &c.UsagePct); err != nil {
			return counts, nil, nil, fmt.Errorf("scan critical chip: %w", err)
		}
		chips = append(chips, c)
	}
	if err := chipRows.Err(); err != nil {
		return counts, nil, nil, fmt.Errorf("critical chips rows: %w", err)
	}
	if chips == nil {
		chips = []models.CriticalQuotaChip{}
	}

	// Query C: Top 10 quotas by usage
	topQuery := `
		SELECT
			QUOTA_NAME,
			ROUND(USAGE_PERCENT, 2) AS usage_pct,
			CURRENT_USAGE,
			QUOTA_LIMIT
		FROM AZURE_QUOTA_USAGE
	` + whereSQL + ` ORDER BY USAGE_PERCENT DESC LIMIT 10`

	topRows, err := h.DB.QueryContext(ctx, topQuery, args...)
	if err != nil {
		return counts, chips, nil, fmt.Errorf("top quotas query: %w", err)
	}
	defer topRows.Close()

	var bars []models.TopQuotaBar
	for topRows.Next() {
		var b models.TopQuotaBar
		if err := topRows.Scan(&b.QuotaName, &b.UsagePct, &b.CurrentUsage, &b.QuotaLimit); err != nil {
			return counts, chips, nil, fmt.Errorf("scan top quota: %w", err)
		}
		bars = append(bars, b)
	}
	if err := topRows.Err(); err != nil {
		return counts, chips, nil, fmt.Errorf("top quotas rows: %w", err)
	}
	if bars == nil {
		bars = []models.TopQuotaBar{}
	}

	return counts, chips, bars, nil
}

func (h *Handler) fetchOverviewTrends(ctx context.Context, params models.QuotaQueryParams) ([]models.UsageTrendPoint, error) {
	clauses, args := buildQuotaWhereClauses(params, "REGION", "TENANT_ID", "SUBSCRIPTION_ID", "INSTANCE_TYPE")
	clauses = append([]string{"LAST_UPDATED >= DATEADD(day, -90, CURRENT_TIMESTAMP())"}, clauses...)

	whereSQL := " WHERE " + strings.Join(clauses, " AND ")

	query := `
		SELECT
			TO_VARCHAR(DATE_TRUNC('day', LAST_UPDATED), 'YYYY-MM-DD') AS usage_date,
			ROUND(MAX(USAGE_PERCENT), 2)                              AS max_usage_pct,
			ROUND(AVG(USAGE_PERCENT), 2)                              AS avg_usage_pct
		FROM AZURE_QUOTA_USAGE
	` + whereSQL + `
		GROUP BY DATE_TRUNC('day', LAST_UPDATED)
		ORDER BY usage_date
	`

	rows, err := h.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("trends query: %w", err)
	}
	defer rows.Close()

	var results []models.UsageTrendPoint
	for rows.Next() {
		var p models.UsageTrendPoint
		if err := rows.Scan(&p.UsageDate, &p.MaxUsagePct, &p.AvgUsagePct); err != nil {
			return nil, fmt.Errorf("scan trend point: %w", err)
		}
		results = append(results, p)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("trends rows: %w", err)
	}
	if results == nil {
		results = []models.UsageTrendPoint{}
	}
	return results, nil
}

func (h *Handler) fetchOverviewAdjustments(ctx context.Context, params models.QuotaQueryParams) (adjStatCounts, []models.AtRiskQuotaRow, error) {
	var stats adjStatCounts

	// --- Sub-query A: Adjustment KPI stats (last 30 days) ---
	adjClauses, adjArgs := buildQuotaWhereClauses(params, "REGION", "TENANT_ID", "SUBSCRIPTION_ID", "INSTANCE_TYPE")
	adjClauses = append([]string{"CREATED_AT >= DATEADD(day, -30, CURRENT_TIMESTAMP())"}, adjClauses...)
	adjWhereSQL := " WHERE " + strings.Join(adjClauses, " AND ")

	statsQuery := `
		SELECT
			COUNT(*)                                                                                               AS recent_adj_30d,
			COUNT_IF(CSP_SUPPORT_REQUEST_ID IS NOT NULL
				AND LOWER(REQUEST_STATUS) IN ('submitted','active','inprogress','partiallycompleted'))              AS open_tickets,
			COUNT_IF(LOWER(REQUEST_STATUS) IN ('failed','timedout'))                                                AS failed_increases
		FROM AZURE_QUOTA_ADJUSTMENTS
	` + adjWhereSQL

	row := h.DB.QueryRowContext(ctx, statsQuery, adjArgs...)
	if err := row.Scan(&stats.RecentAdjustments30d, &stats.OpenTickets, &stats.FailedIncreases); err != nil {
		return stats, nil, fmt.Errorf("adj stats query: %w", err)
	}

	// --- Sub-query B: At-risk quotas (>= 80%) with open-ticket / pending-adjustment flags ---
	usageClauses, usageArgs := buildQuotaWhereClauses(params, "u.REGION", "u.TENANT_ID", "u.SUBSCRIPTION_ID", "u.INSTANCE_TYPE")
	usageClauses = append([]string{
		"u.LAST_UPDATED >= DATEADD(day, -1, CURRENT_TIMESTAMP())",
		"u.USAGE_PERCENT >= 80",
	}, usageClauses...)
	usageWhereSQL := " WHERE " + strings.Join(usageClauses, " AND ")

	atRiskQuery := `
		SELECT
			u.QUOTA_NAME,
			u.REGION,
			u.CURRENT_USAGE,
			u.QUOTA_LIMIT,
			ROUND(u.USAGE_PERCENT, 2) AS usage_pct,
			CASE WHEN EXISTS (
				SELECT 1 FROM AZURE_QUOTA_ADJUSTMENTS a
				WHERE a.QUOTA_NAME = u.QUOTA_NAME
					AND a.SUBSCRIPTION_ID = u.SUBSCRIPTION_ID
					AND a.CSP_SUPPORT_REQUEST_ID IS NOT NULL
					AND LOWER(a.REQUEST_STATUS) IN ('submitted','active','inprogress','partiallycompleted')
					AND a.CREATED_AT >= DATEADD(day, -30, CURRENT_TIMESTAMP())
			) THEN TRUE ELSE FALSE END AS has_open_ticket,
			CASE WHEN EXISTS (
				SELECT 1 FROM AZURE_QUOTA_ADJUSTMENTS a
				WHERE a.QUOTA_NAME = u.QUOTA_NAME
					AND a.SUBSCRIPTION_ID = u.SUBSCRIPTION_ID
					AND LOWER(a.REQUEST_STATUS) IN ('submitted','active','inprogress','partiallycompleted')
					AND a.CREATED_AT >= DATEADD(day, -30, CURRENT_TIMESTAMP())
			) THEN TRUE ELSE FALSE END AS has_pending_adjustment,
			COALESCE(TO_VARCHAR(u.LAST_UPDATED), '') AS last_updated
		FROM AZURE_QUOTA_USAGE u
	` + usageWhereSQL + `
		ORDER BY u.USAGE_PERCENT DESC
	`

	rows, err := h.DB.QueryContext(ctx, atRiskQuery, usageArgs...)
	if err != nil {
		return stats, nil, fmt.Errorf("at-risk query: %w", err)
	}
	defer rows.Close()

	var results []models.AtRiskQuotaRow
	for rows.Next() {
		var r models.AtRiskQuotaRow
		if err := rows.Scan(
			&r.QuotaName, &r.Region, &r.CurrentUsage, &r.QuotaLimit,
			&r.UsagePct, &r.HasOpenTicket, &r.HasPendingAdjustment, &r.LastUpdated,
		); err != nil {
			return stats, nil, fmt.Errorf("scan at-risk: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return stats, nil, fmt.Errorf("at-risk rows: %w", err)
	}
	if results == nil {
		results = []models.AtRiskQuotaRow{}
	}

	return stats, results, nil
}

func (h *Handler) fetchOverviewQuotaRows(ctx context.Context) ([]models.OverviewQuotaRow, error) {
	query := `
		SELECT
			COALESCE(REGION, ''),
			COALESCE(TENANT_ID, ''),
			COALESCE(SUBSCRIPTION_ID, ''),
			COALESCE(SUBSCRIPTION_NAME, ''),
			COALESCE(INSTANCE_TYPE, ''),
			COALESCE(QUOTA_NAME, ''),
			COALESCE(CURRENT_USAGE, 0),
			COALESCE(QUOTA_LIMIT, 0),
			ROUND(COALESCE(USAGE_PERCENT, 0), 2),
			COALESCE(TO_VARCHAR(LAST_UPDATED), '')
		FROM AZURE_QUOTA_USAGE
		WHERE LAST_UPDATED >= DATEADD(day, -1, CURRENT_TIMESTAMP())
		ORDER BY USAGE_PERCENT DESC
	`

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query raw quotas: %w", err)
	}
	defer rows.Close()

	var results []models.OverviewQuotaRow
	for rows.Next() {
		var r models.OverviewQuotaRow
		if err := rows.Scan(
			&r.Region, &r.TenantID, &r.SubscriptionID, &r.SubscriptionName,
			&r.InstanceType, &r.QuotaName, &r.CurrentUsage, &r.QuotaLimit,
			&r.UsagePct, &r.LastUpdated,
		); err != nil {
			return nil, fmt.Errorf("scan raw quota: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("raw quotas rows: %w", err)
	}
	if results == nil {
		results = []models.OverviewQuotaRow{}
	}
	return results, nil
}

func (h *Handler) fetchOverviewAdjustmentRows(ctx context.Context) ([]models.OverviewAdjustmentRow, error) {
	query := `
		SELECT
			COALESCE(QUOTA_NAME, ''),
			COALESCE(REGION, ''),
			COALESCE(TENANT_ID, ''),
			COALESCE(SUBSCRIPTION_ID, ''),
			COALESCE(INSTANCE_TYPE, ''),
			COALESCE(REQUEST_STATUS, ''),
			COALESCE(CSP_SUPPORT_REQUEST_ID, ''),
			COALESCE(TO_VARCHAR(CREATED_AT), '')
		FROM AZURE_QUOTA_ADJUSTMENTS
		ORDER BY CREATED_AT DESC
	`

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query raw adjustments: %w", err)
	}
	defer rows.Close()

	var results []models.OverviewAdjustmentRow
	for rows.Next() {
		var r models.OverviewAdjustmentRow
		if err := rows.Scan(
			&r.QuotaName, &r.Region, &r.TenantID, &r.SubscriptionID,
			&r.InstanceType, &r.RequestStatus, &r.CspSupportRequestID, &r.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan raw adjustment: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("raw adjustments rows: %w", err)
	}
	if results == nil {
		results = []models.OverviewAdjustmentRow{}
	}
	return results, nil
}
