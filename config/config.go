package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port              string
	GinMode           string
	SupabaseURL       string
	SupabaseJWTSecret string
	SupabaseDBURL     string
	GitHubToken       string
	AllowedOrigins    string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists (ignore error if not found)
	_ = godotenv.Load()
	config := &Config{
		Port:    getEnv("PORT", "8080"),
		GinMode: getEnv("GIN_MODE", "debug"),

		SupabaseURL:       os.Getenv("SUPABASE_URL"),
		SupabaseJWTSecret: os.Getenv("SUPABASE_JWT_SECRET"),
		SupabaseDBURL:     os.Getenv("SUPABASE_DB_URL"),

		GitHubToken: os.Getenv("GITHUB_TOKEN"),

		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
	}

	if config.SupabaseDBURL == "" {
		return nil, fmt.Errorf("SUPABASE_DB_URL is required")
	}

	if config.SupabaseJWTSecret == "" {
		return nil, fmt.Errorf("SUPABASE_JWT_SECRET is required")
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
