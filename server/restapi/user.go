package restapi

import (
	"SocialMedia/server/database"
	"SocialMedia/server/response"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func GetUser(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	if username == "" {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	user, status := database.GetUserByUsername(username)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusNotFound)
	}

	return ctx.JSON(response.NewUser(user))
}
