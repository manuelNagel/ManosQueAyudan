// models/actividad.go
package models

type Actividad struct {
    NumeroActividad int      `gorm:"column:NumeroActividad;primaryKey" json:"numeroActividad"`
    ProyectoID      uint     `gorm:"column:ProyectoID;primaryKey" json:"proyectoID"`
    Nombre          string   `gorm:"column:Nombre" json:"nombre"`
    Descripcion     string   `gorm:"column:Descripcion" json:"descripcion"`
    Estado          uint     `gorm:"column:Estado" json:"estado"`
    Proyecto        Proyecto `gorm:"foreignKey:ProyectoID" json:"-"`
}

func (Actividad) TableName() string {
	return "Actividad"
}
