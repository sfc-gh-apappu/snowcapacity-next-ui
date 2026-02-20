package handlers

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"sort"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"

	"snowcapacity-server/models"
)

const reservationTable = "ODCR_RESERVATION"

// ─── Reservations Handlers ──────────────────────────────────

// ReservationFilters returns all filter options for the Reservations page.
// Runs parallel DISTINCT queries against ODCR_RESERVATION and derives
// regions by stripping the trailing AZ letter from AVAILABILITY_ZONE.
//
//	GET /api/reservations/filters
func (h *Handler) ReservationFilters(c *gin.Context) {
	ctx := c.Request.Context()

	var (
		mu                sync.Mutex
		wg                sync.WaitGroup
		errs              []error
		accountIDs        []string
		availabilityZones []string
		instanceTypes     []string
		instancePlatforms []string
		reservationTypes  []string
		states            []string
	)

	// Helper to run a DISTINCT query for a single column and collect results.
	fetchColumn := func(column string, dest *[]string) {
		wg.Add(1)
		go func() {
			defer wg.Done()
			vals, err := h.fetchDistinctReservationColumn(ctx, column)
			mu.Lock()
			defer mu.Unlock()
			if err != nil {
				errs = append(errs, fmt.Errorf("%s: %w", column, err))
				return
			}
			*dest = vals
		}()
	}

	fetchColumn("ACCOUNT_ID", &accountIDs)
	fetchColumn("AVAILABILITY_ZONE", &availabilityZones)
	fetchColumn("INSTANCE_TYPE", &instanceTypes)
	fetchColumn("INSTANCE_PLATFORM", &instancePlatforms)
	fetchColumn("RESERVATION_TYPE", &reservationTypes)
	fetchColumn("STATE", &states)

	wg.Wait()

	if len(errs) > 0 {
		msgs := make([]string, len(errs))
		for i, e := range errs {
			msgs[i] = e.Error()
		}
		models.Error(c, 500, models.ErrCodeQueryFailed, strings.Join(msgs, "; "))
		return
	}

	// Derive regions by stripping the trailing AZ letter (e.g. us-east-1a → us-east-1).
	regionSet := make(map[string]bool)
	for _, az := range availabilityZones {
		if len(az) > 0 {
			region := az[:len(az)-1]
			regionSet[region] = true
		}
	}
	regions := make([]string, 0, len(regionSet))
	for r := range regionSet {
		regions = append(regions, r)
	}
	sort.Strings(regions)

	// Build account list — IDs for now; names can be enriched later
	// via a separate account-name mapping table.
	accounts := make([]models.ReservationAccount, len(accountIDs))
	for i, id := range accountIDs {
		accounts[i] = models.ReservationAccount{
			AccountID:   id,
			AccountName: id, // placeholder until account name table is wired
		}
	}

	resp := models.ReservationFiltersResponse{
		Accounts:          accounts,
		Regions:           regions,
		AvailabilityZones: availabilityZones,
		InstanceTypes:     instanceTypes,
		InstancePlatforms: instancePlatforms,
		ReservationTypes:  reservationTypes,
		States:            states,
		OwnedOrSharedWith: []string{"Owned", "Shared With"},
	}

	models.Success(c, resp)
}

// ReservationDetail returns all reservations from ODCR_RESERVATION.
// The full dataset is returned so the frontend can cache it and filter
// client‑side (matching the existing Streamlit pattern of load‑once).
//
//	GET /api/reservations/detail
func (h *Handler) ReservationDetail(c *gin.Context) {
	rows, err := h.fetchAllReservations(c.Request.Context())
	if err != nil {
		models.Error(c, 500, models.ErrCodeQueryFailed, err.Error())
		return
	}

	models.Success(c, rows)
}

// ReservationOverview returns a single payload with all reservation data and
// filter options. Two Snowhouse queries run concurrently via errgroup, are
// joined in memory, and the frontend can derive KPIs/charts/filters client-side.
//
//	GET /api/reservations/overview
func (h *Handler) ReservationOverview(c *gin.Context) {
	models.MarkStart(c)
	ctx := c.Request.Context()

	reservations, err := h.fetchOverviewReservations(ctx)
	if err != nil {
		models.Error(c, http.StatusInternalServerError, models.ErrCodeQueryFailed, err.Error())
		return
	}

	// Derive filter options from the reservation rows (no extra SQL)
	filters := deriveReservationFilters(reservations)

	models.Success(c, models.ReservationOverviewResponse{
		Reservations:  reservations,
		FilterOptions: filters,
	})
}

