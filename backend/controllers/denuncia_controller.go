package controllers

import (
    "net/http"
    "backend/models"
    "backend/services"
    "github.com/labstack/echo/v4"
)

type DenunciaController struct {
    Service *services.DenunciaService
}

func NewDenunciaController(service *services.DenunciaService) *DenunciaController {
    return &DenunciaController{Service: service}
}

func (c *DenunciaController) CreateDenuncia(ctx echo.Context) error {
    var request struct {
        Descripcion string `json:"descripcion"`
        Tipo       string `json:"tipo"`
        TargetId   uint   `json:"targetId"`
    }

    if err := ctx.Bind(&request); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
    }

    user := ctx.Get("user").(*models.Usuario)

    denuncia := &models.Denuncia{
        Descripcion: request.Descripcion,
        IdUsuario:   user.Id,
        Estado:      "Pendiente",
        Habilitado:  true,
    }

    err := c.Service.CreateDenuncia(denuncia, request.Tipo, request.TargetId)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }

    return ctx.JSON(http.StatusCreated, denuncia)
}