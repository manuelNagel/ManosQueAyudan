package models

import(
	"time"
)

type Inscripcion struct {
    IdInscripcion    uint      `gorm:"primaryKey;column:IdInscripcion" json:"idInscripcion"`
    FechaInscripcion time.Time `gorm:"column:FechaInscripcion" json:"fechaInscripcion"`
    FechaFinalizacion time.Time `gorm:"column:FechaFinalizacion" json:"fechaFinalizacion"`
}

func (Inscripcion) TableName() string {
    return "Inscripcion"
}