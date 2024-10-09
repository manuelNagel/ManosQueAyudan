package models

import (
    "time"
)

type Proyecto struct {
    IdProyecto            uint      `gorm:"column:IdProyecto;primaryKey;type:int unsigned" json:"idProyecto"`
    FechaInicio           time.Time `gorm:"column:FechaInicio" json:"fechaInicio"`
    Localizacion          string    `gorm:"column:Localizacion" json:"localizacion"`
    FechaFinalizacion     time.Time `gorm:"column:FechaFinalizacion" json:"fechaFinalizacion"`
    CantidadParticipantes int       `gorm:"column:CantidadParticipantes" json:"cantidadParticipantes"`
    Nombre                string    `gorm:"column:Nombre" json:"nombre"`
    Descripcion           string    `gorm:"column:Descripcion" json:"descripcion"`
    Horario               time.Time `gorm:"column:Horario" json:"horario"`
    Habilitado            bool      `gorm:"column:Habilitado" json:"habilitado"`
    Usuarios              []Usuario `gorm:"many2many:Proyectos_Usuarios;foreignKey:IdProyecto;joinForeignKey:IdProyecto;References:Id;joinReferences:IdUsuario" json:"usuarios"`
    Roles                 []RolProyecto `gorm:"many2many:Proyectos_Usuarios;foreignKey:IdProyecto;joinForeignKey:IdProyecto;References:IdRol;joinReferences:IdRol" json:"roles"`
    ProyectosUsuarios     []ProyectosUsuarios `gorm:"foreignKey:IdProyecto" json:"-"`
	Actividades           []Actividad `gorm:"foreignKey:ProyectoID" json:"actividades"`  
	Denuncias             []Denuncia `gorm:"many2many:Denuncia_Proyecto;joinForeignKey:ProyectoDenunciado;joinReferences:IdDenuncia" json:"denuncias"`
}

func (Proyecto) TableName() string {
    return "Proyecto"
}