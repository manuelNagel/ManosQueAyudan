package controllers

import (
	"backend/models"
	"backend/services"
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type ProyectoController struct {
	Service *services.ProyectoService
}

func NewProyectoController(service *services.ProyectoService) *ProyectoController {
	return &ProyectoController{Service: service}
}

func (c *ProyectoController) CreateProyecto(ctx echo.Context) error {
    proyecto := new(models.Proyecto)
    if err := ctx.Bind(proyecto); err != nil {
        log.Printf("Error binding project data: %v", err)
        log.Printf("Received data: %+v", ctx.Request().Body)
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
    }

    log.Printf("Received project: %+v", proyecto)

    if err := c.Service.CreateProyecto(proyecto); err != nil {
        log.Printf("Error creating project: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create project"})
    }

    return ctx.JSON(http.StatusCreated, proyecto)
}

func (c *ProyectoController) GetProyecto(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	proyecto, err := c.Service.GetProyecto(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "Project not found"})
	}
	return ctx.JSON(http.StatusOK, proyecto)
}

func (c *ProyectoController) UpdateProyecto(ctx echo.Context) error {
    id, _ := strconv.Atoi(ctx.Param("id"))
    proyecto := new(models.Proyecto)
    if err := ctx.Bind(proyecto); err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
    }
    proyecto.IdProyecto = uint(id)

    if err := c.Service.UpdateProyecto(proyecto); err != nil {
        log.Printf("Error updating project: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update project"})
    }

    return ctx.JSON(http.StatusOK, proyecto)
}

func (c *ProyectoController) UpdateActividad(ctx echo.Context) error {
    proyectoID, _ := strconv.Atoi(ctx.Param("id"))
    actividad := new(models.Actividad)
    if err := ctx.Bind(actividad); err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
    }

    if err := c.Service.UpdateActividad(uint(proyectoID), *actividad); err != nil {
        log.Printf("Error updating actividad: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update actividad"})
    }

    return ctx.JSON(http.StatusOK, actividad)
}

func (c *ProyectoController) DeleteActividad(ctx echo.Context) error {
    proyectoID, _ := strconv.Atoi(ctx.Param("id"))
    actividadID, _ := strconv.Atoi(ctx.Param("actividadId"))

    if err := c.Service.DeleteActividad(uint(proyectoID), uint(actividadID)); err != nil {
        log.Printf("Error deleting actividad: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete actividad"})
    }

    return ctx.NoContent(http.StatusOK)
}

func (c *ProyectoController) DeleteProyecto(ctx echo.Context) error {
    id, err := strconv.Atoi(ctx.Param("id"))
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid project ID"})
    }

    if err := c.Service.DeleteProyecto(uint(id)); err != nil {
        log.Printf("Error deleting project: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete project"})
    }

    return ctx.NoContent(http.StatusOK)
}

func (c *ProyectoController) ListProyectos(ctx echo.Context) error {
	proyectos, err := c.Service.ListProyectos()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to list projects"})
	}
	return ctx.JSON(http.StatusOK, proyectos)
}