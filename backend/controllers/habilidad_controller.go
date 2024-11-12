// controllers/habilidadController.go
package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type HabilidadController struct {
	habilidadService *services.HabilidadService
}

func NewHabilidadController(habilidadService *services.HabilidadService) *HabilidadController {
	return &HabilidadController{habilidadService: habilidadService}
}

func (c *HabilidadController) AddSkill(ctx echo.Context) error {
	var skillReq models.HabilidadRequest
	if err := ctx.Bind(&skillReq); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	userId, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de usuario inválido"})
	}

	habilidad, err := c.habilidadService.AddUserSkill(uint(userId), skillReq)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, habilidad)
}

func (c *HabilidadController) GetSkills(ctx echo.Context) error {
	userId, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de usuario inválido"})
	}

	skills, err := c.habilidadService.GetUserSkills(uint(userId))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, skills)
}

func (c *HabilidadController) RemoveSkill(ctx echo.Context) error {
	userId, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de usuario inválido"})
	}

	skillId, err := strconv.ParseUint(ctx.Param("skillId"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de habilidad inválido"})
	}

	err = c.habilidadService.RemoveUserSkill(uint(userId), uint(skillId))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Habilidad eliminada exitosamente"})
}

func (c *HabilidadController) UpdateSkillLevel(ctx echo.Context) error {
	var req struct {
		Nivel int `json:"nivel"`
	}
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	userId, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de usuario inválido"})
	}

	skillId, err := strconv.ParseUint(ctx.Param("skillId"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de habilidad inválido"})
	}

	err = c.habilidadService.UpdateSkillLevel(uint(userId), uint(skillId), req.Nivel)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Nivel actualizado exitosamente"})
}

// Configuración de rutas
func (c *HabilidadController) SetupRoutes(e *echo.Echo) {
	e.POST("/api/users/:userId/skills", c.AddSkill)
	e.GET("/api/users/:userId/skills", c.GetSkills)
	e.DELETE("/api/users/:userId/skills/:skillId", c.RemoveSkill)
	e.PUT("/api/users/:userId/skills/:skillId/level", c.UpdateSkillLevel)
}
