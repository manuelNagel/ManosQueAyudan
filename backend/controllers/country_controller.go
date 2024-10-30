// controllers/country_controller.go
package controllers

import (
    "net/http"
    "backend/services"
    "github.com/labstack/echo/v4"
)

type CountryController struct {
    Service *services.CountryService
}

func NewCountryController(service *services.CountryService) *CountryController {
    return &CountryController{Service: service}
}

func (c *CountryController) GetCountries(ctx echo.Context) error {
    xmlData, err := c.Service.GetCountries()
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{
            "error": "Failed to fetch countries: " + err.Error(),
        })
    }

    return ctx.Blob(http.StatusOK, "text/xml; charset=utf-8", xmlData)
}