// deriveReservationFilters builds filter option lists from the in-memory reservation set.
func deriveReservationFilters(rows []models.ReservationOverviewRow) models.ReservationFiltersResponse {
	accountMap := make(map[string]string) // id → name
	regionSet := make(map[string]bool)
	azSet := make(map[string]bool)
	typeSet := make(map[string]bool)
	platformSet := make(map[string]bool)
	resTypeSet := make(map[string]bool)
	stateSet := make(map[string]bool)
	hasOwned, hasShared := false, false

	for _, r := range rows {
		if r.AccountId != "" {
			accountMap[r.AccountId] = r.AccountName
		}
		if r.Region != "" {
			regionSet[r.Region] = true
		}
		if r.AvailabilityZone != "" {
			azSet[r.AvailabilityZone] = true
		}
		if r.InstanceType != "" {
			typeSet[r.InstanceType] = true
		}
		if r.InstancePlatform != "" {
			platformSet[r.InstancePlatform] = true
		}
		if r.ReservationType != "" {
			resTypeSet[r.ReservationType] = true
		}
		if r.State != "" {
			stateSet[r.State] = true
		}
		if r.Owned {
			hasOwned = true
		} else {
			hasShared = true
		}
	}

	accounts := make([]models.ReservationAccount, 0, len(accountMap))
	for id, name := range accountMap {
		accounts = append(accounts, models.ReservationAccount{AccountID: id, AccountName: name})
	}
	sort.Slice(accounts, func(i, j int) bool { return accounts[i].AccountName < accounts[j].AccountName })

	ownedOrShared := make([]string, 0, 2)
	if hasOwned {
		ownedOrShared = append(ownedOrShared, "Owned")
	}
	if hasShared {
		ownedOrShared = append(ownedOrShared, "Shared With")
	}

	return models.ReservationFiltersResponse{
		Accounts:          accounts,
		Regions:           sortedKeys(regionSet),
		AvailabilityZones: sortedKeys(azSet),
		InstanceTypes:     sortedKeys(typeSet),
		InstancePlatforms: sortedKeys(platformSet),
		ReservationTypes:  sortedKeys(resTypeSet),
		States:            sortedKeys(stateSet),
		OwnedOrSharedWith: ownedOrShared,
	}
}

// fetchOverviewReservations loads all active/pending/queued reservations with
// columns needed for KPIs, charts, filters, and the detail table.
func (h *Handler) fetchOverviewReservations(ctx context.Context) ([]models.ReservationOverviewRow, error) {
	query := fmt.Sprintf(`
		SELECT
			COALESCE(AWS_RESERVATION_ID, '')            AS AWS_RESERVATION_ID,
			COALESCE(ACCOUNT_NAME, '')                  AS ACCOUNT_NAME,
			COALESCE(ACCOUNT_ID, '')                    AS ACCOUNT_ID,
			COALESCE(OWNER_ACCOUNT_ID, '')              AS OWNER_ACCOUNT_ID,
			COALESCE(AVAILABILITY_ZONE, '')              AS AVAILABILITY_ZONE,
			COALESCE(INSTANCE_TYPE, '')                  AS INSTANCE_TYPE,
			COALESCE(INSTANCE_PLATFORM, '')              AS INSTANCE_PLATFORM,
			COALESCE(RESERVATION_TYPE, '')               AS RESERVATION_TYPE,
			COALESCE(STATE, '')                          AS STATE,
			COALESCE(TOTAL_INSTANCE_COUNT, 0)            AS TOTAL_INSTANCE_COUNT,
			COALESCE(AVAILABLE_INSTANCE_COUNT, 0)        AS AVAILABLE_INSTANCE_COUNT,
			COALESCE(TO_VARCHAR(START_DATE), '')          AS START_DATE,
			COALESCE(TO_VARCHAR(END_DATE), '')            AS END_DATE,
			COALESCE(TO_VARCHAR(CREATED_DATE), '')        AS CREATED_DATE
		FROM %s
		WHERE STATE IN ('ACTIVE', 'PENDING', 'QUEUED')
		ORDER BY CREATED_DATE DESC
	`, reservationTable)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query overview reservations: %w", err)
	}
	defer rows.Close()

	var results []models.ReservationOverviewRow
	for rows.Next() {
		var r models.ReservationOverviewRow
		if err := rows.Scan(
			&r.AwsReservationId,
			&r.AccountName,
			&r.AccountId,
			&r.OwnerAccountId,
			&r.AvailabilityZone,
			&r.InstanceType,
			&r.InstancePlatform,
			&r.ReservationType,
			&r.State,
			&r.TotalInstanceCount,
			&r.AvailableInstanceCount,
			&r.StartDate,
			&r.EndDate,
			&r.CreatedDate,
		); err != nil {
			return nil, fmt.Errorf("scan overview reservation: %w", err)
		}

		r.CurrencyCode = "USD"

		// Derived: region = AZ minus trailing character
		if len(r.AvailabilityZone) > 0 {
			r.Region = r.AvailabilityZone[:len(r.AvailabilityZone)-1]
		}
		// Derived: used instances and usage percentage
		r.UsedInstances = r.TotalInstanceCount - r.AvailableInstanceCount
		if r.TotalInstanceCount > 0 {
			r.UsagePct = math.Round(float64(r.UsedInstances)/float64(r.TotalInstanceCount)*10000) / 100
		}
		// Derived: owned flag
		r.Owned = r.OwnerAccountId == r.AccountId

		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows overview reservations: %w", err)
	}
	if results == nil {
		results = []models.ReservationOverviewRow{}
	}
	return results, nil
}

