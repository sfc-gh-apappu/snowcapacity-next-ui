package handlers

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

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
func buildQuotaWhereClauses(params models.QuotaQueryParams, regionCol, tenantCol, subCol, instanceCol string) ([]string, []interface{}) {
	var clauses []string
	var args []interface{}

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
