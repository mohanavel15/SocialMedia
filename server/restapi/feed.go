package restapi

import (
	"SocialMedia/server/database"
	"SocialMedia/server/response"
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
		offset = 0
	}

	posts := database.GetFeed(user, limit, offset)
	res_posts := []response.Post{}
	for _, post := range posts {
		replies := database.GetRepliesCount(post.ID)
		res_posts = append(res_posts, response.NewPost(post, replies))
	}

	return ctx.JSON(res_posts)
}

func GetGlobalFeed(ctx *fiber.Ctx) error {
	limit, err := strconv.ParseInt(ctx.Query("limit"), 10, 64)
	if err != nil {
		limit = 25
	}

	offset, err := strconv.ParseInt(ctx.Query("offset"), 10, 64)
	if err != nil {
		offset = 0
	}

	posts := database.GetGlobalFeed(limit, offset)
	res_posts := []response.Post{}
	for _, post := range posts {
		replies := database.GetRepliesCount(post.ID)
		res_posts = append(res_posts, response.NewPost(post, replies))
	}

	return ctx.JSON(res_posts)
}
