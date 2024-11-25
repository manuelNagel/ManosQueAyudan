package models
import (
	"time"
)
type Denuncia struct {
    IdDenuncia  uint      `gorm:"column:IdDenuncia;primaryKey;autoIncrement" json:"idDenuncia"`
    Fecha       time.Time `gorm:"column:Fecha;default:CURRENT_TIMESTAMP" json:"fecha"`
    Descripcion string    `gorm:"column:Descripcion;type:text" json:"descripcion"`
    Estado      string    `gorm:"column:Estado;type:ENUM('Pendiente','En Revisión','Resuelta','Desestimada');default:Pendiente" json:"estado"`
    Habilitado  bool      `gorm:"column:Habilitado;default:true" json:"habilitado"`
    IdUsuario   uint      `gorm:"column:IdUsuario" json:"idUsuario"` // Usuario que realiza la denuncia

    // Relaciones
    Usuario           Usuario   `gorm:"foreignKey:IdUsuario" json:"usuario"`
    DenunciasUsuario  []DenunciaUsuario  `gorm:"foreignKey:IdDenuncia" json:"denunciasUsuario,omitempty"`
    DenunciasProyecto []DenunciaProyecto `gorm:"foreignKey:IdDenuncia" json:"denunciasProyecto,omitempty"`
}


func (Denuncia) TableName() string {
    return "Denuncia"
}