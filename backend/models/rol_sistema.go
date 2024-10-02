package models

type RolSistema struct {
    IdRol       uint   `gorm:"primaryKey;column:IdRol;type:int unsigned;autoIncrement" json:"idRol"`
    Descripcion string `gorm:"column:Descripcion" json:"descripcion"`
    Titulo      string `gorm:"column:Titulo" json:"titulo"`
}

func (RolSistema) TableName() string {
    return "Rol_Sistema"
}