package models

type UsuarioHabilidades struct {
	UsuarioId   uint `gorm:"column:IdUsuario;primaryKey;type:int unsigned" json:"idUsuario"`
	HabilidadId uint `gorm:"column:IdHabilidad;primaryKey;type:int unsigned" json:"idHabilidad"`
}

func (UsuarioHabilidades) TableName() string {
	return "UsuarioHabilidades"
}

// Estructura para las peticiones
type HabilidadRequest struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
	//   Nivel       int    `json:"nivel"`
}
