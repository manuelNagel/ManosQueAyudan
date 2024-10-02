// models/actividad.go
package models

type Actividad struct {
  NumeroActividad int    `gorm:"column:NumeroActividad; primaryKey;autoIncrement" json:"numeroActividad"`
    Nombre          string `gorm:"column:Nombre" json:"nombre"`
    Descripcion     string `gorm:"column:Descripcion" json:"descripcion"`
    Estado          bool   `gorm:"column:Estado" json:"estado"`
}

func (Actividad) TableName() string {
    return "Actividad"
}