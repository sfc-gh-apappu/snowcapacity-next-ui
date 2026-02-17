package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"snowcapacity-server/db"
	"snowcapacity-server/handlers"
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

	h := handlers.New(snowhouse)

	r := gin.Default()
	r.Use(requestTimingMiddleware())
	r.Use(corsMiddleware())

	RegisterRoutes(r, h)

	port := getEnv("PORT", "8080")
	log.Printf("server listening on :%s", port)
	r.Run(":" + port)
}
