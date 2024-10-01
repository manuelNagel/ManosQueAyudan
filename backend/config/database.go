package config

import (
	"fmt"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
	//"backend/models"
)

func InitDB() (*gorm.DB, error) {
	dsn := "root:Stroppierdoor13@tcp(localhost:3306)/manosqueayudan?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}
	
	// Auto Migrate the schemas
	/*
	err = db.AutoMigrate(&models.Usuario{})
	if err != nil {
    return nil, fmt.Errorf("failed to auto migrate schemas: %v", err)
}
	*/
	return db, nil
}