// ─── Internal helpers ───────────────────────────────────────

// fetchDistinctReservationColumn returns sorted distinct non-null values
// for a single column from ODCR_RESERVATION.
func (h *Handler) fetchDistinctReservationColumn(ctx context.Context, column string) ([]string, error) {
	query := fmt.Sprintf(
		"SELECT DISTINCT COALESCE(%s, '') AS val FROM %s WHERE %s IS NOT NULL ORDER BY val",
		column, reservationTable, column,
	)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query distinct %s: %w", column, err)
	}
	defer rows.Close()

	var results []string
	for rows.Next() {
		var val string
		if err := rows.Scan(&val); err != nil {
			return nil, fmt.Errorf("scan %s: %w", column, err)
		}
		if val != "" {
			results = append(results, val)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows %s: %w", column, err)
	}

	if results == nil {
		results = []string{}
	}
	return results, nil
}

// fetchAllReservations loads every row from ODCR_RESERVATION with all
// columns needed for the table + detail modal. Usage % and used instance
// count are computed server-side.
func (h *Handler) fetchAllReservations(ctx context.Context) ([]models.ReservationDetailRow, error) {
	query := fmt.Sprintf(`
		SELECT
			COALESCE(AWS_RESERVATION_ID, '')          AS AWS_RESERVATION_ID,
			COALESCE(ACCOUNT_ID, '')                  AS ACCOUNT_ID,
			COALESCE(ACCOUNT_NAME, '')                AS ACCOUNT_NAME,
			COALESCE(OWNER_ACCOUNT_ID, '')            AS OWNER_ACCOUNT_ID,
			COALESCE(RESERVATION_TYPE, '')             AS RESERVATION_TYPE,
			COALESCE(INSTANCE_TYPE, '')                AS INSTANCE_TYPE,
			COALESCE(INSTANCE_PLATFORM, '')            AS INSTANCE_PLATFORM,
			COALESCE(AVAILABILITY_ZONE, '')            AS AVAILABILITY_ZONE,
			COALESCE(TOTAL_INSTANCE_COUNT, 0)          AS TOTAL_INSTANCE_COUNT,
			COALESCE(AVAILABLE_INSTANCE_COUNT, 0)      AS AVAILABLE_INSTANCE_COUNT,
			COALESCE(TO_VARCHAR(CREATED_DATE), '')     AS CREATED_DATE,
			COALESCE(TO_VARCHAR(START_DATE), '')       AS START_DATE,
			COALESCE(TO_VARCHAR(END_DATE), '')         AS END_DATE,
			COALESCE(STATE, '')                        AS STATE,
			COALESCE(INSTANCE_MATCH_CRITERIA, '')      AS INSTANCE_MATCH_CRITERIA
		FROM %s
		ORDER BY CREATED_DATE DESC
	`, reservationTable)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query reservations: %w", err)
	}
	defer rows.Close()

	var results []models.ReservationDetailRow
	for rows.Next() {
		var r models.ReservationDetailRow
		if err := rows.Scan(
			&r.AwsReservationId,
			&r.AccountId,
			&r.AccountName,
			&r.OwnerAccountId,
			&r.ReservationType,
			&r.InstanceType,
			&r.InstancePlatform,
			&r.AvailabilityZone,
			&r.TotalInstanceCount,
			&r.AvailableInstanceCount,
			&r.CreatedDate,
			&r.StartDate,
			&r.EndDate,
			&r.State,
			&r.InstanceMatchCriteria,
		); err != nil {
			return nil, fmt.Errorf("scan reservation: %w", err)
		}

		// Compute derived fields
		r.UsedInstanceCount = r.TotalInstanceCount - r.AvailableInstanceCount
		if r.TotalInstanceCount > 0 {
			r.Usage = float64(r.UsedInstanceCount) / float64(r.TotalInstanceCount) * 100
		}

		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows reservations: %w", err)
	}

	if results == nil {
		results = []models.ReservationDetailRow{}
	}
	return results, nil
}
