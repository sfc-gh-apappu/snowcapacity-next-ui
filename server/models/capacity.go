package models

import (
	"fmt"
	"strings"
	"time"
)

// ─── Capacity Overview Domain Types ─────────────────────────

// CapacityFiltersResponse is the single, exhaustive response for all filter options.
// Dynamic fields are keyed so the frontend can look up values instantly:
//
//	regions:        "cloud|product"          → []string          e.g. "aws|XP" → ["us-east-1", ...]
//	deployments:    "cloud|product|region"   → []string          e.g. "aws|XP|us-east-1" → ["dep1", ...]
//	warehouseTypes: "CLOUD"                  → []WarehouseTypeMapping
type CapacityFiltersResponse struct {
	Clouds         []string                          `json:"clouds"`
	ViewTypes      []string                          `json:"viewTypes"`
	Products       []string                          `json:"products"`
	Metrics        []string                          `json:"metrics"`
	DateRange      DateRangeDefaults                 `json:"dateRange"`
	Regions        map[string][]string               `json:"regions"`
	Deployments    map[string][]string               `json:"deployments"`
	WarehouseTypes map[string][]WarehouseTypeMapping `json:"warehouseTypes"`
}

// DateRangeDefaults provides sensible defaults and bounds for the date picker.
type DateRangeDefaults struct {
	DefaultFrom string `json:"defaultFrom"`
	DefaultTo   string `json:"defaultTo"`
	MinDate     string `json:"minDate"`
	MaxDate     string `json:"maxDate"`
}

// WarehouseTypeMapping represents a warehouse type → instance type mapping.
type WarehouseTypeMapping struct {
	WarehouseType string `json:"warehouseType"`
	InstanceType  string `json:"instanceType"`
}

// ─── Capacity Demand ────────────────────────────────────────

// CapacityDemandParams are the query params for the demand endpoint.
type CapacityDemandParams struct {
	Cloud         string `form:"cloud" binding:"required"`
	Product       string `form:"product" binding:"required"`
	Region        string `form:"region" binding:"required"`
	FromDate      string `form:"fromDate" binding:"required"`
	ToDate        string `form:"toDate" binding:"required"`
	AggrType      string `form:"aggrType" binding:"required"`
	Deployment    string `form:"deployment"`
	WarehouseType string `form:"warehouseType"`
}

// CapacityDemandResponse is the top-level payload, pre-split by the server.
type CapacityDemandResponse struct {
	Historical []CapacityDemandRow `json:"historical"`
	Forecast   []CapacityDemandRow `json:"forecast"`
}

// CapacityDemandRow represents a single row from the demand/forecast table.
type CapacityDemandRow struct {
	Ds                string  `json:"ds"`
	Deployment        string  `json:"deployment"`
	WhType            string  `json:"whType"`
	AggrType          string  `json:"aggrType"`
	TotalDemand       float64 `json:"totalDemand"`
	FreePool          float64 `json:"freePool"`
	InternalUse       float64 `json:"internalUse"`
	CustomerUse       float64 `json:"customerUse"`
	TotalDemandPred   float64 `json:"totalDemandPred"`
	TotalDemandPredLb float64 `json:"totalDemandPredLb"`
	TotalDemandPredUb float64 `json:"totalDemandPredUb"`
	FreePoolPred      float64 `json:"freePoolPred"`
	FreePoolPredLb    float64 `json:"freePoolPredLb"`
	FreePoolPredUb    float64 `json:"freePoolPredUb"`
	InternalUsePred   float64 `json:"internalUsePred"`
	InternalUsePredLb float64 `json:"internalUsePredLb"`
	InternalUsePredUb float64 `json:"internalUsePredUb"`
	CustomerUsePred   float64 `json:"customerUsePred"`
	CustomerUsePredLb float64 `json:"customerUsePredLb"`
	CustomerUsePredUb float64 `json:"customerUsePredUb"`
}

// ─── Product Table Mapping ──────────────────────────────────

// ProductTableMap maps a product code to its demand inst table name (for filters).
var ProductTableMap = map[string]string{
	"XP":   "xp_demand_inst_daily",
	"FDB":  "fdb_demand_inst_daily",
	"GS":   "gs_demand_inst_daily",
	"SPCS": "spcs_demand_inst_daily",
}

// ProductForecastTableMap maps a product code to its demand forecast table.
var ProductForecastTableMap = map[string]string{
	"XP":   "xp_demand_wh_daily_forecasts",
	"FDB":  "fdb_demand_wh_daily_forecasts",
	"GS":   "gs_demand_wh_daily_forecasts",
	"SPCS": "spcs_demand_wh_daily_forecasts",
}

// ProductTableName returns the inst table name for a product, or an error if invalid.
func ProductTableName(product string) (string, error) {
	table, ok := ProductTableMap[strings.ToUpper(product)]
	if !ok {
		return "", fmt.Errorf("unknown product: %s", product)
	}
	return table, nil
}

// ProductForecastTableName returns the forecast table name for a product.
func ProductForecastTableName(product string) (string, error) {
	table, ok := ProductForecastTableMap[strings.ToUpper(product)]
	if !ok {
		return "", fmt.Errorf("unknown product: %s", product)
	}
	return table, nil
}

// ─── Static Values ──────────────────────────────────────────

// NewCapacityFiltersBase returns the base response with static options and empty dynamic maps.
func NewCapacityFiltersBase() CapacityFiltersResponse {
	now := time.Now().UTC()

	return CapacityFiltersResponse{
		Clouds:    []string{"AWS", "AZURE", "GCP"},
		ViewTypes: []string{"demand", "supply"},
		Products:  []string{"XP", "GS", "FDB", "SPCS"},
		Metrics:   []string{"Average", "Maximum"},
		DateRange: DateRangeDefaults{
			DefaultFrom: now.AddDate(0, 0, -90).Format("2006-01-02"),
			DefaultTo:   now.AddDate(0, 0, 90).Format("2006-01-02"),
			MinDate:     now.AddDate(-3, 0, 0).Format("2006-01-02"),
			MaxDate:     now.AddDate(1, 0, 0).Format("2006-01-02"),
		},
		Regions:        map[string][]string{},
		Deployments:    map[string][]string{},
		WarehouseTypes: map[string][]WarehouseTypeMapping{},
	}
}
