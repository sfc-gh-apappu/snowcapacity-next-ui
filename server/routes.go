package main

import (
	"github.com/gin-gonic/gin"

	"snowcapacity-server/handlers"
)

// RegisterRoutes mounts all API route groups onto the given router.
func RegisterRoutes(r *gin.Engine, h *handlers.Handler) {
	api := r.Group("/api")

	// ─── Miscellaneous ──────────────────────────────────────
	api.GET("/health", h.Health)

	// ─── Home ───────────────────────────────────────────────
	home := api.Group("/home")
	{
		home.GET("/overview", h.HomeOverview)
	}

	// ─── Capacity Overview ──────────────────────────────────
	capacity := api.Group("/capacity")
	{
		capacity.GET("/filters", h.CapacityFilters)
		capacity.GET("/demand", h.CapacityDemand)
	}

	// ─── Quota ──────────────────────────────────────────────
	quota := api.Group("/quota")
	{
		quota.GET("/overview", h.QuotaOverview)
		quota.GET("/filters", h.QuotaFilters)
		quota.GET("/current-usage", h.CurrentUsage)
		quota.GET("/adjustments", h.QuotaAdjustments)
	}

	// ─── Requests ───────────────────────────────────────────
	// requests := api.Group("/requests")
	// {
	// }

	// ─── Reservations ───────────────────────────────────────
	reservations := api.Group("/reservations")
	{
		reservations.GET("/overview", h.ReservationOverview)
		reservations.GET("/filters", h.ReservationFilters)
		reservations.GET("/detail", h.ReservationDetail)
	}

	// ─── Admin ──────────────────────────────────────────────
	admin := api.Group("/admin")
	{
		admin.GET("/requests", h.AdminRequests)
		admin.GET("/quota-configs", h.QuotaConfigs)
		admin.GET("/constrained-quotas", h.ConstrainedQuotas)
	}
}
