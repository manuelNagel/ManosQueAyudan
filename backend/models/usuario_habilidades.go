package models

// Asociación Usuario-Habilidad
type UsuarioHabilidades struct {
	UsuarioID   uint `json:"usuarioId"`
	HabilidadID uint `json:"habilidadId"`
}

func (UsuarioHabilidades) TableName() string {
	return "Usuario_Habilidades"
}
