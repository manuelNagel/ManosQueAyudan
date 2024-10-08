package services

import (
    "backend/models"
    "gorm.io/gorm"
)

type RolProyectoService struct {
    DB *gorm.DB
}

func NewRolProyectoService(db *gorm.DB) *RolProyectoService {
    return &RolProyectoService{DB: db}
}

func (s *RolProyectoService) GetRolProyecto(id uint) (*models.RolProyecto, error) {
    var rol models.RolProyecto
    result := s.DB.First(&rol, id)
    return &rol, result.Error
}