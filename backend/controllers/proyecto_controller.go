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
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
    }

    user := ctx.Get("user").(*models.Usuario)
    if user == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Usuario no autenticado"})
    }

    if err := c.Service.CreateProyecto(proyecto, user.Id); err != nil {
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
    user := ctx.Get("user").(*models.Usuario)
    if user == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{
            "error": "Usuario no autenticado",
        })
    }

    proyectos, err := c.Service.ListUserProjects(user.Id)
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{
            "error": "Error al obtener proyectos",
        })
    }

    return ctx.JSON(http.StatusOK, proyectos)
}

func (c *ProyectoController) RemoveParticipant(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de proyecto inválido"})
    }

    participantID, err := strconv.ParseUint(ctx.Param("participantId"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de participante inválido"})
    }

    // Get admin user from context
    admin := ctx.Get("user").(*models.Usuario)
    if admin == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Usuario no autenticado"})
    }

    err = c.Service.RemoveParticipant(uint(proyectoID), admin.Id, uint(participantID))
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }

    return ctx.JSON(http.StatusOK, map[string]string{"message": "Participante removido exitosamente"})
}

func (c *ProyectoController) GetParticipants(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de proyecto inválido"})
    }

    participants, err := c.Service.GetProjectParticipants(uint(proyectoID))
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }

    return ctx.JSON(http.StatusOK, participants)
}

func (c *ProyectoController) SearchProyectosByLocation(ctx echo.Context) error {
    var lat, lon, radius float64
    var userId uint = 0 // Default for non-authenticated users
    var err error

    user, ok := ctx.Get("user").(*models.Usuario)
    if ok && user != nil {
        userId = user.Id
        if user.Latitud == 0 && user.Longitud == 0 {
            return ctx.JSON(http.StatusBadRequest, map[string]string{
                "error": "User location not set. Please update your profile with your location.",
            })
        }
        lat = user.Latitud
        lon = user.Longitud
        radius = float64(user.RadioTrabajo)
    } else {
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
        log.Printf("Searching with public location: lat=%f, lon=%f, radius=%f", lat, lon, radius)
    }

    proyectos, err := c.Service.SearchProyectosByLocation(lat, lon, radius, userId)
    if err != nil {
        log.Printf("Error searching projects: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{
            "error": "Failed to search projects",
        })
    }

    response := struct {
        Projects []struct {
            models.Proyecto
            Distance float64 `json:"distance"`
            IsMember bool   `json:"isMember"`
        } `json:"projects"`
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

func (c *ProyectoController) TransferAdmin(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de proyecto inválido"})
    }

    var request struct {
        NewAdminID uint `json:"newAdminId"`
    }
    if err := ctx.Bind(&request); err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Datos inválidos"})
    }

    // Get current user
    currentUser := ctx.Get("user").(*models.Usuario)
    if currentUser == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Usuario no autenticado"})
    }

    // Check if current user is admin
    isAdmin, err := c.Service.IsProjectAdmin(uint(proyectoID), currentUser.Id)
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Error al verificar permisos"})
    }
    if !isAdmin {
        return ctx.JSON(http.StatusForbidden, map[string]string{"error": "No tienes permisos para realizar esta acción"})
    }

    // Transfer admin role
    err = c.Service.TransferAdminRole(uint(proyectoID), currentUser.Id, request.NewAdminID)
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }

    return ctx.JSON(http.StatusOK, map[string]string{"message": "Rol de administrador transferido exitosamente"})
}

func (c *ProyectoController) GetProjectAdmin(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de proyecto inválido"})
    }

    admin, err := c.Service.GetCurrentProjectAdmin(uint(proyectoID))
    if err != nil {
        return ctx.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
    }

    return ctx.JSON(http.StatusOK, admin)
}

func (c *ProyectoController) JoinProject(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de proyecto inválido"})
    }

    user := ctx.Get("user").(*models.Usuario)
    if user == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Usuario no autenticado"})
    }

    err = c.Service.JoinProject(uint(proyectoID), user.Id)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }

    return ctx.JSON(http.StatusOK, map[string]string{"message": "Unido al proyecto exitosamente"})
}

func (c *ProyectoController) LeaveProject(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "ID de proyecto inválido"})
    }

    user := ctx.Get("user").(*models.Usuario)
    if user == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Usuario no autenticado"})
    }

    err = c.Service.LeaveProject(uint(proyectoID), user.Id)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }

    return ctx.JSON(http.StatusOK, map[string]string{"message": "Abandonado el proyecto exitosamente"})
}

func (c *ProyectoController) GetProjectParticipants(ctx echo.Context) error {
    proyectoID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{
            "error": "ID de proyecto inválido",
        })
    }

    participants, err := c.Service.GetProjectParticipants(uint(proyectoID))
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{
            "error": err.Error(),
        })
    }

    return ctx.JSON(http.StatusOK, map[string]interface{}{
        "participants": participants,
    })
}

func (c *ProyectoController) ListJoinedProyectos(ctx echo.Context) error {
    user := ctx.Get("user").(*models.Usuario)
    if user == nil {
        return ctx.JSON(http.StatusUnauthorized, map[string]string{
            "error": "Usuario no autenticado",
        })
    }

    proyectos, err := c.Service.ListJoinedProjects(user.Id)
    if err != nil {
        log.Printf("Error in ListJoinedProyectos: %v", err)
        return ctx.JSON(http.StatusInternalServerError, map[string]string{
            "error": "Error al obtener proyectos",
        })
    }

    var response []struct {
        models.Proyecto
        UserRole string `json:"userRole"`
    }

    for _, proyecto := range proyectos {
        currentProject := struct {
            models.Proyecto
            UserRole string `json:"userRole"`
        }{
            Proyecto: proyecto,
            UserRole: "Participante", 
        }

        role, err := c.Service.GetUserProjectRole(user.Id, proyecto.IdProyecto)
        if err == nil && role != nil {
            currentProject.UserRole = role.Nombre
        }

        response = append(response, currentProject)
    }

    if len(response) == 0 {
        return ctx.JSON(http.StatusOK, []struct{}{})
    }

    return ctx.JSON(http.StatusOK, response)
}
