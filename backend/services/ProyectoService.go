package services

import (
	"backend/models"
	"gorm.io/gorm"
)

type ProyectoService struct {
	DB *gorm.DB
}

func NewProyectoService(db *gorm.DB) *ProyectoService {
	return &ProyectoService{DB: db}
}

func (s *ProyectoService) CreateProyecto(proyecto *models.Proyecto) error {
	return s.DB.Create(proyecto).Error
}

func (s *ProyectoService) GetProyecto(id uint) (*models.Proyecto, error) {
	var proyecto models.Proyecto
	if err := s.DB.Preload("Actividades").First(&proyecto, id).Error; err != nil {
		return nil, err
	}
	return &proyecto, nil
}

func (s *ProyectoService) UpdateProyecto(proyecto *models.Proyecto) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(proyecto).Error; err != nil {
			return err
		}

		if err := tx.Model(proyecto).Association("Actividades").Replace(proyecto.Actividades); err != nil {
			return err
		}

		return nil
	})
}

func (s *ProyectoService) DeleteProyecto(id uint) error {
	return s.DB.Delete(&models.Proyecto{}, id).Error
}

func (s *ProyectoService) ListProyectos() ([]models.Proyecto, error) {
	var proyectos []models.Proyecto
	if err := s.DB.Preload("Actividades").Find(&proyectos).Error; err != nil {
		return nil, err
	}
	return proyectos, nil
}