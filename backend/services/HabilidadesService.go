package services

import (
	"backend/models"

	"gorm.io/gorm"
)

type HabilidadService struct {
	DB *gorm.DB
}

func NewHabilidadService(db *gorm.DB) *HabilidadService {
	return &HabilidadService{DB: db}
}

// Vincular habilidades a un usuario
func (s *HabilidadService) VincularHabilidades(usuarioID uint, habilidades []uint) error {
	// Eliminar habilidades previas del usuario
	if err := s.DB.Where("usuario_id = ?", usuarioID).Delete(&models.UsuarioHabilidades{}).Error; err != nil {
		return err
	}

	// Crear nuevas relaciones usuario-habilidad
	for _, habilidadID := range habilidades {
		usuarioHabilidad := models.UsuarioHabilidades{
			UsuarioID:   usuarioID,
			HabilidadID: habilidadID,
		}
		if err := s.DB.Create(&usuarioHabilidad).Error; err != nil {
			return err
		}
	}

	return nil
}

// Obtener habilidades de un usuario
func (s *HabilidadService) ObtenerHabilidadesPorUsuario(usuarioID uint) ([]models.Habilidad, error) {
	var habilidades []models.Habilidad

	if err := s.DB.Joins("JOIN Usuario_Habilidades ON Usuario_Habilidades.habilidad_id = Habilidad.idhabilidades").
		Where("Usuario_Habilidades.usuario_id = ?", usuarioID).
		Find(&habilidades).Error; err != nil {
		return nil, err
	}

	return habilidades, nil
}

// Obtener todas las habilidades
func (s *HabilidadService) ObtenerTodasHabilidades() ([]models.Habilidad, error) {
	var habilidades []models.Habilidad
	if err := s.DB.Find(&habilidades).Error; err != nil {
		return nil, err
	}
	return habilidades, nil
}
