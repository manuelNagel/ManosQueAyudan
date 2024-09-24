package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	customMiddleware "ManosQueAyudan/backend/middleware"
	"ManosQueAyudan/backend/routes"
	"ManosQueAyudan/backend/services"
)

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	// SPA middleware
	e.Use(customMiddleware.ServeSPAMiddleware("build", "index.html"))

	// Servicios
	userService := services.NewUsuarioService()

	// Setup rutas
	routes.SetupRoutes(e, userService)

	// archivos estaticos
	e.Static("/static", "build/static")

	e.Logger.Fatal(e.Start(":8080"))
}