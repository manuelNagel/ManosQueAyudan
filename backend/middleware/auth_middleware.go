package middleware

import (
	"github.com/labstack/echo/v4"
)

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		session, _ := store.Get(c.Request(), "session-name")
		auth, ok := session.Values["authenticated"].(bool)
		if !ok || !auth {
			return echo.NewHTTPError(http.StatusUnauthorized, "Please log in to access this resource")
		}
		return next(c)
	}
}

func AdminMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		session, _ := store.Get(c.Request(), "session-name")
		userType, ok := session.Values["user_type"].(string)
		if !ok || userType != "admin" {
			return echo.NewHTTPError(http.StatusForbidden, "Admin access required")
		}
		return next(c)
	}
}