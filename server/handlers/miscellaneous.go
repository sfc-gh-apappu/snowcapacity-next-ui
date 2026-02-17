package handlers

import (
	"github.com/gin-gonic/gin"

	"snowcapacity-server/models"
)

// ─── Health ─────────────────────────────────────────────────

type HealthStatus struct {
	Status string `json:"status"`
}

// Health returns a simple status check.
func (h *Handler) Health(c *gin.Context) {
	models.Success(c, HealthStatus{Status: "ok"})
}
