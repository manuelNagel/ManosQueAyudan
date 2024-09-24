package models

import (
	"gorm.io/gorm"
)

type Usuario struct {
	gorm.Model
	Nombre       string `json:"nombre"`
	Apellido     string `json:"apellido"`
	Email        string `json:"email" gorm:"unique"`
	Password     string `json:"password"`
	Activo       bool   `json:"activo"`
	Ciudad       string `json:"ciudad"`
	RadioTrabajo int    `json:"radioTrabajo"`
}