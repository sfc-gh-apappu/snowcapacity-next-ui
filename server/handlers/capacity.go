package handlers

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"snowcapacity-server/models"
)

const capacitySchema = "snowscience.operational_analytics"

// ─── Capacity Overview Handlers ─────────────────────────────

// CapacityFilters returns every filter option in a single response.
// Static options are always present. Dynamic options (regions, deployments,
// warehouse types) are fetched across all cloud/product combinations in
// parallel so the frontend can cache everything and filter client‑side.
//
//	GET /api/capacity/filters
func (h *Handler) CapacityFilters(c *gin.Context) {
	resp := models.NewCapacityFiltersBase()
	ctx := c.Request.Context()

	var (
		mu   sync.Mutex
		wg   sync.WaitGroup
		errs []error
	)

	// For each product table, fetch all cloud+region+deployment combos.
	for product, table := range models.ProductTableMap {
		wg.Add(1)
		go func(product, table string) {
			defer wg.Done()

			regions, deployments, err := h.fetchRegionsAndDeployments(ctx, table)
			mu.Lock()
			defer mu.Unlock()
			if err != nil {
				errs = append(errs, fmt.Errorf("%s: %w", product, err))
				return
			}
			for key, vals := range regions {
				// key is "cloud|product" but cloud comes from DB; append product
				resp.Regions[key+"|"+product] = vals
			}
			for key, vals := range deployments {
				// key is "cloud|region"; append product
				resp.Deployments[key+"|"+product] = vals
			}
		}(product, table)
	}

	// Fetch warehouse types for every cloud in parallel.
	wg.Add(1)
	go func() {
		defer wg.Done()

		whMap, err := h.fetchAllWarehouseTypes(ctx)
		mu.Lock()
		defer mu.Unlock()
		if err != nil {
			errs = append(errs, fmt.Errorf("warehouse types: %w", err))
			return
		}
		resp.WarehouseTypes = whMap
	}()

	wg.Wait()

	if len(errs) > 0 {
		msgs := make([]string, len(errs))
		for i, e := range errs {
			msgs[i] = e.Error()
		}
		models.Error(c, 500, models.ErrCodeQueryFailed, strings.Join(msgs, "; "))
		return
	}

	models.Success(c, resp)
}

// CapacityDemand returns demand + forecast data for a given product/region/date range.
// A single query fetches all columns (historical actuals + forecast predictions)
// so the frontend gets everything in one call.
//
//	GET /api/capacity/demand?cloud=aws&product=XP&region=us-east-1
//	    &fromDate=2025-11-19&toDate=2026-05-18&aggrType=max
//	    [&deployment=...] [&warehouseType=...]
func (h *Handler) CapacityDemand(c *gin.Context) {
	var params models.CapacityDemandParams
	if err := c.ShouldBindQuery(&params); err != nil {
		models.Error(c, 400, models.ErrCodeValidation, err.Error())
		return
	}

	rows, err := h.fetchCapacityDemand(c.Request.Context(), params)
	if err != nil {
		models.Error(c, 500, models.ErrCodeQueryFailed, err.Error())
		return
	}

	today := time.Now().UTC().Format("2006-01-02")

	resp := models.CapacityDemandResponse{
		Historical: []models.CapacityDemandRow{},
		Forecast:   []models.CapacityDemandRow{},
	}
	for _, r := range rows {
		if r.Ds <= today {
			resp.Historical = append(resp.Historical, r)
		} else {
			resp.Forecast = append(resp.Forecast, r)
		}
	}

	models.Success(c, resp)
}

// ─── Internal helpers ───────────────────────────────────────

// fetchRegionsAndDeployments queries a single product table and returns:
//   - regions:     "cloud" → sorted list of distinct regions
//   - deployments: "cloud|region" → sorted list of distinct deployments
func (h *Handler) fetchRegionsAndDeployments(ctx context.Context, table string) (
	regions map[string][]string,
	deployments map[string][]string,
	err error,
) {
	query := fmt.Sprintf(`
		SELECT DISTINCT CLOUD, REGION, DEPLOYMENT
		FROM %s.%s
		ORDER BY CLOUD, REGION, DEPLOYMENT
	`, capacitySchema, table)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, fmt.Errorf("query %s: %w", table, err)
	}
	defer rows.Close()

	regions = make(map[string][]string)
	deployments = make(map[string][]string)
	regionSet := make(map[string]map[string]bool) // cloud → set of regions

	for rows.Next() {
		var cloud, region, deployment string
		if err := rows.Scan(&cloud, &region, &deployment); err != nil {
			return nil, nil, fmt.Errorf("scan %s: %w", table, err)
		}

		// Track unique regions per cloud
		if regionSet[cloud] == nil {
			regionSet[cloud] = make(map[string]bool)
		}
		if !regionSet[cloud][region] {
			regionSet[cloud][region] = true
			regions[cloud] = append(regions[cloud], region)
		}

		// Track deployments per cloud+region
		depKey := cloud + "|" + region
		deployments[depKey] = append(deployments[depKey], deployment)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, fmt.Errorf("rows %s: %w", table, err)
	}

	return regions, deployments, nil
}

