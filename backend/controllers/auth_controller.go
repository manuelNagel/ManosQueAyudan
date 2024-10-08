package controllers

import (
	"fmt"
	"log"
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

type AuthController struct {
	UserService *services.UsuarioService
	Store       *sessions.CookieStore
}

func NewAuthController(userService *services.UsuarioService, store *sessions.CookieStore) *AuthController {
	return &AuthController{
		UserService: userService,
		Store:       store,
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