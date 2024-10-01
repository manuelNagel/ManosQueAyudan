package models

import (
	"time"

	"gorm.io/gorm"
)

type Usuario struct {
    IdUsuario    uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    CreatedAt    time.Time
    UpdatedAt    time.Time
    DeletedAt    *time.Time `gorm:"index"`
    Nombre       string     `json:"nombre"`
    Apellido     string     `json:"apellido"`
    Email        string     `json:"email" gorm:"unique"`
    Password     string     `json:"-"` 
    Activo       bool       `json:"activo"`
    Ciudad       string     `json:"ciudad"`
    RadioTrabajo int        `json:"radioTrabajo"`
}


func (Usuario) TableName() string {
    return "Usuario"
}