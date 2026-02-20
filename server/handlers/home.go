package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"

	"snowcapacity-server/models"
)

// ─── Home Overview Handler ──────────────────────────────────

// HomeOverview returns the aggregated home page payload.
// Six query groups run concurrently via errgroup.
//
//	GET /api/home/overview
func (h *Handler) HomeOverview(c *gin.Context) {
	models.MarkStart(c)
	ctx := c.Request.Context()

	var (
		mu       sync.Mutex
		response models.HomeOverviewResponse
	)

	g, gCtx := errgroup.WithContext(ctx)

	// Q1: Per-cloud summary
	g.Go(func() error {
		byCloud, err := h.fetchByCloud(gCtx)
		if err != nil {
			return fmt.Errorf("byCloud: %w", err)
		}
		mu.Lock()
		response.ByCloud = byCloud
		mu.Unlock()
		return nil
	})

	// Q2: Capacity overview (deployments + utilization proxy)
	g.Go(func() error {
		cap, err := h.fetchCapacityOverviewData(gCtx)
		if err != nil {
			return fmt.Errorf("capacityOverview: %w", err)
		}
		mu.Lock()
		response.CapacityOverview = cap
		mu.Unlock()
		return nil
	})

	// Q3: Quota summary
	g.Go(func() error {
		qs, err := h.fetchQuotaSummary(gCtx)
		if err != nil {
			return fmt.Errorf("quotaSummary: %w", err)
		}
		mu.Lock()
		response.QuotaSummary = qs
		mu.Unlock()
		return nil
	})

	// Q4: Reservation summary
	g.Go(func() error {
		rs, err := h.fetchReservationsSummary(gCtx)
		if err != nil {
			return fmt.Errorf("reservationsSummary: %w", err)
		}
		mu.Lock()
		response.ReservationsSummary = rs
		mu.Unlock()
		return nil
	})

	// Q5: Requests summary
	g.Go(func() error {
		rq, err := h.fetchRequestsSummary(gCtx)
		if err != nil {
			return fmt.Errorf("requestsSummary: %w", err)
		}
		mu.Lock()
		response.RequestsSummary = rq
		mu.Unlock()
		return nil
	})

	// Q6: Recent activity
	g.Go(func() error {
		activity, err := h.fetchRecentActivity(gCtx)
		if err != nil {
			return fmt.Errorf("recentActivity: %w", err)
		}
		mu.Lock()
		response.RecentActivity = activity
		mu.Unlock()
		return nil
	})

	if err := g.Wait(); err != nil {
		models.Error(c, http.StatusInternalServerError, models.ErrCodeQueryFailed, err.Error())
		return
	}

	if response.ByCloud == nil {
		response.ByCloud = []models.CloudSummary{}
	}
	if response.RecentActivity == nil {
		response.RecentActivity = []models.ActivityItem{}
	}

	models.Success(c, response)
}

// ─── Q1: Per-cloud summary (symmetric across AWS/Azure/GCP) ─

