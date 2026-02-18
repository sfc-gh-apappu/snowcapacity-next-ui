package models

// ─── Admin Domain Types ─────────────────────────────────────

// AdminRequestRow represents a single row from the REQUESTS table.
type AdminRequestRow struct {
	ID                string `json:"id"`
	Requestor         string `json:"requestor"`
	Cloud             string `json:"cloud"`
	SnowcapDeployment string `json:"snowcapDeployment"`
	SnowcapCluster    string `json:"snowcapCluster"`
	CreatedAt         string `json:"createdAt"`
	Type              string `json:"type"`
	Spec              string `json:"spec"`
	Status            string `json:"status"`
}

// ConstrainedQuotaRow represents a single row from CONSTRAINED_QUOTAS.
type ConstrainedQuotaRow struct {
	QuotaName        string  `json:"quotaName"`
	Region           string  `json:"region"`
	IncrementPercent float64 `json:"incrementPercent"`
	CreatedAt        string  `json:"createdAt"`
	LastUpdated      string  `json:"lastUpdated"`
}

// QuotaConfigRow represents a single row from CLOUD_QUOTA_CONFIGS.
type QuotaConfigRow struct {
	ID                string  `json:"id"`
	Cloud             string  `json:"cloud"`
	ProviderNamespace string  `json:"providerNamespace"`
	Enabled           bool    `json:"enabled"`
	Requestor         string  `json:"requestor"`
	ThresholdPercent  float64 `json:"thresholdPercent"`
	Description       string  `json:"description"`
	CreatedAt         string  `json:"createdAt"`
	LastUpdatedAt     string  `json:"lastUpdatedAt"`
}
