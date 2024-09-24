package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"ManosQueAyudan/backend/services"
	"ManosQueAyudan/backend/utils"
)

type AuthController struct {
	Service *services.UsuarioService
}

func NewAuthController(service *services.UsuarioService) *AuthController {
	return &AuthController{Service: service}
}

func (c *AuthController) Login(ctx echo.Context) error {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.Bind(&loginData); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	usuario, err := c.Service.AuthenticateUser(loginData.Email, loginData.Password)
	if err != nil {
		return ctx.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
	}

	session, _ := utils.GetSessionStore().Get(ctx.Request(), "session-name")
	session.Values["authenticated"] = true
	session.Values["user_id"] = usuario.IdUsuario
	session.Save(ctx.Request(), ctx.Response())

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Logged in successfully"})
}

func (c *AuthController) Logout(ctx echo.Context) error {
	session, _ := utils.GetSessionStore().Get(ctx.Request(), "session-name")
	session.Values["authenticated"] = false
	session.Values["user_id"] = nil
	session.Options.MaxAge = -1
	session.Save(ctx.Request(), ctx.Response())

	return ctx.JSON(http.StatusOK, map[string]string{"message": "Logged out successfully"})
}