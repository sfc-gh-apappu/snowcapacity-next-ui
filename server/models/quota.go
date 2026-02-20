package models

// ─── Quota Domain Types ─────────────────────────────────────

// CurrentUsageRow represents a single row from AZURE_QUOTA_USAGE.
type CurrentUsageRow struct {
	Region            string  `json:"region"`
	TenantID          string  `json:"tenantId"`
	SubscriptionID    string  `json:"subscriptionId"`
	SubscriptionName  string  `json:"subscriptionName"`
	ProviderNamespace string  `json:"providerNamespace"`
	InstanceType      string  `json:"instanceType"`
	QuotaName         string  `json:"quotaName"`
	CurrentUsage      float64 `json:"currentUsage"`
	QuotaLimit        float64 `json:"quotaLimit"`
	UsagePercent      float64 `json:"usagePercent"`
	Unit              string  `json:"unit"`
	LastUpdated       string  `json:"lastUpdated"`
}

// QuotaFilters contains the distinct filter values available for the quota page.
type QuotaFilters struct {
	Regions           []string `json:"regions"`
	TenantIDs         []string `json:"tenantIds"`
	SubscriptionIDs   []string `json:"subscriptionIds"`
	SubscriptionNames []string `json:"subscriptionNames"`
	InstanceTypes     []string `json:"instanceTypes"`
}

// QuotaQueryParams are the shared optional query-string filters for quota endpoints.
type QuotaQueryParams struct {
	Cloud          string `form:"cloud"`
	Region         string `form:"region"`
	TenantID       string `form:"tenantId"`
	SubscriptionID string `form:"subscriptionId"`
	InstanceType   string `form:"instanceType"`
}

// ─── Quota Overview Response Types ──────────────────────────

// QuotaOverviewResponse is the top-level shape returned by GET /api/quota/overview.
// Pre-computed fields (kpis, charts, atRiskQuotas) reflect the unfiltered initial view.
// Raw arrays (quotas, adjustments) are always unfiltered so the frontend can
// recompute aggregations client-side when filters change, avoiding extra round trips.
type QuotaOverviewResponse struct {
	KPIs         OverviewKPIs            `json:"kpis"`
	Charts       OverviewCharts          `json:"charts"`
	AtRiskQuotas []AtRiskQuotaRow        `json:"atRiskQuotas"`
	Quotas       []OverviewQuotaRow      `json:"quotas"`
	Adjustments  []OverviewAdjustmentRow `json:"adjustments"`
}

// OverviewQuotaRow is a lightweight per-quota row with all dimension columns,
// enabling client-side filtering and re-aggregation.
type OverviewQuotaRow struct {
	Region           string  `json:"region"`
	TenantID         string  `json:"tenantId"`
	SubscriptionID   string  `json:"subscriptionId"`
	SubscriptionName string  `json:"subscriptionName"`
	InstanceType     string  `json:"instanceType"`
	QuotaName        string  `json:"quotaName"`
	CurrentUsage     float64 `json:"currentUsage"`
	QuotaLimit       float64 `json:"quotaLimit"`
	UsagePct         float64 `json:"usagePct"`
	LastUpdated      string  `json:"lastUpdated"`
}

// OverviewAdjustmentRow is a lightweight adjustment row with fields needed
// to derive KPI stats and at-risk flags client-side.
type OverviewAdjustmentRow struct {
	QuotaName           string `json:"quotaName"`
	Region              string `json:"region"`
	TenantID            string `json:"tenantId"`
	SubscriptionID      string `json:"subscriptionId"`
	InstanceType        string `json:"instanceType"`
	RequestStatus       string `json:"requestStatus"`
	CspSupportRequestID string `json:"cspSupportRequestId"`
	CreatedAt           string `json:"createdAt"`
}

// OverviewKPIs represents the 5 stat cards + critical-utilization chip strip.
type OverviewKPIs struct {
	TotalQuotas          int                 `json:"totalQuotas"`
	Critical             int                 `json:"critical"`
	OpenTickets          int                 `json:"openTickets"`
	FailedIncreases      int                 `json:"failedIncreases"`
	RecentAdjustments30d int                 `json:"recentAdjustments30d"`
	CriticalQuotas       []CriticalQuotaChip `json:"criticalQuotas"`
}

// CriticalQuotaChip is a quota at >= 90% utilization shown as a chip.
type CriticalQuotaChip struct {
	QuotaName string  `json:"quotaName"`
	UsagePct  float64 `json:"usagePct"`
}

// OverviewCharts contains data for the usage trend line chart and top quotas bar chart.
type OverviewCharts struct {
	UsageTrend       []UsageTrendPoint `json:"usageTrend"`
	TopQuotasByUsage []TopQuotaBar     `json:"topQuotasByUsage"`
}

// UsageTrendPoint is a single day in the 90-day usage trend series.
type UsageTrendPoint struct {
	UsageDate   string  `json:"usageDate"`
	MaxUsagePct float64 `json:"maxUsagePct"`
	AvgUsagePct float64 `json:"avgUsagePct"`
}

// TopQuotaBar is a single bar in the "Top Quotas by Usage" horizontal bar chart.
type TopQuotaBar struct {
	QuotaName    string  `json:"quotaName"`
	UsagePct     float64 `json:"usagePct"`
	CurrentUsage float64 `json:"currentUsage"`
	QuotaLimit   float64 `json:"quotaLimit"`
}

// AtRiskQuotaRow is a quota at >= 80% utilization for the bottom table.
type AtRiskQuotaRow struct {
	QuotaName            string  `json:"quotaName"`
	Region               string  `json:"region"`
	CurrentUsage         float64 `json:"currentUsage"`
	QuotaLimit           float64 `json:"quotaLimit"`
	UsagePct             float64 `json:"usagePct"`
	HasOpenTicket        bool    `json:"hasOpenTicket"`
	HasPendingAdjustment bool    `json:"hasPendingAdjustment"`
	LastUpdated          string  `json:"lastUpdated"`
}

// QuotaAdjustmentRow represents a single row from the adjustments query.
type QuotaAdjustmentRow struct {
	ID                         string  `json:"id"`
	QuotaID                    string  `json:"quotaId"`
	Region                     string  `json:"region"`
	TenantID                   string  `json:"tenantId"`
	SubscriptionID             string  `json:"subscriptionId"`
	SubscriptionName           string  `json:"subscriptionName"`
	InstanceType               string  `json:"instanceType"`
	QuotaName                  string  `json:"quotaName"`
	LimitBeforeAdjustment      float64 `json:"limitBeforeAdjustment"`
	RequestedNewLimit          float64 `json:"requestedNewLimit"`
	UsagePercent               float64 `json:"usagePercent"`
	Unit                       string  `json:"unit"`
	RequestStatus              string  `json:"requestStatus"`
	CspSupportRequestID        string  `json:"cspSupportRequestId"`
	CspSupportRequestTimestamp string  `json:"cspSupportRequestTimestamp"`
	LastAdjustmentStatusCheck  string  `json:"lastAdjustmentStatusCheck"`
	StatusCheckCount           int     `json:"statusCheckCount"`
	Justification              string  `json:"justification"`
	Message                    string  `json:"message"`
	CreatedAt                  string  `json:"createdAt"`
	LastUpdated                string  `json:"lastUpdated"`
	Requestor                  string  `json:"requestor"`
}
