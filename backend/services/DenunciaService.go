package services

import (
    "backend/models"
    "errors"
    "time"
    "gorm.io/gorm"
)

type DenunciaService struct {
    DB *gorm.DB
}

func NewDenunciaService(db *gorm.DB) *DenunciaService {
    return &DenunciaService{DB: db}
}

func (s *DenunciaService) CreateDenuncia(denuncia *models.Denuncia, tipo string, targetId uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        denuncia.Fecha = time.Now()

        if err := tx.Create(denuncia).Error; err != nil {
            return err
        }

        switch tipo {
        case "Usuario":
            if err := tx.Create(&models.DenunciaUsuario{
                IdDenuncia: denuncia.IdDenuncia,
                UsuarioDenunciado: targetId,
            }).Error; err != nil {
                return err
            }
        case "Proyecto":
            if err := tx.Create(&models.DenunciaProyecto{
                IdDenuncia: denuncia.IdDenuncia,
                ProyectoDenunciado: targetId,
            }).Error; err != nil {
                return err
            }
        default:
            return errors.New("tipo de denuncia inválido")
        }

        return nil
    })
}