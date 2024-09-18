package main

import (
    "net/http"
    "github.com/labstack/echo/v4"
)

func main() {
    e := echo.New()

    // Serve static files (React build)
    e.Static("/", "frontend/build")

    // API routes
    e.GET("/api/users", func(c echo.Context) error {
        return c.JSON(http.StatusOK, map[string]string{
            "message": "Hello from Golang API!",
        })
    })

    // Start the server
    e.Logger.Fatal(e.Start(":8080"))
}