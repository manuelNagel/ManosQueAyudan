package services

import (
	"backend/models"
	"time"

	"gorm.io/gorm"
)

type NotificacionesService struct {
	db *gorm.DB
}

func NewNotificacionesService(db *gorm.DB) *NotificacionesService {
	return &NotificacionesService{db: db}
}

// Obtener notificaciones por usuario
func (s *NotificacionesService) GetNotificacionesByUsuario(usuarioID uint) ([]models.Notificacion, error) {
	var notificaciones []models.Notificacion
	err := s.db.Where("UsuarioNotificado = ?", usuarioID).Find(&notificaciones).Error
	return notificaciones, err
}

// Obtener cantidad de notificaciones no leídas
func (s *NotificacionesService) GetUnreadCount(usuarioID uint) (int64, error) {
	var count int64
	err := s.db.Model(&models.Notificacion{}).
		Where("UsuarioNotificado = ? AND FechaLeido IS NULL", usuarioID).
		Count(&count).Error
	return count, err
}

// Marcar notificación como leída
func (s *NotificacionesService) MarkAsRead(notificacionID uint) error {
	now := time.Now()

	// Actualizar solo el campo `FechaLeida`
	err := s.db.Model(&models.Notificacion{}).
		Where("idNotificacion = ?", notificacionID).
		Updates(map[string]interface{}{
			"FechaLeido": now,
		}).Error

	if err != nil {
		return err
	}
	return nil
}

// Crear una nueva notificación
func (s *NotificacionesService) AddNotificacion(notificacion *models.Notificacion) error {
	notificacion.Fecha = time.Now()
	return s.db.Create(notificacion).Error
}
