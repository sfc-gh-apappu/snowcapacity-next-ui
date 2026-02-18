package handlers

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"

	"snowcapacity-server/models"
)

const (
	requestsTable         = "REQUESTS"
	quotaConfigsTable     = "CLOUD_QUOTA_CONFIGS"
	constrainedQuotaTable = "CONSTRAINED_QUOTAS"
)

// ─── Admin Handlers ─────────────────────────────────────────

// AdminRequests returns all capacity requests from the REQUESTS table,
// ordered by created_at DESC. The frontend filters by status client-side.
//
//	GET /api/admin/requests
func (h *Handler) AdminRequests(c *gin.Context) {
	rows, err := h.fetchAllRequests(c.Request.Context())
	if err != nil {
		models.Error(c, 500, models.ErrCodeQueryFailed, err.Error())
		return
	}

	models.Success(c, rows)
}

// QuotaConfigs returns all quota configurations from CLOUD_QUOTA_CONFIGS.
// The full dataset is returned so the frontend can toggle "enabled only" client-side.
//
//	GET /api/admin/quota-configs
func (h *Handler) QuotaConfigs(c *gin.Context) {
	rows, err := h.fetchQuotaConfigs(c.Request.Context())
	if err != nil {
		models.Error(c, 500, models.ErrCodeQueryFailed, err.Error())
		return
	}

	models.Success(c, rows)
}

// ConstrainedQuotas returns all constrained quotas from CONSTRAINED_QUOTAS.
//
//	GET /api/admin/constrained-quotas
func (h *Handler) ConstrainedQuotas(c *gin.Context) {
	rows, err := h.fetchConstrainedQuotas(c.Request.Context())
	if err != nil {
		models.Error(c, 500, models.ErrCodeQueryFailed, err.Error())
		return
	}

	models.Success(c, rows)
}

// ─── Internal helpers ───────────────────────────────────────

func (h *Handler) fetchAllRequests(ctx context.Context) ([]models.AdminRequestRow, error) {
	query := fmt.Sprintf(`
		SELECT
			COALESCE(ID, '')                              AS ID,
			COALESCE(REQUESTOR, '')                       AS REQUESTOR,
			COALESCE(CLOUD, '')                           AS CLOUD,
			COALESCE(SNOWCAP_DEPLOYMENT, '')              AS SNOWCAP_DEPLOYMENT,
			COALESCE(SNOWCAP_CLUSTER, '')                 AS SNOWCAP_CLUSTER,
			COALESCE(TO_VARCHAR(CREATED_AT), '')          AS CREATED_AT,
			COALESCE(TYPE, '')                            AS TYPE,
			COALESCE(SPEC, '')                            AS SPEC,
			COALESCE(STATUS, '')                          AS STATUS
		FROM %s
		ORDER BY CREATED_AT DESC
	`, requestsTable)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query requests: %w", err)
	}
	defer rows.Close()

	var results []models.AdminRequestRow
	for rows.Next() {
		var r models.AdminRequestRow
		if err := rows.Scan(
			&r.ID,
			&r.Requestor,
			&r.Cloud,
			&r.SnowcapDeployment,
			&r.SnowcapCluster,
			&r.CreatedAt,
			&r.Type,
			&r.Spec,
			&r.Status,
		); err != nil {
			return nil, fmt.Errorf("scan request: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows requests: %w", err)
	}

	if results == nil {
		results = []models.AdminRequestRow{}
	}
	return results, nil
}

func (h *Handler) fetchQuotaConfigs(ctx context.Context) ([]models.QuotaConfigRow, error) {
	query := fmt.Sprintf(`
		SELECT
			COALESCE(ID, '')                                AS ID,
			COALESCE(CLOUD, '')                             AS CLOUD,
			COALESCE(PROVIDER_NAMESPACE, '')                AS PROVIDER_NAMESPACE,
			COALESCE(ENABLED, FALSE)                        AS ENABLED,
			COALESCE(REQUESTOR, '')                         AS REQUESTOR,
			COALESCE(THRESHOLD_PERCENT, 0)                  AS THRESHOLD_PERCENT,
			COALESCE(DESCRIPTION, '')                       AS DESCRIPTION,
			COALESCE(TO_VARCHAR(CREATED_AT), '')            AS CREATED_AT,
			COALESCE(TO_VARCHAR(LAST_UPDATED_AT), '')       AS LAST_UPDATED_AT
		FROM %s
		ORDER BY CLOUD, PROVIDER_NAMESPACE
	`, quotaConfigsTable)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query quota configs: %w", err)
	}
	defer rows.Close()

	var results []models.QuotaConfigRow
	for rows.Next() {
		var r models.QuotaConfigRow
		if err := rows.Scan(
			&r.ID,
			&r.Cloud,
			&r.ProviderNamespace,
			&r.Enabled,
			&r.Requestor,
			&r.ThresholdPercent,
			&r.Description,
			&r.CreatedAt,
			&r.LastUpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan quota config: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows quota configs: %w", err)
	}

	if results == nil {
		results = []models.QuotaConfigRow{}
	}
	return results, nil
}

func (h *Handler) fetchConstrainedQuotas(ctx context.Context) ([]models.ConstrainedQuotaRow, error) {
	query := fmt.Sprintf(`
		SELECT
			COALESCE(QUOTA_NAME, '')                    AS QUOTA_NAME,
			COALESCE(REGION, '')                        AS REGION,
			COALESCE(INCREMENT_PERCENT, 0)              AS INCREMENT_PERCENT,
			COALESCE(TO_VARCHAR(CREATED_AT), '')         AS CREATED_AT,
			COALESCE(TO_VARCHAR(LAST_UPDATED), '')       AS LAST_UPDATED
		FROM %s
		ORDER BY QUOTA_NAME, REGION
	`, constrainedQuotaTable)

	rows, err := h.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query constrained quotas: %w", err)
	}
	defer rows.Close()

	var results []models.ConstrainedQuotaRow
	for rows.Next() {
		var r models.ConstrainedQuotaRow
		if err := rows.Scan(
			&r.QuotaName,
			&r.Region,
			&r.IncrementPercent,
			&r.CreatedAt,
			&r.LastUpdated,
		); err != nil {
			return nil, fmt.Errorf("scan constrained quota: %w", err)
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows constrained quotas: %w", err)
	}

	if results == nil {
		results = []models.ConstrainedQuotaRow{}
	}
	return results, nil
}
