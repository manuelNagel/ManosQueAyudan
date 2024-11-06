package controllers

import (
	"net/http"
	"strconv"

	"backend/models"
	"backend/services"

	"github.com/labstack/echo/v4"
)

type UsuarioController struct {
	Service *services.UsuarioService
}

func NewUsuarioController(service *services.UsuarioService) *UsuarioController {
	return &UsuarioController{Service: service}
}

func (c *UsuarioController) GetUsuario(ctx echo.Context) error {
	idStr := ctx.Param("id")

	id64, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	id := uint(id64)

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

func (c *UsuarioController) GetCurrentUser(ctx echo.Context) error {
	user, ok := ctx.Get("user").(*models.Usuario)
	if !ok {
		return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Not authenticated"})
	}
	return ctx.JSON(http.StatusOK, user)
}

func (c *UsuarioController) UpdateProfile(ctx echo.Context) error {
	user := ctx.Get("user").(*models.Usuario)

	var updatedUser models.Usuario
	if err := ctx.Bind(&updatedUser); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	user.Nombre = updatedUser.Nombre
	user.Apellido = updatedUser.Apellido
	user.Localizacion = updatedUser.Localizacion
	user.RadioTrabajo = updatedUser.RadioTrabajo
	user.Longitud = updatedUser.Longitud
	user.Latitud = updatedUser.Latitud
	user.Pais = updatedUser.Pais

	if user.Email != updatedUser.Email {
		// IMPLEMENTAR LOGICA DE MAIL
		user.Email = updatedUser.Email
	}

	err := c.Service.UpdateUsuario(user)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update user"})
	}

	return ctx.JSON(http.StatusOK, user)
}
