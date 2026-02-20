package models

// ─── Reservation Domain Types ───────────────────────────────

// ReservationFiltersResponse contains all filter options for the Reservations page.
// All values are derived from ODCR_RESERVATION (and account name mapping).
type ReservationFiltersResponse struct {
	Accounts          []ReservationAccount `json:"accounts"`
	Regions           []string             `json:"regions"`
	AvailabilityZones []string             `json:"availabilityZones"`
	InstanceTypes     []string             `json:"instanceTypes"`
	InstancePlatforms []string             `json:"instancePlatforms"`
	ReservationTypes  []string             `json:"reservationTypes"`
	States            []string             `json:"states"`
	OwnedOrSharedWith []string             `json:"ownedOrSharedWith"`
}

// ReservationAccount represents an account with ID and display name.
type ReservationAccount struct {
	AccountID   string `json:"accountId"`
	AccountName string `json:"accountName"`
}

// ReservationDetailRow represents a single reservation from ODCR_RESERVATION.
// Contains all columns needed for both the table view and the detail modal.
type ReservationDetailRow struct {
	AwsReservationId       string  `json:"awsReservationId"`
	AccountId              string  `json:"accountId"`
	AccountName            string  `json:"accountName"`
	OwnerAccountId         string  `json:"ownerAccountId"`
	ReservationType        string  `json:"reservationType"`
	InstanceType           string  `json:"instanceType"`
	InstancePlatform       string  `json:"instancePlatform"`
	AvailabilityZone       string  `json:"availabilityZone"`
	TotalInstanceCount     int     `json:"totalInstanceCount"`
	AvailableInstanceCount int     `json:"availableInstanceCount"`
	UsedInstanceCount      int     `json:"usedInstanceCount"`
	Usage                  float64 `json:"usage"`
	CreatedDate            string  `json:"createdDate"`
	StartDate              string  `json:"startDate"`
	EndDate                string  `json:"endDate"`
	State                  string  `json:"state"`
	InstanceMatchCriteria  string  `json:"instanceMatchCriteria"`
}

// ─── Reservation Overview ────────────────────────────────────

// ReservationOverviewRow is a single reservation with all fields needed
// for KPIs, charts, filters, and the detail table. Returned by /api/reservations/overview.
type ReservationOverviewRow struct {
	AwsReservationId       string  `json:"awsReservationId"`
	AccountName            string  `json:"accountName"`
	AccountId              string  `json:"accountId"`
	OwnerAccountId         string  `json:"ownerAccountId"`
	Region                 string  `json:"region"`
	AvailabilityZone       string  `json:"availabilityZone"`
	InstanceType           string  `json:"instanceType"`
	InstancePlatform       string  `json:"instancePlatform"`
	ReservationType        string  `json:"reservationType"`
	State                  string  `json:"state"`
	TotalInstanceCount     int     `json:"totalInstanceCount"`
	AvailableInstanceCount int     `json:"availableInstanceCount"`
	UsedInstances          int     `json:"usedInstances"`
	UsagePct               float64 `json:"usagePct"`
	HourlyPrice            float64 `json:"hourlyPrice"`
	CurrencyCode           string  `json:"currencyCode"`
	StartDate              string  `json:"startDate"`
	EndDate                string  `json:"endDate"`
	CreatedDate            string  `json:"createdDate"`
	Owned                  bool    `json:"owned"`
	UnusedSpendMonthly     float64 `json:"unusedSpendMonthly"`
}

// ReservationOverviewResponse is the top-level payload for GET /api/reservations/overview.
type ReservationOverviewResponse struct {
	Reservations  []ReservationOverviewRow   `json:"reservations"`
	FilterOptions ReservationFiltersResponse `json:"filterOptions"`
}