func (h *Handler) fetchByCloud(ctx context.Context) ([]models.CloudSummary, error) {
	clouds := map[string]*models.CloudSummary{
		"AWS":   {Cloud: "AWS"},
		"AZURE": {Cloud: "AZURE"},
		"GCP":   {Cloud: "GCP"},
	}

	var mu sync.Mutex
	var wg sync.WaitGroup

	// Helper: scan rows of (CLOUD, int) into a per-cloud field.
	scanCloudInt := func(rows interface {
		Next() bool
		Scan(dest ...interface{}) error
	}, setter func(c *models.CloudSummary, v int),
	) {
		for rows.Next() {
			var cloud string
			var cnt int
			if err := rows.Scan(&cloud, &cnt); err != nil {
				continue
			}
			mu.Lock()
			if c, ok := clouds[strings.ToUpper(cloud)]; ok {
				setter(c, cnt)
			}
			mu.Unlock()
		}
	}

	demandUnion := `
		SELECT DISTINCT CLOUD, REGION, DEPLOYMENT
		FROM snowscience.operational_analytics.xp_demand_inst_daily
		UNION
		SELECT DISTINCT CLOUD, REGION, DEPLOYMENT
		FROM snowscience.operational_analytics.gs_demand_inst_daily
		UNION
		SELECT DISTINCT CLOUD, REGION, DEPLOYMENT
		FROM snowscience.operational_analytics.fdb_demand_inst_daily
		UNION
		SELECT DISTINCT CLOUD, REGION, DEPLOYMENT
		FROM snowscience.operational_analytics.spcs_demand_inst_daily
	`

	// 1a: Monitored regions per cloud
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := fmt.Sprintf(`
			WITH all_data AS (%s)
			SELECT CLOUD, COUNT(DISTINCT REGION) AS CNT
			FROM all_data
			GROUP BY CLOUD
		`, demandUnion)
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: regions by cloud failed (best-effort): %v", err)
			return
		}
		defer rows.Close()
		scanCloudInt(rows, func(c *models.CloudSummary, v int) { c.Regions = v })
	}()

	// 1b: Deployments per cloud
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := fmt.Sprintf(`
			WITH all_data AS (%s)
			SELECT CLOUD, COUNT(DISTINCT DEPLOYMENT) AS CNT
			FROM all_data
			GROUP BY CLOUD
		`, demandUnion)
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: deployments by cloud failed (best-effort): %v", err)
			return
		}
		defer rows.Close()
		scanCloudInt(rows, func(c *models.CloudSummary, v int) { c.Deployments = v })
	}()

	// 1c: Avg demand proxy (XP, last 30 days) per cloud
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := `
			SELECT
				CLOUD,
				COALESCE(ROUND(AVG(TOTAL_DEMAND), 2), 0) AS AVG_DEMAND
			FROM snowscience.operational_analytics.xp_demand_wh_daily_forecasts
			WHERE DS >= DATEADD(day, -30, CURRENT_DATE)
			GROUP BY CLOUD
		`
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: avg demand by cloud failed (best-effort): %v", err)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var cloud string
			var avg float64
			if err := rows.Scan(&cloud, &avg); err != nil {
				continue
			}
			mu.Lock()
			if c, ok := clouds[strings.ToUpper(cloud)]; ok {
				c.AvgDemandProxy = avg
			}
			mu.Unlock()
		}
	}()

	// 1d: Active capacity requests per cloud
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := `
			SELECT
				COALESCE(CLOUD, 'UNKNOWN') AS CLOUD,
				COUNT(*) AS CNT
			FROM REQUEST_WORKER_JOBS
			WHERE STATUS IN ('SUBMITTED', 'IN_PROGRESS')
			GROUP BY CLOUD
		`
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: active requests by cloud failed (best-effort): %v", err)
			return
		}
		defer rows.Close()
		scanCloudInt(rows, func(c *models.CloudSummary, v int) { c.ActiveRequests = v })
	}()

	// 1e: Requests completed this month per cloud
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := `
			SELECT
				COALESCE(CLOUD, 'UNKNOWN') AS CLOUD,
				COUNT(*) AS CNT
			FROM REQUESTS
			WHERE STATUS = 'COMPLETED'
			  AND CREATED_AT >= DATE_TRUNC(month, CURRENT_TIMESTAMP())
			GROUP BY CLOUD
		`
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: completed requests by cloud failed (best-effort): %v", err)
			return
		}
		defer rows.Close()
		scanCloudInt(rows, func(c *models.CloudSummary, v int) { c.CompletedThisMonth = v })
	}()

	wg.Wait()

	result := []models.CloudSummary{*clouds["AWS"], *clouds["AZURE"], *clouds["GCP"]}
	return result, nil
}

// ─── Q2: Capacity overview ──────────────────────────────────

