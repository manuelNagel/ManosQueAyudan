package models

import (
	"time"
)

type Usuario struct {
	IdUsuario    int    `json:"idUsuario" gorm:"primaryKey"`
	Nombre       string `json:"nombre"`
	Apellido     string `json:"apellido"`
	Email        string `json:"email" gorm:"unique"`
	Password     string `json:"password"`
	Activo       bool   `json:"activo"`
	Ciudad       string `json:"ciudad"`
	RadioTrabajo int    `json:"radioTrabajo"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (u *Usuario) FullName() string {
	return u.Nombre + " " + u.Apellido
}

func (u *Usuario) Save(db *gorm.DB) error {
	return db.Save(u).Error
}

func GetUsuarioByID(db *gorm.DB, id int) (*Usuario, error) {
	var usuario Usuario
	err := db.First(&usuario, id).Error
	return &usuario, err
}