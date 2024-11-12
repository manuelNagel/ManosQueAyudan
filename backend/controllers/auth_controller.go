package controllers

import (
	"fmt"
	"log"
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"

	"math/rand"
	"strconv"
	"time"
)

type AuthController struct {
	UserService  *services.UsuarioService
	Store        *sessions.CookieStore
	EmailService *services.EmailService
}

func NewAuthController(userService *services.UsuarioService, store *sessions.CookieStore, emailService *services.EmailService) *AuthController {
	return &AuthController{
		UserService:  userService,
		Store:        store,
		EmailService: emailService,
	}
}

func (c *AuthController) GetCurrentUser(ctx echo.Context) error {
	session, err := c.Store.Get(ctx.Request(), "session-name")
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Could not retrieve session")
	}

	userID, ok := session.Values["user_id"]
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Not authenticated")
	}

	user, err := c.UserService.GetUsuario(userID.(uint))
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, fmt.Sprintf("Invalid user session: %v", err))
	}

	return ctx.JSON(http.StatusOK, user)
}

func (c *AuthController) Login(ctx echo.Context) error {
	var loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.Bind(&loginRequest); err != nil {
		log.Printf("Login failed: Invalid request payload: %v", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	user, err := c.UserService.AuthenticateUser(loginRequest.Email, loginRequest.Password)

	if err != nil {
		log.Printf("Login failed: %v", err)
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	session, _ := c.Store.Get(ctx.Request(), "session-name")
	session.Values["user_id"] = user.Id
	if err := session.Save(ctx.Request(), ctx.Response().Writer); err != nil {
		log.Printf("Failed to save session: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create session")
	}

	log.Printf("Login successful for user %s", user.Email)
	user.Password = ""
	return ctx.JSON(http.StatusOK, user)
}

func (c *AuthController) Logout(ctx echo.Context) error {
	session, _ := c.Store.Get(ctx.Request(), "session-name")
	session.Values["user_id"] = nil
	session.Options.MaxAge = -1
	session.Save(ctx.Request(), ctx.Response().Writer)

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

func (c *AuthController) Register(ctx echo.Context) error {
	var user models.Usuario
	if err := ctx.Bind(&user); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	err := c.UserService.CreateUsuario(&user)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user"})
	}

	session, _ := c.Store.Get(ctx.Request(), "session-name")
	session.Values["user_id"] = user.Id
	session.Save(ctx.Request(), ctx.Response().Writer)

	user.Password = ""
	return ctx.JSON(http.StatusCreated, user)
}
func (c *AuthController) ResetPassword(ctx echo.Context) error {
	var request struct {
		Email string `json:"email"`
	}

	if err := ctx.Bind(&request); err != nil || request.Email == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Email is required")
	}

	// Verificar si el usuario existe en la base de datos
	user, err := c.UserService.GetUserByEmail(request.Email)
	if err != nil || user == nil {
		return echo.NewHTTPError(http.StatusNotFound, "Usuario no Encontrado")
	}

	//Cambio la clave y actualizo la contrasena
	randGen := rand.New(rand.NewSource(time.Now().UnixNano()))
	nuevaClave := strconv.Itoa(randGen.Intn(900000) + 100000) // Genera un número entre 100000 y 999999
	//nuevaClave := "1234"
	if err := c.UserService.UpdatePassword(request.Email, nuevaClave); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update password")
	}

	// Crear el cuerpo del correo
	subject := "Restablecimiento de Contraseña"
	body := fmt.Sprintf("Hola, tu contraseña ha sido cambiada, la nueva clave es: %s", nuevaClave)

	// Enviar el correo electrónico
	err = c.EmailService.SendEmail(request.Email, subject, body)
	if err != nil {
		log.Printf("Fallo al enviar el email de restablecimiento de contraseña: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Fallo al enviar el email")
	}

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Email de restablecimiento de contrasena enviado"})
}

func (c *AuthController) UpdateHabilidad(ctx echo.Context) error {
	// Obtener el ID del usuario desde los parámetros de la URL
	idStr := ctx.Param("id")

	userID, err := strconv.ParseUint(idStr, 10, 32)
	//userID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
	}

	// Parsear las habilidades enviadas en la solicitud
	var request struct {
		Habilidades []uint `json:"habilidades"`
	}
	if err := ctx.Bind(&request); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	// Llamar al servicio para actualizar las habilidades
	if err := c.UserService.UpdateUserSkills(uint(userID), request.Habilidades); err != nil {
		log.Printf("Failed to update skills: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update skills")
	}

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Skills updated successfully"})
}
