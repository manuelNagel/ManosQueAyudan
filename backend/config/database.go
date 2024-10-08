package config

import (
	"fmt"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
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
    
    /*db.Exec("SET FOREIGN_KEY_CHECKS=0;")
    defer db.Exec("SET FOREIGN_KEY_CHECKS=1;")

    // Auto Migrate all tables except ProyectosUsuarios
    modelsToMigrate := []interface{}{
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
    }

    for _, model := range modelsToMigrate {
        if err := db.AutoMigrate(model); err != nil {
            return nil, fmt.Errorf("failed to migrate %T: %v", model, err)
        }
    }

    // Handle ProyectosUsuarios separately
    if db.Migrator().HasTable(&models.ProyectosUsuarios{}) {
        // Table exists, do nothing
    } else {
        // Table doesn't exist, create it
        err = db.Migrator().CreateTable(&models.ProyectosUsuarios{})
        if err != nil {
            return nil, fmt.Errorf("failed to create ProyectosUsuarios table: %v", err)
        }
    }
	*/
    return db, nil
}