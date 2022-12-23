package restapi

import (
	"SocialMedia/server/database"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func FollowUser(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	username := ctx.Params("username")
	if username == "" {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	UserToFollow, status := database.GetUserByUsername(username)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status = database.Follow(user, UserToFollow)
	return ctx.SendStatus(status)
}

func UnfollowUser(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	username := ctx.Params("username")
	if username == "" {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	UserToFollow, status := database.GetUserByUsername(username)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status = database.Unfollow(user, UserToFollow)
	return ctx.SendStatus(status)
}
