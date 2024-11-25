package models

import (
	"time"
)

type ProyectosUsuarios struct {
	IdProyecto  uint       `gorm:"column:IdProyecto;primaryKey;type:int unsigned" json:"idProyecto"`
	IdUsuario   uint       `gorm:"column:IdUsuario;primaryKey;type:int unsigned" json:"idUsuario"`
	IdRol       uint       `gorm:"column:IdRol;primaryKey;type:int unsigned" json:"idRol"`
	FechaInicio time.Time  `gorm:"column:FechaInicio;primaryKey;default:CURRENT_TIMESTAMP" json:"fechaInicio"`
	FechaFin    *time.Time `gorm:"column:FechaFin" json:"fechaFin"`

	Proyecto Proyecto    `gorm:"foreignKey:IdProyecto" json:"proyecto"`
	Usuario  Usuario     `gorm:"foreignKey:IdUsuario" json:"usuario"`
	Rol      RolProyecto `gorm:"foreignKey:IdRol" json:"rol"`
}

func (ProyectosUsuarios) TableName() string {
	return "Proyectos_Usuarios"
}
