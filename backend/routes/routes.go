package main

import (
	"github.com/labstack/echo/v4"
)

func setupRoutes(e *echo.Echo) {
	// Auth routes
	e.POST("/api/auth/register", authController.register)
	e.POST("/api/auth/login", authController.login)
	e.POST("/api/auth/logout", authController.logout)

	// User routes
	e.GET("/api/user", userController.getUser, authMiddleware)

	// Admin routes
	admin := e.Group("/api/admin", adminMiddleware)
	admin.GET("/dashboard", adminController.getDashboard)
}