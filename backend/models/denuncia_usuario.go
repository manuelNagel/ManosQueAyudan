package models

type DenunciaUsuario struct {
      IdDenuncia uint `gorm:"column:IdDenuncia;primaryKey;type:int unsigned"`
    UsuarioDenunciado uint `gorm:"column:UsuarioDenunciado;primaryKey;type:int unsigned"`
}

func (DenunciaUsuario) TableName() string {
    return "Denuncia_Usuario"
}