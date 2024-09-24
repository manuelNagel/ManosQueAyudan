
package main

import (
	"log"

	"github.com/labstack/echo/v4"
    //"github.com/labstack/echo/v4/middleware"

	"github.com/gorilla/sessions"
	"backend/config"
	"backend/controllers"
	"backend/middleware"
	"backend/services"
)

var (
	store = sessions.NewCookieStore([]byte("your-secret-key"))
)

func main() {
	// inicializa database
	db, err := config.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

    

	// Inicializa services
	userService := services.NewUsuarioService(db)

	// inicializa Echo
	e := echo.New()

    //cors
    /*
    e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"}, // Your React app's URL
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))
*/
    
	authController := controllers.NewAuthController(userService, store)
	userController := controllers.NewUsuarioController(userService)

	// Routes
	e.POST("/api/login", authController.Login)
	e.POST("/api/logout", authController.Logout)
	e.POST("/api/register", authController.Register)

	// API group with updated middleware
	api := e.Group("/api")
	api.Use(middleware.AuthMiddleware(store, userService))
	api.GET("/users/:id", userController.GetUsuario)
	api.GET("/current-user", userController.GetCurrentUser)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}