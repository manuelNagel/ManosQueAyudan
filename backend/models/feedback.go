package models

import (
	"time"
)

type Feedback struct {
    IdFeedback      uint      `gorm:"primaryKey;column:IdFeedback" json:"idFeedback"`
    IdProyecto      uint      `gorm:"column:IdProyecto" json:"idProyecto"`
    IdAutor         uint      `gorm:"column:IdAutor" json:"idAutor"`
    IdDestinatario  uint      `gorm:"column:IdDestinatario" json:"idDestinatario"`
    Fecha           time.Time `gorm:"column:Fecha;default:CURRENT_TIMESTAMP" json:"fecha"`
    Puntuacion      int       `gorm:"column:Puntuacion" json:"puntuacion"`
    Descripcion     *string   `gorm:"column:Descripcion" json:"descripcion"` 
    RolAutor        uint      `gorm:"column:RolAutor" json:"rolAutor"`
    RolDestinatario uint      `gorm:"column:RolDestinatario" json:"rolDestinatario"`
    Habilitado      bool      `gorm:"column:Habilitado;default:true" json:"habilitado"`
    
    // Relaciones
    Proyecto     Proyecto    `gorm:"foreignKey:IdProyecto" json:"proyecto"`
    Autor        Usuario     `gorm:"foreignKey:IdAutor" json:"autor"`
    Destinatario Usuario     `gorm:"foreignKey:IdDestinatario" json:"destinatario"`
}

func (Feedback) TableName() string {
    return "Feedback"
}