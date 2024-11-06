package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	EncryptionKey []byte
	SessionKey    []byte
	DBConfig      DatabaseConfig
}

type DatabaseConfig struct {
	DSN string
}

func LoadConfig() *Config {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found. Using environment variables.")
	}

	// Get encryption key
	encKey := os.Getenv("ENCRYPTION_KEY")
	if encKey == "" {
		log.Fatal("ENCRYPTION_KEY environment variable is required")
	}

	// Get session key
	sessKey := os.Getenv("SESSION_KEY")
	if sessKey == "" {
		log.Fatal("SESSION_KEY environment variable is required")
	}

	// Get database configuration from environment or use default
	dbDSN := os.Getenv("DB_DSN")
	if dbDSN == "" {
		// Use your existing default DSN if environment variable is not set
		dbDSN = "root:@tcp(localhost:3306)/manosqqayudan?charset=utf8mb4&parseTime=True&loc=Local"
	}

	return &Config{
		EncryptionKey: []byte(encKey),
		SessionKey:    []byte(sessKey),
		DBConfig: DatabaseConfig{
			DSN: dbDSN,
		},
	}
}
