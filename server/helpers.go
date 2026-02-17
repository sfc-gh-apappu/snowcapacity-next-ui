package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	"snowcapacity-server/models"
)

// ─── Middleware ──────────────────────────────────────────────

// requestTimingMiddleware records the start time of each request
// so response helpers can compute durationMs automatically.
func requestTimingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		models.MarkStart(c)
		c.Next()
	}
}

func corsMiddleware() gin.HandlerFunc {
	allowedOrigins := strings.Split(os.Getenv("CORS_ORIGINS"), ",")

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		for _, o := range allowedOrigins {
			if strings.TrimSpace(o) == origin {
				c.Header("Access-Control-Allow-Origin", origin)
				break
			}
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// ─── Utilities ──────────────────────────────────────────────

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
