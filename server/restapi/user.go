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
		return ctx.SendStatus(status)
	}

	followers := database.GetUserFollowersCount(user.ID)
	return ctx.JSON(response.NewUser(user, followers))
}

func GetUserByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	user, status := database.GetUserByID(id)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	followers := database.GetUserFollowersCount(user.ID)
	return ctx.JSON(response.NewUser(user, followers))
}

func GetCurrentUser(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	followers := database.GetUserFollowersCount(user.ID)
	return ctx.JSON(response.NewUser(user, followers))
}

func GetUserFollowing(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	if username == "" {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	user, status := database.GetUserByUsername(username)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	res := []response.User{}
	users := database.GetFollowing(user)
	for _, u := range users {
		followers := database.GetUserFollowersCount(u.ID)
		res = append(res, response.NewUser(u, followers))
	}

	return ctx.JSON(res)
}
