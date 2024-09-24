package middleware

import (
	"net/http"
	"github.com/labstack/echo/v4"
	"ManosQueAyudan/backend/utils"
)

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		session, _ := utils.GetSessionStore().Get(c.Request(), "session-name")
		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			return echo.NewHTTPError(http.StatusUnauthorized, "Please log in to access this resource")
		}
		return next(c)
	}
}