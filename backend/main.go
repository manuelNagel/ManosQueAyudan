package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"backend/config"
	"backend/controllers"
	"backend/services"

	"github.com/gorilla/sessions"
)

var (
	store = sessions.NewCookieStore([]byte("your-secret-key"))
)

func main() {
	// Initialize database
	db, err := config.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize services
	userService := services.NewUsuarioService(db)
    proyectoService := services.NewProyectoService(db)
    countryService := services.NewCountryService()


	// Initialize Echo
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,"Accept",},
		AllowCredentials: true,
	}))

	// Inicializa controllers
	authController := controllers.NewAuthController(userService, store)
	userController := controllers.NewUsuarioController(userService)
    proyectoController := controllers.NewProyectoController(proyectoService)
    countryController := controllers.NewCountryController(countryService)


	// Rutas publicas
	e.POST("/api/login", authController.Login)
	e.POST("/api/logout", authController.Logout)
	e.POST("/api/register", authController.Register)
	e.GET("/api/current-user", authController.GetCurrentUser)
    e.GET("/api/countries", countryController.GetCountries)

	// Rutas protegidas
	r := e.Group("/api")
	r.Use(requireAuth(store, userService))
	r.GET("/users/:id", userController.GetUsuario)
    r.PUT("/update-profile", userController.UpdateProfile)

    r.POST("/projects", proyectoController.CreateProyecto)
	r.GET("/projects/:id", proyectoController.GetProyecto)
	r.PUT("/projects/:id", proyectoController.UpdateProyecto)
	r.DELETE("/projects/:id", proyectoController.DeleteProyecto)
	r.GET("/projects", proyectoController.ListProyectos)
    r.PUT("/projects/:id/actividades", proyectoController.UpdateActividad)
    r.DELETE("/projects/:id/actividades/:actividadId", proyectoController.DeleteActividad)
	// Comenzar server
	e.Logger.Fatal(e.Start(":8080"))
}

func requireAuth(store *sessions.CookieStore, userService *services.UsuarioService) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			session, err := store.Get(c.Request(), "session-name")
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Could not retrieve session")
			}

			userID, ok := session.Values["user_id"]
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "Not authenticated")
			}

			user, err := userService.GetUsuario(userID.(uint))
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "Invalid user session")
			}

			c.Set("user", user)
			return next(c)
		}
	}
}