package models
import (
	"time"
)
type Denuncia struct {
    IdDenuncia  uint      `gorm:"column:IdDenuncia;primaryKey;type:int unsigned" json:"idDenuncia"`
    Fecha       time.Time `gorm:"column:Fecha" json:"fecha"`
    Descripcion string    `gorm:"column:Descripcion" json:"descripcion"`
    Habilitado  bool      `gorm:"column:Habilitado" json:"habilitado"`
    IdUsuario   uint      `gorm:"column:IdUsuario;type:int unsigned" json:"idUsuario"`
    Estado      string    `gorm:"column:Estado" json:"estado"`
    Usuario     Usuario   `gorm:"foreignKey:IdUsuario" json:"usuario"`
    UsuariosDenunciados []Usuario `gorm:"many2many:Denuncia_Usuario;joinForeignKey:IdDenuncia;joinReferences:UsuarioDenunciado" json:"usuariosDenunciados"`
    ProyectosDenunciados []Proyecto `gorm:"many2many:Denuncia_Proyecto;joinForeignKey:IdDenuncia;joinReferences:IdProyecto" json:"proyectosDenunciados"`

}


func (Denuncia) TableName() string {
    return "Denuncia"
}