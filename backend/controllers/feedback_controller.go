package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type FeedbackController struct {
    Service *services.FeedbackService
}

type CreateFeedbackRequest struct {
    IdProyecto     uint    `json:"idProyecto"`
    IdDestinatario uint    `json:"idDestinatario"`
    Puntuacion     int     `json:"puntuacion"`
    Descripcion    *string `json:"descripcion"` 
}

func NewFeedbackController(service *services.FeedbackService) *FeedbackController {
    return &FeedbackController{Service: service}
}

func (c *FeedbackController) GetUserGivenFeedback(ctx echo.Context) error {
    userId, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
    }

    feedbacks, err := c.Service.GetUserGivenFeedback(uint(userId))
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusOK, feedbacks)
}

func (c *FeedbackController) CreateFeedback(ctx echo.Context) error {
    var request CreateFeedbackRequest
    if err := ctx.Bind(&request); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    // Validación rango de score (1-5)
    if request.Puntuacion < 1 || request.Puntuacion > 5 {
        return echo.NewHTTPError(http.StatusBadRequest, "Score must be between 1 and 5")
    }

    // Get usuario autenticado
    user := ctx.Get("user").(*models.Usuario)
    
    feedback := &models.Feedback{
        IdProyecto:     request.IdProyecto,
        IdAutor:        user.Id,
        IdDestinatario: request.IdDestinatario,
        Puntuacion:     request.Puntuacion,
        Descripcion:    request.Descripcion,
    }
    
    if err := c.Service.CreateFeedback(feedback); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusCreated, feedback)
}

func (c *FeedbackController) GetUserFeedbackStats(ctx echo.Context) error {
    userID, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
    }

    stats, err := c.Service.GetUserFeedbackStats(uint(userID))
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusOK, stats)
}

func (c *FeedbackController) GetProjectFeedback(ctx echo.Context) error {
    projectID, err := strconv.ParseUint(ctx.Param("projectId"), 10, 32)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid project ID")
    }

    feedbacks, err := c.Service.GetProjectFeedback(uint(projectID))
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusOK, feedbacks)
}