package controllers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"ManosQueAyudan/backend/models"
	"ManosQueAyudan/backend/services"
)

type UsuarioController struct {
	Service *services.UsuarioService
}

func NewUsuarioController(service *services.UsuarioService) *UsuarioController {
	return &UsuarioController{Service: service}
}

func (c *UsuarioController) GetUsuario(ctx echo.Context) error {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	usuario, err := c.Service.GetUsuario(id)
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}

	return ctx.JSON(http.StatusOK, usuario)
}

func (c *UsuarioController) CreateUsuario(ctx echo.Context) error {
	usuario := new(models.Usuario)
	if err := ctx.Bind(usuario); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	err := c.Service.CreateUsuario(usuario)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return ctx.JSON(http.StatusCreated, usuario)
}