func (h *Handler) fetchCapacityOverviewData(ctx context.Context) (models.CapacityOverviewData, error) {
	var result models.CapacityOverviewData

	var mu sync.Mutex
	var wg sync.WaitGroup
	var firstErr error

	// 2a: Total deployments across all product tables
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := fmt.Sprintf(`
			WITH all_deployments AS (
				SELECT DISTINCT CLOUD, REGION, DEPLOYMENT FROM %[1]s.xp_demand_inst_daily
				UNION
				SELECT DISTINCT CLOUD, REGION, DEPLOYMENT FROM %[1]s.gs_demand_inst_daily
				UNION
				SELECT DISTINCT CLOUD, REGION, DEPLOYMENT FROM %[1]s.fdb_demand_inst_daily
				UNION
				SELECT DISTINCT CLOUD, REGION, DEPLOYMENT FROM %[1]s.spcs_demand_inst_daily
			)
			SELECT COUNT(*) FROM all_deployments
		`, capacitySchema)

		var cnt int
		if err := h.DB.QueryRowContext(ctx, query).Scan(&cnt); err != nil {
			mu.Lock()
			firstErr = fmt.Errorf("total deployments: %w", err)
			mu.Unlock()
			return
		}
		mu.Lock()
		result.TotalDeployments = cnt
		mu.Unlock()
	}()

	// 2b: Average utilization proxy (XP forecast table, last 30 days)
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := fmt.Sprintf(`
			SELECT COALESCE(ROUND(AVG(TOTAL_DEMAND), 2), 0)
			FROM %s.xp_demand_wh_daily_forecasts
			WHERE DS >= DATEADD(day, -30, CURRENT_DATE)
		`, capacitySchema)

		var avg float64
		if err := h.DB.QueryRowContext(ctx, query).Scan(&avg); err != nil {
			log.Printf("WARN: avg utilization query failed (best-effort): %v", err)
			return
		}
		mu.Lock()
		result.AvgUtilizationPct = avg
		mu.Unlock()
	}()

	wg.Wait()

	if firstErr != nil {
		return result, firstErr
	}
	return result, nil
}

// ─── Q3: Quota summary ─────────────────────────────────────

func (h *Handler) fetchQuotaSummary(ctx context.Context) (models.QuotaSummaryData, error) {
	query := `
		WITH q AS (
			SELECT USAGE_PERCENT FROM AZURE_QUOTA_USAGE
			WHERE LAST_UPDATED >= DATEADD(day, -1, CURRENT_TIMESTAMP())
		)
		SELECT
			COUNT(*)                                                AS TOTAL,
			COUNT_IF(USAGE_PERCENT >= 80)                          AS AT_RISK,
			COALESCE(ROUND(100.0 * COUNT_IF(USAGE_PERCENT >= 80) / NULLIF(COUNT(*), 0), 2), 0) AS AT_RISK_PCT
		FROM q
	`

	var result models.QuotaSummaryData
	if err := h.DB.QueryRowContext(ctx, query).Scan(
		&result.TotalQuotasMonitored, &result.AtRisk, &result.AtRiskPct,
	); err != nil {
		return result, fmt.Errorf("quota summary: %w", err)
	}
	return result, nil
}

// ─── Q4: Reservation summary ────────────────────────────────

func (h *Handler) fetchReservationsSummary(ctx context.Context) (models.ReservationsSummaryData, error) {
	query := fmt.Sprintf(`
		SELECT COUNT(DISTINCT AWS_RESERVATION_ID)
		FROM %s
		WHERE STATE IN ('ACTIVE', 'PENDING', 'QUEUED')
	`, reservationTable)

	var result models.ReservationsSummaryData
	if err := h.DB.QueryRowContext(ctx, query).Scan(&result.ActiveReservations); err != nil {
		return result, fmt.Errorf("active reservations: %w", err)
	}
	// unusedSpendUsdThisWeek intentionally left as 0 (FINANCE.COGS query deferred)
	return result, nil
}

// ─── Q5: Requests summary ───────────────────────────────────

func (h *Handler) fetchRequestsSummary(ctx context.Context) (models.RequestsSummaryData, error) {
	var result models.RequestsSummaryData
	var mu sync.Mutex
	var wg sync.WaitGroup
	var firstErr error

	// 5a: Pending review
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := fmt.Sprintf(`
			SELECT COUNT(*)
			FROM %s
			WHERE STATUS IN ('SUBMITTED', 'IN_PROGRESS')
		`, requestsTable)

		var cnt int
		if err := h.DB.QueryRowContext(ctx, query).Scan(&cnt); err != nil {
			mu.Lock()
			firstErr = fmt.Errorf("pending review: %w", err)
			mu.Unlock()
			return
		}
		mu.Lock()
		result.PendingReview = cnt
		mu.Unlock()
	}()

	// 5b: Completed this month
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := fmt.Sprintf(`
			SELECT COUNT(*)
			FROM %s
			WHERE STATUS = 'COMPLETED'
			  AND CREATED_AT >= DATE_TRUNC(month, CURRENT_TIMESTAMP())
		`, requestsTable)

		var cnt int
		if err := h.DB.QueryRowContext(ctx, query).Scan(&cnt); err != nil {
			mu.Lock()
			firstErr = fmt.Errorf("completed this month: %w", err)
			mu.Unlock()
			return
		}
		mu.Lock()
		result.CompletedThisMonth = cnt
		mu.Unlock()
	}()

	wg.Wait()

	if firstErr != nil {
		return result, firstErr
	}
	return result, nil
}

