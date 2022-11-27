package restapi

import (
	"SocialMedia/server/database"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetFeed(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	limit, err := strconv.ParseInt(ctx.Query("limit"), 10, 64)
	if err != nil {
		limit = 25
	}

	offset, err := strconv.ParseInt(ctx.Query("offset"), 10, 64)
	if err != nil {
		offset = 1
	}

	posts := database.GetFeed(user, limit, offset)
	return ctx.JSON(posts)
}

func GetGlobalFeed(ctx *fiber.Ctx) error {
	limit, err := strconv.ParseInt(ctx.Query("limit"), 10, 64)
	if err != nil {
		limit = 25
	}

	offset, err := strconv.ParseInt(ctx.Query("offset"), 10, 64)
	if err != nil {
		offset = 1
	}

	posts := database.GetGlobalFeed(limit, offset)
	return ctx.JSON(posts)
}
