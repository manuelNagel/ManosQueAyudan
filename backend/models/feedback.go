package models

import (
	"time"
)

type Feedback struct {
	IdFeedback      int       `json:"idFeedback" gorm:"primaryKey"`
	Fecha           time.Time `json:"fecha"`
	Puntuacion      int       `json:"puntuacion"`
	Descripcion     string    `json:"descripcion"`
	RolAutor        bool      `json:"rolAutor"`
	RolDestinatario bool      `json:"rolDestinatario"`
	Habilitado      bool      `json:"habilitado"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}