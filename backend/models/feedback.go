package models

import (
	"time"
)

type Feedback struct {
	IdFeedback      int       `json:"idFeedback" gorm:"primaryKey;column:IdFeedback"`
	Fecha           time.Time `gorm:"column:Fecha" json:"fecha"`
	Puntuacion      int       `gorm:"column:Puntuacion" json:"puntuacion"`
	Descripcion     string    `gorm:"column:Descripcion" json:"descripcion"`
	RolAutor        bool      `gorm:"column:RolAutor" json:"rolAutor"`
	RolDestinatario bool      `gorm:"column:RolDestinatario" json:"rolDestinatario"`
	Habilitado      bool      `gorm:"column:Habilitado" json:"habilitado"`
	CreatedAt       time.Time `gorm:"column:CreatedAt" json:"createdAt"`
	UpdatedAt       time.Time `gorm:"column:UpdatedAt" json:"updatedAt"`
}

func (Feedback) TableName() string {
    return "Feedback"
}