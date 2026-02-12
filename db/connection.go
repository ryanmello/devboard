package db

import (
	"fmt"
	"log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// establishes a connection to the database
func Connect(databaseURL string) error {
	var err error

	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})

	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection established")
	return nil
}

// runs auto-migration for all models
func AutoMigrate() error {
	err := DB.AutoMigrate(
		&User{},
		&Project{},
		&Education{},
		&Experience{},
		&Follow{},
	)

	if err != nil {
		return fmt.Errorf("failed to run auto-migration: %w", err)
	}

	log.Println("Database migration completed")
	return nil
}

// returns the database instance
func GetDB() *gorm.DB {
	return DB
}
