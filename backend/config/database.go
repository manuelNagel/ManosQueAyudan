package config

import (
	"fmt"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
	"backend/models"
)

func customMigrate(db *gorm.DB, model interface{}) error {
    if !db.Migrator().HasTable(model) {
        if err := db.Migrator().CreateTable(model); err != nil {
            return err
        }
    }
    return db.AutoMigrate(model)
}

func InitDB() (*gorm.DB, error) {
	dsn := "root:Stroppierdoor13@tcp(localhost:3306)/manosqueayudan?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}
	db.Exec("SET FOREIGN_KEY_CHECKS=0;")
    defer db.Exec("SET FOREIGN_KEY_CHECKS=1;")
	// Auto Migrate the schemas
	models := []interface{}{
        &models.Actividad{},
        &models.Usuario{},
        &models.Denuncia{},
        &models.Proyecto{},
        &models.Feedback{},
        &models.Habilidad{},
        &models.Inscripcion{},
        &models.Notificacion{},
        &models.RolProyecto{},
        &models.RolSistema{},
        &models.ProyectosUsuarios{},
	}

	for _, model := range models {
        if err := customMigrate(db, model); err != nil {
            return nil, fmt.Errorf("failed to migrate %T: %v", model, err)
        }
    }
	
	return db, nil
}