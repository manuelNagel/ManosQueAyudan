package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/gorilla/sessions"
	"backend/services"
)

func AuthMiddleware(store *sessions.CookieStore, userService *services.UsuarioService) echo.MiddlewareFunc {
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

			user, err := userService.GetUsuario(userID.(int))
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "Invalid user session")
			}

			// Add user to context
			c.Set("user", user)

			return next(c)
		}
	}
}