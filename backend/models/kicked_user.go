package models

import "time"

type KickedUser struct {
    IdProyecto uint      `gorm:"column:IdProyecto;primaryKey" json:"idProyecto"`
    IdUsuario  uint      `gorm:"column:IdUsuario;primaryKey" json:"idUsuario"`
    KickedBy   uint      `gorm:"column:KickedBy" json:"kickedBy"`
    KickDate   time.Time `gorm:"column:KickDate;default:CURRENT_TIMESTAMP" json:"kickDate"`
    Reason     string    `gorm:"column:Reason;type:text" json:"reason"`

    // Relations
    Proyecto    Proyecto `gorm:"foreignKey:IdProyecto" json:"proyecto"`
    Usuario     Usuario  `gorm:"foreignKey:IdUsuario" json:"usuario"`
    KickedByUser Usuario  `gorm:"foreignKey:KickedBy" json:"kickedByUser"`
}

func (KickedUser) TableName() string {
    return "KickedUsers"
}