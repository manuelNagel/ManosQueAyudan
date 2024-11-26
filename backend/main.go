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
	cfg := config.LoadConfig()

	// Inicializa db con configuración
	db, err := config.InitDB(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Inicializa services
	userService := services.NewUsuarioService(db, cfg.EncryptionKey)
	proyectoService := services.NewProyectoService(db)
	countryService := services.NewCountryService()
<<<<<<< HEAD
<<<<<<< HEAD
	feedbackService := services.NewFeedbackService(db)
=======
	feedbackService := services.NewFeedbackService(db)
	habilidadService := services.NewHabilidadService(db)
	notificacionService := services.NewNotificacionesService(db)
>>>>>>> e8daf826b7db28580f3c6c98c249554c2895c4ae
	denunciaService := services.NewDenunciaService(db)
	reportingService := services.NewProjectReportingService(db)


	//emailService := services.NewEmailService("smtp.gmail.com", "587", "praa.nqn@gmail.com", "wzwmvpdmwcvsfuut")
	emailService := services.NewEmailService("smtp.gmail.com", "587", string(cfg.CuentaMail), cfg.PassMail)
	// Inicializa Echo
<<<<<<< HEAD
=======

	//emailService := services.NewEmailService("smtp.gmail.com", "587", "praa.nqn@gmail.com", "wzwmvpdmwcvsfuut")
	emailService := services.NewEmailService("smtp.gmail.com", "587", string(cfg.CuentaMail), cfg.PassMail)

	habilidadService := services.NewHabilidadService(db)

	notificacionService := services.NewNotificacionesService(db)

	// Initialize Echo
>>>>>>> 689d91835f42de093e0069509f0a31ce6678657d
=======
>>>>>>> e8daf826b7db28580f3c6c98c249554c2895c4ae
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, "Accept"},
		AllowCredentials: true,
	}))

	// Inicializa controllers
	authController := controllers.NewAuthController(userService, store, emailService)
	userController := controllers.NewUsuarioController(userService)
	proyectoController := controllers.NewProyectoController(proyectoService)
	countryController := controllers.NewCountryController(countryService)
	feedbackController := controllers.NewFeedbackController(feedbackService)
	denunciaController := controllers.NewDenunciaController(denunciaService)
	reportingController := controllers.NewReportingController(reportingService)
	notificacionController := controllers.NewNotificacionController(notificacionService)
	habilidadController := controllers.NewHabilidadController(habilidadService)




	// Rutas publicas
	e.POST("/api/login", authController.Login)
	e.POST("/api/logout", authController.Logout)
	e.POST("/api/register", authController.Register)
	e.GET("/api/current-user", authController.GetCurrentUser)
	e.GET("/api/countries", countryController.GetCountries)
	e.GET("/api/projects/search", proyectoController.SearchProyectosByLocation, optionalAuth(store, userService))
	e.POST("/api/reset-password", authController.ResetPassword)
	e.GET("/api/proys", proyectoController.ListJoinedProyectos)

	e.GET("/api/habilidades", habilidadController.ObtenerTodasHabilidades)
	e.GET("/api/usuarios/:usuarioId/habilidades", habilidadController.ObtenerHabilidadesPorUsuario)
	e.PUT("/api/usuarios/:usuarioId/habilidades", habilidadController.VincularHabilidades)

	e.GET("/api/usuarios/:id/notificaciones", notificacionController.GetNotificaciones)
	e.GET("/api/notificaciones/:id/unread-count", notificacionController.GetUnreadCount)
	e.PUT("/api/notificaciones/:notificacionID/mark-as-read", notificacionController.MarkAsRead)
	e.POST("/api/notificaciones", notificacionController.AddNotificacion)

	// Rutas protegidas
	r := e.Group("/api")
	r.Use(requireAuth(store, userService))
	r.GET("/users/:id", userController.GetUsuario)
	r.PUT("/update-profile", userController.UpdateProfile)

	r.POST("/projects/:id/transfer-admin", proyectoController.TransferAdmin)
	r.GET("/projects/:id/admin", proyectoController.GetProjectAdmin)
	r.POST("/projects/:id/join", proyectoController.JoinProject)
	r.POST("/projects/:id/leave", proyectoController.LeaveProject)
	r.DELETE("/projects/:id/participants/:participantId", proyectoController.RemoveParticipant)
	r.GET("/projects/:id/participants", proyectoController.GetParticipants)
	r.GET("/projects/joined", proyectoController.ListJoinedProyectos)

	r.POST("/feedback", feedbackController.CreateFeedback)
	r.GET("/feedback/users/:userId/stats", feedbackController.GetUserFeedbackStats)
	r.GET("/feedback/projects/:projectId", feedbackController.GetProjectFeedback)
	r.GET("/feedback/users/:userId/given", feedbackController.GetUserGivenFeedback)

	r.POST("/denuncias", denunciaController.CreateDenuncia)



	r.POST("/projects", proyectoController.CreateProyecto)
	r.GET("/projects/:id", proyectoController.GetProyecto)
	r.PUT("/projects/:id", proyectoController.UpdateProyecto)
	r.DELETE("/projects/:id", proyectoController.DeleteProyecto)
	r.GET("/projects", proyectoController.ListProyectos)
	r.PUT("/projects/:id/actividades", proyectoController.UpdateActividad)
	r.DELETE("/projects/:id/actividades/:actividadId", proyectoController.DeleteActividad)

<<<<<<< HEAD
<<<<<<< HEAD
	r.GET("/reports/users/:userId/stats", reportingController.GetUserProjectStats)
	r.GET("/reports/projects/:projectId/stats", reportingController.GetProjectDetailedStats)
=======
>>>>>>> 689d91835f42de093e0069509f0a31ce6678657d
=======
	r.GET("/reports/users/:userId/stats", reportingController.GetUserProjectStats)
	r.GET("/reports/projects/:projectId/stats", reportingController.GetProjectDetailedStats)
>>>>>>> e8daf826b7db28580f3c6c98c249554c2895c4ae
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

func optionalAuth(store *sessions.CookieStore, userService *services.UsuarioService) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			session, err := store.Get(c.Request(), "session-name")
			if err != nil {
				return next(c)
			}

			userID, ok := session.Values["user_id"]
			if !ok {
				return next(c)
			}

			user, err := userService.GetUsuario(userID.(uint))
			if err != nil {
				return next(c)
			}

			c.Set("user", user)
			return next(c)
		}
	}
}
