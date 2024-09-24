package middleware

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/labstack/echo/v4"
)

func ServeSPAMiddleware(staticPath string, indexPath string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// consigue los estaticos
			if strings.HasPrefix(c.Request().URL.Path, "/static/") {
				return next(c)
			}

			// consigue index para rutas sin api
			if !strings.HasPrefix(c.Request().URL.Path, "/api/") {
				path := filepath.Join(staticPath, indexPath)
				if _, err := os.Stat(path); err == nil {
					return c.File(path)
				}
			}

			return next(c)
		}
	}
}