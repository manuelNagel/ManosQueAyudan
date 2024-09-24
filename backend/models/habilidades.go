package models

import (
	"time"
)

type Habilidades struct {
	IdHabilidades int       `json:"idHabilidades" gorm:"primaryKey"`
	Nombre        string    `json:"nombre"`
	Descripcion   string    `json:"descripcion"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}