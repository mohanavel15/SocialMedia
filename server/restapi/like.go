package restapi

import (
	"SocialMedia/server/database"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetUserLikes(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	if username == "" {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	user, status := database.GetUserByUsername(username)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	limit, err := strconv.ParseInt(ctx.Query("limit"), 10, 64)
	if err != nil {
		limit = 25
	}

	offset, err := strconv.ParseInt(ctx.Query("offset"), 10, 64)
	if err != nil {
		offset = 1
	}

	posts := database.GetUserLikes(user, limit, offset)
	return ctx.JSON(posts)
}
