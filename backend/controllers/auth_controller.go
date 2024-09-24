package controllers
import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/gorilla/sessions"
	"backend/models"
	"backend/services"
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

func (c *AuthController) Login(ctx echo.Context) error {
	var loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.Bind(&loginRequest); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	user, err := c.UserService.AuthenticateUser(loginRequest.Email, loginRequest.Password)
	if err != nil {
		return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
	}

	session, _ := c.Store.Get(ctx.Request(), "session-name")
	session.Values["user_id"] = user.ID
	session.Save(ctx.Request(), ctx.Response().Writer)

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

	// Automatically log in the user after registration
	session, _ := c.Store.Get(ctx.Request(), "session-name")
	session.Values["user_id"] = user.ID
	session.Save(ctx.Request(), ctx.Response().Writer)

	return ctx.JSON(http.StatusCreated, user)
}