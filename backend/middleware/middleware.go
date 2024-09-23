package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func authMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// In a real app, you'd verify the JWT or session here
		token := c.Request().Header.Get("Authorization")
		if token != "Bearer sample-jwt-token" {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid or missing token")
		}
		return next(c)
	}
}