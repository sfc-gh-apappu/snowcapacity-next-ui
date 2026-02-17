package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"snowcapacity-server/db"
)

var snowhouse *sql.DB

func main() {
	_ = godotenv.Load(".env.local")
	_ = godotenv.Load(".env")

	cfg, err := db.LoadConfig()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}
	log.Printf("config: cloud=%s env=%s schema=%s", cfg.Cloud, cfg.Environment, cfg.Schema)

	dsn, err := db.BuildDSN(cfg)
	if err != nil {
		log.Fatalf("build DSN: %v", err)
	}

	snowhouse, err = db.NewSnowflakeConnection(dsn)
	if err != nil {
		log.Fatalf("snowflake connection: %v", err)
	}
	defer snowhouse.Close()

	r := gin.Default()
	r.Use(corsMiddleware())

	api := r.Group("/api")
	{
		api.GET("/health", handleHealth)
		api.GET("/quota-usage", handleQuotaUsage)
	}

	port := getEnv("PORT", "8080")
	log.Printf("server listening on :%s", port)
	r.Run(":" + port)
}

// ─── Handlers ───────────────────────────────────────────────

func handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func handleQuotaUsage(c *gin.Context) {
	results, columns, err := queryRows(c.Request.Context(), snowhouse,
		"SELECT * FROM AZURE_QUOTA_USAGE LIMIT 10",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"columns": columns,
		"rows":    results,
	})
}