// fetchAllWarehouseTypes returns warehouse type mappings keyed by cloud (uppercase).
func (h *Handler) fetchAllWarehouseTypes(ctx context.Context) (map[string][]models.WarehouseTypeMapping, error) {
	query := fmt.Sprintf(`
		SELECT DISTINCT CLOUD, WH_TYPE, INSTANCE_TYPE
		FROM %s.xp_demand_inst_wh_map
		ORDER BY CLOUD, WH_TYPE, INSTANCE_TYPE
	`, capacitySchema)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query warehouse types: %w", err)
	}
	defer rows.Close()

	result := make(map[string][]models.WarehouseTypeMapping)
	for rows.Next() {
		var cloud string
		var m models.WarehouseTypeMapping
		if err := rows.Scan(&cloud, &m.WarehouseType, &m.InstanceType); err != nil {
			return nil, fmt.Errorf("scan warehouse type: %w", err)
		}
		result[cloud] = append(result[cloud], m)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows warehouse types: %w", err)
	}

	return result, nil
}

// fetchCapacityDemand runs a single query that returns both historical actuals
// and forecast predictions. COALESCE wraps every nullable numeric/string column
// so we never hit Snowflake NULL → Go type scan errors.
func (h *Handler) fetchCapacityDemand(ctx context.Context, p models.CapacityDemandParams) ([]models.CapacityDemandRow, error) {
	table, err := models.ProductForecastTableName(p.Product)
	if err != nil {
		return nil, err
	}

	// Required WHERE clauses
	clauses := []string{
		"CLOUD = ?",
		"REGION = ?",
		"DS >= ?",
		"DS <= ?",
		"AGGR_TYPE = ?",
	}
	args := []interface{}{
		strings.ToLower(p.Cloud),
		p.Region,
		p.FromDate,
		p.ToDate,
		strings.ToLower(p.AggrType),
	}

	// Optional filters
	if p.Deployment != "" {
		clauses = append(clauses, "DEPLOYMENT = ?")
		args = append(args, p.Deployment)
	}
	if p.WarehouseType != "" {
		clauses = append(clauses, "WH_TYPE = ?")
		args = append(args, p.WarehouseType)
	}

	query := fmt.Sprintf(`
		SELECT
			TO_VARCHAR(DS, 'YYYY-MM-DD') AS DS,
			COALESCE(DEPLOYMENT, '')     AS DEPLOYMENT,
			COALESCE(WH_TYPE, '')        AS WH_TYPE,
			COALESCE(AGGR_TYPE, '')      AS AGGR_TYPE,
			COALESCE(TOTAL_DEMAND, 0)    AS TOTAL_DEMAND,
			COALESCE(FREE_POOL, 0)       AS FREE_POOL,
			COALESCE(INTERNAL_USE, 0)    AS INTERNAL_USE,
			COALESCE(CUSTOMER_USE, 0)    AS CUSTOMER_USE,
			COALESCE(TOTAL_DEMAND_PRED, 0)    AS TOTAL_DEMAND_PRED,
			COALESCE(TOTAL_DEMAND_PRED_LB, 0) AS TOTAL_DEMAND_PRED_LB,
			COALESCE(TOTAL_DEMAND_PRED_UB, 0) AS TOTAL_DEMAND_PRED_UB,
			COALESCE(FREE_POOL_PRED, 0)       AS FREE_POOL_PRED,
			COALESCE(FREE_POOL_PRED_LB, 0)    AS FREE_POOL_PRED_LB,
			COALESCE(FREE_POOL_PRED_UB, 0)    AS FREE_POOL_PRED_UB,
			COALESCE(INTERNAL_USE_PRED, 0)    AS INTERNAL_USE_PRED,
			COALESCE(INTERNAL_USE_PRED_LB, 0) AS INTERNAL_USE_PRED_LB,
			COALESCE(INTERNAL_USE_PRED_UB, 0) AS INTERNAL_USE_PRED_UB,
			COALESCE(CUSTOMER_USE_PRED, 0)    AS CUSTOMER_USE_PRED,
			COALESCE(CUSTOMER_USE_PRED_LB, 0) AS CUSTOMER_USE_PRED_LB,
			COALESCE(CUSTOMER_USE_PRED_UB, 0) AS CUSTOMER_USE_PRED_UB
		FROM %s.%s
		WHERE %s
		GROUP BY ALL
		ORDER BY DS, DEPLOYMENT
	`, capacitySchema, table, strings.Join(clauses, " AND "))

	rows, err := h.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query capacity demand: %w", err)
	}
	defer rows.Close()

	var results []models.CapacityDemandRow
	for rows.Next() {
		var r models.CapacityDemandRow
		if err := rows.Scan(
			&r.Ds, &r.Deployment, &r.WhType, &r.AggrType,
			&r.TotalDemand, &r.FreePool, &r.InternalUse, &r.CustomerUse,
			&r.TotalDemandPred, &r.TotalDemandPredLb, &r.TotalDemandPredUb,
			&r.FreePoolPred, &r.FreePoolPredLb, &r.FreePoolPredUb,
			&r.InternalUsePred, &r.InternalUsePredLb, &r.InternalUsePredUb,
			&r.CustomerUsePred, &r.CustomerUsePredLb, &r.CustomerUsePredUb,
		); err != nil {
			return nil, fmt.Errorf("scan demand row: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows demand: %w", err)
	}

	if results == nil {
		results = []models.CapacityDemandRow{}
	}
	return results, nil
}
