package main

import (
	"SocialMedia/server/database"
	"SocialMedia/server/restapi"
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
)

var (
	SERVER_URI     = os.Getenv("SERVER_URI")
	MONGO_URI      = os.Getenv("MONGO_URI")
	MONGO_DATABASE = os.Getenv("MONGO_DATABASE")
)

func main() {
	if SERVER_URI == "" || MONGO_URI == "" || MONGO_DATABASE == "" {
		log.Fatalln("Environment variables missing...")
	}

	database.ConnectDatabase(MONGO_URI, MONGO_DATABASE)

	app := fiber.New()

	app.Post("/api/register", restapi.Register)
	app.Post("/api/login", restapi.Login)
	app.Post("/api/logout", restapi.Logout)

	app.Get("/api/users/:username", restapi.GetUser)

	app.Static("/assets", "./web/dist/assets")
	app.Static("*", "./web/dist/index.html")

	go log.Fatalln(app.Listen(SERVER_URI))

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	<-c
	log.Println("Gracefully shutting down...")
	if err := app.Shutdown(); err != nil {
		log.Println(err)
	}

	log.Println("Running cleanup tasks...")
	if err := database.Mongo.Client().Disconnect(context.TODO()); err != nil {
		log.Println(err)
	}

	log.Println("Done")
}
