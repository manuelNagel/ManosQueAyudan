package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type NotificacionController struct {
	service *services.NotificacionesService
}

func NewNotificacionController(service *services.NotificacionesService) *NotificacionController {
	return &NotificacionController{service: service}
}

// Obtener todas las notificaciones de un usuario
func (c *NotificacionController) GetNotificaciones(ctx echo.Context) error {
	usuarioID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	notificaciones, err := c.service.GetNotificacionesByUsuario(uint(usuarioID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch notifications"})
	}
	return ctx.JSON(http.StatusOK, notificaciones)
}

// Obtener cantidad de notificaciones no leídas
func (c *NotificacionController) GetUnreadCount(ctx echo.Context) error {
	usuarioID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	count, err := c.service.GetUnreadCount(uint(usuarioID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch unread count"})
	}
	return ctx.JSON(http.StatusOK, map[string]int64{"unreadCount": count})
}

// Marcar notificación como leída
func (c *NotificacionController) MarkAsRead(ctx echo.Context) error {
	notificacionID, err := strconv.Atoi(ctx.Param("notificacionID"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid notification ID"})
	}

	err = c.service.MarkAsRead(uint(notificacionID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to mark notification as read"})
	}
	return ctx.NoContent(http.StatusNoContent)
}

// Crear una nueva notificación
func (c *NotificacionController) AddNotificacion(ctx echo.Context) error {
	var notificacion models.Notificacion
	if err := ctx.Bind(&notificacion); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	err := c.service.AddNotificacion(&notificacion)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create notification"})
	}
	return ctx.JSON(http.StatusCreated, notificacion)
}
