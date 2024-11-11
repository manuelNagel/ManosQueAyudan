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

const (
    PUBLIC_SEARCH_RADIUS  = 20.0 // km
)

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

func (c *ProyectoController) SearchProyectosByLocation(ctx echo.Context) error {
    var lat, lon, radius float64
    var err error

    
    user, ok := ctx.Get("user").(*models.Usuario)

    if ok && user != nil {
       
        if user.Latitud == 0 && user.Longitud == 0 {
            return ctx.JSON(http.StatusBadRequest, map[string]string{
                "error": "User location not set. Please update your profile with your location.",
            })
        }

        lat = user.Latitud
        lon = user.Longitud
        radius = float64(user.RadioTrabajo) 
    } else {
        // validación para usuario no logueado 
        lat, err = strconv.ParseFloat(ctx.QueryParam("lat"), 64)
        if err != nil {
            return ctx.JSON(http.StatusBadRequest, map[string]string{
                "error": "Invalid or missing latitude parameter",
            })
        }

        lon, err = strconv.ParseFloat(ctx.QueryParam("lon"), 64)
        if err != nil {
            return ctx.JSON(http.StatusBadRequest, map[string]string{
                "error": "Invalid or missing longitude parameter",
            })
        }

        // Valida rangos de coordenadas
        if lat < -90 || lat > 90 {
            return ctx.JSON(http.StatusBadRequest, map[string]string{
                "error": "Latitude must be between -90 and 90 degrees",
            })
        }
        if lon < -180 || lon > 180 {
            return ctx.JSON(http.StatusBadRequest, map[string]string{
                "error": "Longitude must be between -180 and 180 degrees",
            })
        }

        radius = PUBLIC_SEARCH_RADIUS 
    }

    // Busqueda de proyectos
    proyectos, err := c.Service.SearchProyectosByLocation(lat, lon, radius)
    if err != nil {
        log.Printf("Error searching projects: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{
            "error": "Failed to search projects",
        })
    }

    //respuesta con contexto del search
    response := struct {
        Projects        []models.Proyecto `json:"projects"`
        SearchLocation struct {
            Latitude  float64 `json:"latitude"`
            Longitude float64 `json:"longitude"`
            Radius    float64 `json:"radius"`
            IsAuth    bool    `json:"isAuthenticated"`
        } `json:"searchLocation"`
    }{
        Projects: proyectos,
        SearchLocation: struct {
            Latitude  float64 `json:"latitude"`
            Longitude float64 `json:"longitude"`
            Radius    float64 `json:"radius"`
            IsAuth    bool    `json:"isAuthenticated"`
        }{
            Latitude:  lat,
            Longitude: lon,
            Radius:    radius,
            IsAuth:    ok && user != nil,
        },
    }

    return ctx.JSON(http.StatusOK, response)
}