package models

import (
	
)

type Habilidad struct {
    IdHabilidades uint     `gorm:"column:IdHabilidades;primaryKey;autoIncrement;type:int unsigned" json:"idHabilidades"`
    Nombre        string   `gorm:"column:Nombre" json:"nombre"`
    Descripcion   string   `gorm:"column:Descripcion" json:"descripcion"`
    Usuarios      []Usuario `gorm:"many2many:UsuarioHabilidades;" json:"usuarios"`
}

func (Habilidad) TableName() string {
    return "Habilidad"
}