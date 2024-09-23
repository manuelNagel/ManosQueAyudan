package main

import (
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func loginController(c echo.Context) error {
	u := new(User)
	if err := c.Bind(u); err != nil {
		return err
	}

	if authenticateUser(u.Username, u.Password) {
		session := c.Get("session").(*sessions.Session)
		session.Values["authenticated"] = true
		session.Values["username"] = u.Username
		session.Save(c.Request(), c.Response().Writer)
		return c.JSON(http.StatusOK, map[string]string{"message": "Logged in successfully"})
	}

	return echo.ErrUnauthorized
}

func logoutController(c echo.Context) error {
	session := c.Get("session").(*sessions.Session)
	session.Values["authenticated"] = false
	session.Values["username"] = ""
	session.Save(c.Request(), c.Response().Writer)
	return c.JSON(http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

func protectedController(c echo.Context) error {
	session := c.Get("session").(*sessions.Session)
	username := session.Values["username"].(string)
	return c.JSON(http.StatusOK, map[string]string{"message": "Welcome to the protected area", "user": username})
}
