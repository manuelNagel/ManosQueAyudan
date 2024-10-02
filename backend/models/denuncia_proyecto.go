
package models

type DenunciaProyecto struct {
    IdDenuncia uint `gorm:"column:IdDenuncia;primaryKey;type:int unsigned"`
    IdProyecto uint `gorm:"column:IdProyecto;primaryKey;type:int unsigned"`
}

func (DenunciaProyecto) TableName() string {
    return "Denuncia_Proyecto"
}