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
	Region         string `form:"region"`
	TenantID       string `form:"tenantId"`
	SubscriptionID string `form:"subscriptionId"`
	InstanceType   string `form:"instanceType"`
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
