package models

type UsuarioHabilidades struct {
    UsuarioId   uint `gorm:"column:IdUsuario;primaryKey;type:int unsigned"`
    HabilidadId uint `gorm:"column:IdHabilidad;primaryKey;type:int unsigned"`
}

func (UsuarioHabilidades) TableName() string {
    return "UsuarioHabilidades"
}