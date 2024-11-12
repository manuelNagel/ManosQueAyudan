// services/habilidadService.go
package services

import (
	"backend/models"
	"errors"

	"gorm.io/gorm"
)

type HabilidadService struct {
	db *gorm.DB
}

func NewHabilidadService(db *gorm.DB) *HabilidadService {
	return &HabilidadService{db: db}
}

func (s *HabilidadService) AddUserSkill(userId uint, skillReq models.HabilidadRequest) (*models.Habilidad, error) {
	var habilidad models.Habilidad

	// Buscar o crear la habilidad
	result := s.db.Where("Nombre = ?", skillReq.Nombre).FirstOrCreate(&habilidad, models.Habilidad{
		Nombre:      skillReq.Nombre,
		Descripcion: skillReq.Descripcion,
	})
	if result.Error != nil {
		return nil, result.Error
	}

	// Verificar si ya existe la relación
	var existingRelation models.UsuarioHabilidades
	if err := s.db.Where("IdUsuario = ? AND IdHabilidad = ?", userId, habilidad.IdHabilidades).
		First(&existingRelation).Error; err == nil {
		return nil, errors.New("el usuario ya tiene esta habilidad")
	}

	// Crear la relación usuario-habilidad
	userSkill := models.UsuarioHabilidades{
		IdUsuario:   userId,
		IdHabilidad: habilidad.IdHabilidades,
		Nivel:       skillReq.Nivel,
	}

	if err := s.db.Create(&userSkill).Error; err != nil {
		return nil, err
	}

	return &habilidad, nil
}

func (s *HabilidadService) GetUserSkills(userId uint) ([]map[string]interface{}, error) {
	var results []map[string]interface{}

	err := s.db.Table("Habilidad").
		Select("Habilidad.*, UsuarioHabilidades.Nivel").
		Joins("JOIN UsuarioHabilidades ON UsuarioHabilidades.IdHabilidad = Habilidad.IdHabilidades").
		Where("UsuarioHabilidades.IdUsuario = ?", userId).
		Scan(&results).Error

	return results, err
}

func (s *HabilidadService) RemoveUserSkill(userId uint, skillId uint) error {
	result := s.db.Where("IdUsuario = ? AND IdHabilidad = ?", userId, skillId).
		Delete(&models.UsuarioHabilidades{})
	return result.Error
}

func (s *HabilidadService) UpdateSkillLevel(userId uint, skillId uint, level int) error {
	result := s.db.Model(&models.UsuarioHabilidades{}).
		Where("IdUsuario = ? AND IdHabilidad = ?", userId, skillId).
		Update("Nivel", level)

	if result.RowsAffected == 0 {
		return errors.New("habilidad no encontrada para este usuario")
	}

	return result.Error
}

func (s *HabilidadService) FindUsersBySkill(skillId uint) ([]uint, error) {
	var userIds []uint
	err := s.db.Model(&models.UsuarioHabilidades{}).
		Where("IdHabilidad = ?", skillId).
		Pluck("IdUsuario", &userIds).Error
	return userIds, err
}
