package main

import (
	"SocialMedia/server/database"
	"SocialMedia/server/restapi"
	"os"

	"github.com/gofiber/fiber/v2"
)

var (
	SERVER_URI     = os.Getenv("SERVER_URI")
	MONGO_URI      = os.Getenv("MONGO_URI")
	MONGO_DATABASE = os.Getenv("MONGO_DATABASE")
)

func main() {
	database.ConnectDatabase(MONGO_URI, MONGO_DATABASE)

	app := fiber.New()

	app.Post("/register", restapi.Register)
	app.Post("/login", restapi.Login)
	app.Post("/logout", restapi.Logout)

	app.Listen(SERVER_URI)
}
