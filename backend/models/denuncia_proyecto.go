
package models

type DenunciaProyecto struct {
    IdDenuncia         uint `gorm:"column:IdDenuncia;primaryKey" json:"idDenuncia"`
    ProyectoDenunciado uint `gorm:"column:ProyectoDenunciado;primaryKey" json:"proyectoDenunciado"`

    // Relaciones
    Denuncia Denuncia `gorm:"foreignKey:IdDenuncia" json:"-"`
    Proyecto Proyecto `gorm:"foreignKey:ProyectoDenunciado" json:"proyecto"`
}

func (DenunciaProyecto) TableName() string {
    return "Denuncia_Proyecto"
}