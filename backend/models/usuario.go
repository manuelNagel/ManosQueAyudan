package models

import (
    "gorm.io/gorm"
    "time"
)

type Usuario struct {
    Id           uint           `gorm:"column:Id;primaryKey;autoIncrement;type:int unsigned" json:"id"`
    Nombre       string         `gorm:"column:Nombre" json:"nombre"`
    Apellido     string         `gorm:"column:Apellido" json:"apellido"`
    Email        string         `gorm:"column:Email" json:"email"`
    Password     string         `gorm:"column:Password" json:"-"`
    Activo       bool           `gorm:"column:Activo" json:"activo"`
    Ciudad       string         `gorm:"column:Ciudad" json:"ciudad"`
    RadioTrabajo int            `gorm:"column:RadioTrabajo" json:"radioTrabajo"`
    CreatedAt    time.Time      `gorm:"column:CreatedAt" json:"createdAt"`
    UpdatedAt    time.Time      `gorm:"column:UpdatedAt" json:"updatedAt"`
    DeletedAt    gorm.DeletedAt `gorm:"column:DeletedAt;index" json:"-"`
    Habilidades  []Habilidad    `gorm:"many2many:UsuarioHabilidades;" json:"habilidades"`
    DenunciasRecibidas []Denuncia `gorm:"many2many:Denuncia_Usuario;joinForeignKey:UsuarioDenunciado;joinReferences:IdDenuncia" json:"denunciasRecibidas"`
	Proyectos    []Proyecto    `gorm:"many2many:Proyectos_Usuarios;foreignKey:Id;joinForeignKey:IdUsuario;References:IdProyecto;joinReferences:IdProyecto" json:"proyectos"`
    Roles        []RolProyecto `gorm:"many2many:Proyectos_Usuarios;foreignKey:Id;joinForeignKey:IdUsuario;References:IdRol;joinReferences:IdRol" json:"roles"`
    ProyectosUsuarios []ProyectosUsuarios `gorm:"foreignKey:IdUsuario" json:"-"`
	Notificaciones []Notificacion `gorm:"foreignKey:UsuarioNotificado" json:"notificaciones"`
}

func (Usuario) TableName() string {
    return "Usuario"
}