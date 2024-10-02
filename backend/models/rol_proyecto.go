package models

import(
	"time"
)
type RolProyecto struct {
    IdRol         uint      `gorm:"primaryKey;column:IdRol" json:"idRol"`
    Nombre        string    `gorm:"column:Nombre" json:"nombre"`
    Descripcion   string    `gorm:"column:Descripcion" json:"descripcion"`
    FechaInicioRol time.Time `gorm:"column:FechaInicioRol" json:"fechaInicioRol"`
    FechaFinRol   time.Time `gorm:"column:FechaFinRol" json:"fechaFinRol"`
}

func (RolProyecto) TableName() string {
    return "Rol_Proyecto"
}