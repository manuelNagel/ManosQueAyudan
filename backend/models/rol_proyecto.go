package models

import (
    "time"
)

type RolProyecto struct {
    IdRol         uint      `gorm:"column:IdRol;primaryKey;type:int unsigned" json:"idRol"`
    Nombre        string    `gorm:"column:Nombre" json:"nombre"`
    Descripcion   string    `gorm:"column:Descripcion" json:"descripcion"`
    FechaInicioRol time.Time `gorm:"column:FechaInicioRol" json:"fechaInicioRol"`
    FechaFinRol   time.Time `gorm:"column:FechaFinRol" json:"fechaFinRol"`
    Proyectos     []Proyecto `gorm:"many2many:Proyectos_Usuarios;foreignKey:IdRol;joinForeignKey:IdRol;References:IdProyecto;joinReferences:IdProyecto" json:"proyectos"`
    Usuarios      []Usuario  `gorm:"many2many:Proyectos_Usuarios;foreignKey:IdRol;joinForeignKey:IdRol;References:Id;joinReferences:IdUsuario" json:"usuarios"`
}

func (RolProyecto) TableName() string {
    return "Rol_proyecto"
}