// ─── Q6: Recent activity ────────────────────────────────────

func (h *Handler) fetchRecentActivity(ctx context.Context) ([]models.ActivityItem, error) {
	var mu sync.Mutex
	var wg sync.WaitGroup
	var items []models.ActivityItem

	// 6a: Recent quota adjustments (last 7 days)
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := `
			SELECT
				COALESCE(TO_VARCHAR(CREATED_AT, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') AS TS,
				COALESCE(REGION, '')             AS REGION,
				COALESCE(SUBSCRIPTION_ID, '')    AS SUB_ID,
				COALESCE(INSTANCE_TYPE, '')       AS INSTANCE_TYPE,
				COALESCE(QUOTA_NAME, '')          AS QUOTA_NAME,
				COALESCE(REQUEST_STATUS, '')      AS STATUS
			FROM AZURE_QUOTA_ADJUSTMENTS
			WHERE CREATED_AT >= DATEADD(day, -7, CURRENT_TIMESTAMP())
			ORDER BY CREATED_AT DESC
			LIMIT 20
		`
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: recent quota activity failed: %v", err)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var ts, region, subID, instType, quotaName, status string
			if err := rows.Scan(&ts, &region, &subID, &instType, &quotaName, &status); err != nil {
				continue
			}
			summary := fmt.Sprintf("Quota %s: %s in %s", status, quotaName, region)
			item := models.ActivityItem{
				Kind:      "quota_adjustment",
				Timestamp: ts,
				Summary:   summary,
				Details: map[string]string{
					"region":         region,
					"subscriptionId": subID,
					"instanceType":   instType,
					"quotaName":      quotaName,
					"status":         status,
				},
			}
			mu.Lock()
			items = append(items, item)
			mu.Unlock()
		}
	}()

	// 6b: Recent reservation operations (last 7 days, best-effort)
	wg.Add(1)
	go func() {
		defer wg.Done()
		query := `
			SELECT
				TO_VARCHAR(INITIALIZED_TIME, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS TS,
				COALESCE(OPERATION, '')  AS OPERATION,
				COALESCE(STATUS, '')     AS STATUS
			FROM ENG_CLOUD_SERVICES.SNOWCAP_CAPACITY_ENGINE.TRANSACTION
			WHERE OPERATION IN (
				'CREATE_RESERVATION','MODIFY_RESERVATION','MOVE_RESERVATION',
				'SPLIT_RESERVATION','SHARE_RESERVATION','UNSHARE_RESERVATION','CANCEL_RESERVATION'
			)
			AND INITIALIZED_TIME >= DATEADD(day, -7, CURRENT_TIMESTAMP())
			ORDER BY INITIALIZED_TIME DESC
			LIMIT 20
		`
		rows, err := h.DB.QueryContext(ctx, query)
		if err != nil {
			log.Printf("WARN: recent reservation activity failed (best-effort): %v", err)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var ts, operation, status string
			if err := rows.Scan(&ts, &operation, &status); err != nil {
				continue
			}
			opLabel := strings.ReplaceAll(strings.ToLower(operation), "_", " ")
			summary := fmt.Sprintf("Reservation %s (%s)", opLabel, status)
			item := models.ActivityItem{
				Kind:      "reservation_" + strings.ToLower(strings.TrimSuffix(operation, "_RESERVATION")),
				Timestamp: ts,
				Summary:   summary,
				Details: map[string]string{
					"operation": operation,
					"status":    status,
				},
			}
			mu.Lock()
			items = append(items, item)
			mu.Unlock()
		}
	}()

	wg.Wait()

	// Sort all items by timestamp descending, take top 10
	sort.Slice(items, func(i, j int) bool {
		return items[i].Timestamp > items[j].Timestamp
	})
	if len(items) > 10 {
		items = items[:10]
	}

	return items, nil
}
