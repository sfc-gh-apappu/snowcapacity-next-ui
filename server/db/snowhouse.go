package db

import (
	"context"
	"crypto/rsa"
	"database/sql"
	"encoding/pem"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	sf "github.com/snowflakedb/gosnowflake"
	"github.com/youmark/pkcs8"
)

const (
	snowhouseDB      = "ENG_CLOUD_SERVICES"
	prodSchema       = "SNOWCAP_CAPACITY_ENGINE"
	devSchema        = "SNOWCAP_CAPACITY_ENGINE_DEV"
	defaultWarehouse = "SNOWCAPACITY"
	defaultAccount   = "SFCOGSOPS-SNOWHOUSE_AWS_US_WEST_2"
)

type Config struct {
	Cloud       string
	Environment string
	Schema      string
}

func LoadConfig() (*Config, error) {
	env := strings.ToLower(getEnv("ENVIRONMENT", "dev"))

	schema := prodSchema
	if env == "dev" {
		schema = devSchema
	}
	schema = getEnv("SNOWFLAKE_SCHEMA", schema)

	return &Config{
		Cloud:       getEnv("CLOUD", "AZURE"),
		Environment: env,
		Schema:      schema,
	}, nil
}

// BuildDSN constructs a Snowflake DSN from environment variables and config.
func BuildDSN(cfg *Config) (string, error) {
	user := os.Getenv("DB_USER")
	if user == "" {
		return "", fmt.Errorf("DB_USER is required")
	}

	privKeyPEM, err := loadPrivateKeyPEM()
	if err != nil {
		return "", err
	}

	passphrase := os.Getenv("DB_KEY_PASSPHRASE")
	if passphrase == "" {
		return "", fmt.Errorf("DB_KEY_PASSPHRASE is required")
	}

	key, err := parseEncryptedPKCS8Key(privKeyPEM, []byte(passphrase))
	if err != nil {
		return "", fmt.Errorf("parse private key: %w", err)
	}

	account := getEnv("SNOWFLAKE_ACCOUNT", defaultAccount)
	warehouse := getEnv("SNOWFLAKE_WAREHOUSE", defaultWarehouse)

	sfCfg := &sf.Config{
		Account:       account,
		User:          user,
		Database:      snowhouseDB,
		Schema:        cfg.Schema,
		Warehouse:     warehouse,
		Authenticator: sf.AuthTypeJwt,
		PrivateKey:    key,
	}

	dsn, err := sf.DSN(sfCfg)
	if err != nil {
		return "", fmt.Errorf("build DSN: %w", err)
	}
	return dsn, nil
}

// NewSnowflakeConnection opens a Snowflake connection from a DSN string.
func NewSnowflakeConnection(dsn string) (*sql.DB, error) {
	if dsn == "" {
		return nil, fmt.Errorf("database DSN is required")
	}

	log.Printf("Opening Snowflake database connection...")
	db, err := sql.Open("snowflake", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	db.SetConnMaxLifetime(time.Minute * 5)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)

	log.Printf("Pinging Snowflake database (timeout: 30s)...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database (check network access, credentials, and firewall rules): %w", err)
	}

	log.Printf("Successfully connected to Snowflake database")
	return db, nil
}

// ─── Helpers ────────────────────────────────────────────────

// loadPrivateKeyPEM reads the key from DB_PRIV_KEY_PATH (file) or DB_PRIV_KEY (inline).
func loadPrivateKeyPEM() ([]byte, error) {
	if path := os.Getenv("DB_PRIV_KEY_PATH"); path != "" {
		data, err := os.ReadFile(path)
		if err != nil {
			return nil, fmt.Errorf("read key file %s: %w", path, err)
		}
		return data, nil
	}

	raw := os.Getenv("DB_PRIV_KEY")
	if raw == "" {
		return nil, fmt.Errorf("DB_PRIV_KEY_PATH or DB_PRIV_KEY is required")
	}
	raw = strings.ReplaceAll(raw, `\n`, "\n")
	return []byte(raw), nil
}

func parseEncryptedPKCS8Key(pemBytes, pass []byte) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode(pemBytes)
	if block == nil {
		return nil, fmt.Errorf("failed to decode PEM")
	}

	decrypted, err := pkcs8.ParsePKCS8PrivateKey(block.Bytes, pass)
	if err != nil {
		return nil, err
	}

	switch k := decrypted.(type) {
	case *rsa.PrivateKey:
		return k, nil
	default:
		return nil, fmt.Errorf("unexpected key type %T", k)
	}
}

func getEnv(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	return v
}
