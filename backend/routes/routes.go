package routes

import (
	"github.com/labstack/echo/v4"
	"ManosQueAyudan/backend/controllers"
	"ManosQueAyudan/backend/middleware"
	"ManosQueAyudan/backend/services"
)

func SetupRoutes(e *echo.Echo, userService *services.UsuarioService) {
	// Controllers
	userController := controllers.NewUsuarioController(userService)
	authController := controllers.NewAuthController(userService)

	// Rutas publicas
	e.POST("/api/login", authController.Login)
	e.POST("/api/logout", authController.Logout)
	e.POST("/api/register", userController.CreateUsuario)

	// agrupamienot API 
	api := e.Group("/api")

	// Rutas Protegidas
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware)
	protected.GET("/users/:id", userController.GetUsuario)

}