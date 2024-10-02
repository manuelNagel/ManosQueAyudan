package models

import("time")

type Notificacion struct {
    IdNotificacion    uint      `gorm:"primaryKey;column:idNotificacion" json:"idNotificacion"`
    Fecha             time.Time `gorm:"column:Fecha" json:"fecha"`
    UsuarioNotificado uint      `gorm:"column:UsuarioNotificado" json:"usuarioNotificado"`
    Descripcion       string    `gorm:"column:Descripcion" json:"descripcion"`
    Usuario           Usuario   `gorm:"foreignKey:UsuarioNotificado" json:"usuario"`
}

func (Notificacion) TableName() string {
    return "Notificacion"
}