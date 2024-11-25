package controllers

import (
	"backend/services"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type HabilidadController struct {
	Service *services.HabilidadService
}

func NewHabilidadController(service *services.HabilidadService) *HabilidadController {
	return &HabilidadController{Service: service}
}

// Vincular habilidades a un usuario
func (c *HabilidadController) VincularHabilidades(ctx echo.Context) error {
	usuarioID, err := strconv.Atoi(ctx.Param("usuarioId"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var habilidades []uint
	if err := ctx.Bind(&habilidades); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input"})
	}

	if err := c.Service.VincularHabilidades(uint(usuarioID), habilidades); err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Habilidades vinculadas correctamente"})
}

// Obtener habilidades de un usuario
func (c *HabilidadController) ObtenerHabilidadesPorUsuario(ctx echo.Context) error {
	usuarioID, err := strconv.Atoi(ctx.Param("usuarioId"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	habilidades, err := c.Service.ObtenerHabilidadesPorUsuario(uint(usuarioID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, habilidades)
}

// Obtener todas las habilidades
func (c *HabilidadController) ObtenerTodasHabilidades(ctx echo.Context) error {
	habilidades, err := c.Service.ObtenerTodasHabilidades()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, habilidades)
}
