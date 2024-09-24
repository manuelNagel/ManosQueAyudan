package models

import (
	"time"
)

type Habilidades struct {
	//IdHabilidades uint       `json:"idHabilidades" gorm:"primaryKey"`
	NombreHab        string    `json:"nombre"`
	Descripcion   string    `json:"descripcion"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}