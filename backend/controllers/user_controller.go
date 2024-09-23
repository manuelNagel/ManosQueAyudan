package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type UserController struct {
	DB *sql.DB
}

func (uc *UserController) getUser(c echo.Context) error {
	session, _ := store.Get(c.Request(), "session-name")
	userID := session.Values["user_id"].(int)

	u := new(models.User)
	err := uc.DB.QueryRow("SELECT id, username, email, user_type FROM users WHERE id = ?", userID).Scan(&u.ID, &u.Username, &u.Email, &u.UserType)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Could not fetch user")
	}

	return c.JSON(http.StatusOK, u)
}