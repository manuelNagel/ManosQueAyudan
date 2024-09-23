package main

import (
	"database/sql"
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
)

var (
	db    *sql.DB
	store = sessions.NewCookieStore([]byte("your-secret-key"))
)

func main() {
	// Database connection
	var err error
	db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/mydatabase")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	e.Use(sessionMiddleware)

	// Setup routes
	setupRoutes(e)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}