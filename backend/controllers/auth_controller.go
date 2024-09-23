package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type AuthController struct {
	DB    *sql.DB
	Store sessions.Store
}

func (ac *AuthController) register(c echo.Context) error {
	u := new(models.User)
	if err := c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := u.HashPassword(); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Could not hash password")
	}

	// Default to 'regular' user type if not specified
	if u.UserType == "" {
		u.UserType = "regular"
	}

	_, err := ac.DB.Exec("INSERT INTO users (username, password, email, user_type) VALUES (?, ?, ?, ?)", 
		u.Username, u.Password, u.Email, u.UserType)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Could not create user")
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "User created successfully"})
}

func (ac *AuthController) login(c echo.Context) error {
	u := new(models.User)
	if err := c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	storedUser := new(models.User)
	err := ac.DB.QueryRow("SELECT id, username, password, user_type FROM users WHERE username = ?", 
		u.Username).Scan(&storedUser.ID, &storedUser.Username, &storedUser.Password, &storedUser.UserType)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	if !storedUser.CheckPassword(u.Password) {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	// Create session
	session, _ := ac.Store.Get(c.Request(), "session-name")
	session.Values["authenticated"] = true
	session.Values["user_id"] = storedUser.ID
	session.Values["user_type"] = storedUser.UserType
	session.Save(c.Request(), c.Response())

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Logged in successfully",
		"userType": storedUser.UserType,
	})
}

func (ac *AuthController) logout(c echo.Context) error {
	session, _ := ac.Store.Get(c.Request(), "session-name")
	session.Values["authenticated"] = false
	session.Values["user_id"] = nil
	session.Values["user_type"] = nil
	session.Save(c.Request(), c.Response())

	return c.JSON(http.StatusOK, map[string]string{"message": "Logged out successfully"})
}