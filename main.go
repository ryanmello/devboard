package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/api"
	"github.com/ryanmello/devboard/config"
	"github.com/ryanmello/devboard/db"
	"github.com/ryanmello/devboard/middleware"

	"github.com/ryanmello/devboard/docs" // Swagger docs

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Devboard API
// @version 1.0
// @description The Better Portfolio API for Software Engineers
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.devboard.io/support
// @contact.email support@devboard.io

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Enter your bearer token in the format: Bearer {token}

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Connect to database
	if err := db.Connect(cfg.SupabaseDBURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Optional: Run migrations
	if err := db.AutoMigrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Fetch Supabase JWKS public key for JWT verification
	publicKey, err := middleware.FetchJWKS(cfg.SupabaseURL)
	if err != nil {
		log.Fatalf("Failed to fetch Supabase JWKS: %v", err)
	}
	log.Println("Supabase JWKS public key loaded")

	// Set Swagger host dynamically — use Railway's public domain in prod, localhost in dev
	if domain := os.Getenv("API_URL"); domain != "" {
		docs.SwaggerInfo.Host = domain
		docs.SwaggerInfo.Schemes = []string{"https"}
	} else {
		docs.SwaggerInfo.Host = fmt.Sprintf("localhost:%s", cfg.Port)
	}

	// Setup router
	r := api.SetupRouter(publicKey)

	// Swagger documentation endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
