package models
import(
	"time"
)


type ProyectosUsuarios struct {
    IdProyecto  uint       `gorm:"column:IdProyecto;primaryKey;type:int unsigned" json:"idProyecto"`
    IdUsuario   uint       `gorm:"column:IdUsuario;primaryKey;type:int unsigned" json:"idUsuario"`
    IdRol       uint       `gorm:"column:IdRol;primaryKey;type:int unsigned" json:"idRol"`
    FechaInicio time.Time  `gorm:"column:FechaInicio;default:CURRENT_TIMESTAMP" json:"fechaInicio"`
    FechaFin    *time.Time `gorm:"column:FechaFin;default:NULL" json:"fechaFin"`
    RolProyecto RolProyecto `gorm:"foreignKey:IdRol;references:IdRol" json:"rolProyecto"`
}

func (ProyectosUsuarios) TableName() string {
    return "Proyectos_Usuarios"
}
