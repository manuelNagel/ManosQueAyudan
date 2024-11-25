package models

type DenunciaUsuario struct {
    IdDenuncia        uint `gorm:"column:IdDenuncia;primaryKey" json:"idDenuncia"`
    UsuarioDenunciado uint `gorm:"column:UsuarioDenunciado;primaryKey" json:"usuarioDenunciado"`

    // Relaciones
    Denuncia Denuncia `gorm:"foreignKey:IdDenuncia" json:"-"`
    Usuario  Usuario  `gorm:"foreignKey:UsuarioDenunciado" json:"usuario"`
}


func (DenunciaUsuario) TableName() string {
    return "Denuncia_Usuario"
}