package controllers

import (
    "net/http"
    "strconv"
    "backend/services"
    "github.com/labstack/echo/v4"
)

type RolProyectoController struct {
    Service *services.RolProyectoService
}

func NewRolProyectoController(service *services.RolProyectoService) *RolProyectoController {
    return &RolProyectoController{Service: service}
}

func (c *RolProyectoController) GetRolProyecto(ctx echo.Context) error {
    id, _ := strconv.Atoi(ctx.Param("id"))
    rol, err := c.Service.GetRolProyecto(uint(id))
    if err != nil {
        return ctx.JSON(http.StatusNotFound, map[string]string{"error": "Role not found"})
    }
    return ctx.JSON(http.StatusOK, rol)
}
