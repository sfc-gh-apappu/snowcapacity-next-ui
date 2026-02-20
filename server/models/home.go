package models

// ─── Home Overview Response ─────────────────────────────────

// HomeOverviewResponse is the top-level payload for GET /api/home/overview.
type HomeOverviewResponse struct {
	ByCloud             []CloudSummary          `json:"byCloud"`
	CapacityOverview    CapacityOverviewData    `json:"capacityOverview"`
	QuotaSummary        QuotaSummaryData        `json:"quotaSummary"`
	ReservationsSummary ReservationsSummaryData `json:"reservationsSummary"`
	RequestsSummary     RequestsSummaryData     `json:"requestsSummary"`
	RecentActivity      []ActivityItem          `json:"recentActivity"`
}

// CloudSummary holds per-cloud health metrics for the Cloud Health strip.
// All fields are symmetric across AWS, Azure, and GCP.
type CloudSummary struct {
	Cloud              string  `json:"cloud"`
	Regions            int     `json:"regions"`
	Deployments        int     `json:"deployments"`
	AvgDemandProxy     float64 `json:"avgDemandProxy"`
	ActiveRequests     int     `json:"activeRequests"`
	CompletedThisMonth int     `json:"completedThisMonth"`
}

// CapacityOverviewData holds the capacity snapshot tile metrics.
type CapacityOverviewData struct {
	TotalDeployments  int     `json:"totalDeployments"`
	AvgUtilizationPct float64 `json:"avgUtilizationPct"`
}

// QuotaSummaryData holds the quota snapshot tile metrics.
type QuotaSummaryData struct {
	TotalQuotasMonitored int     `json:"totalQuotasMonitored"`
	AtRisk               int     `json:"atRisk"`
	AtRiskPct            float64 `json:"atRiskPct"`
}

// ReservationsSummaryData holds the reservation snapshot tile metrics.
type ReservationsSummaryData struct {
	ActiveReservations     int     `json:"activeReservations"`
	UnusedSpendUsdThisWeek float64 `json:"unusedSpendUsdThisWeek"`
}

// RequestsSummaryData holds the requests snapshot tile metrics.
type RequestsSummaryData struct {
	PendingReview      int `json:"pendingReview"`
	CompletedThisMonth int `json:"completedThisMonth"`
}

// ActivityItem represents a single entry in the recent activity feed.
type ActivityItem struct {
	Kind      string            `json:"kind"`
	Timestamp string            `json:"timestamp"`
	Summary   string            `json:"summary"`
	Details   map[string]string `json:"details,omitempty"`
}
