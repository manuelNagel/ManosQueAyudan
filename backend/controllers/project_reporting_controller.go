package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"
	"github.com/labstack/echo/v4"
)

type ReportingController struct {
    Service *services.ProjectReportingService
}

func NewReportingController(service *services.ProjectReportingService) *ReportingController {
    return &ReportingController{Service: service}
}

func (c *ReportingController) GetUserProjectStats(ctx echo.Context) error {
    user := ctx.Get("user").(*models.Usuario)
    
    stats, err := c.Service.GetUserProjectStats(user.Id)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusOK, stats)
}

func (c *ReportingController) GetProjectDetailedStats(ctx echo.Context) error {
    projectId, err := strconv.ParseUint(ctx.Param("projectId"), 10, 32)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid project ID")
    }

    stats, err := c.Service.GetProjectDetailedStats(uint(projectId))
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusOK, stats)
}