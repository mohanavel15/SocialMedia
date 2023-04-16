package restapi

import (
	"SocialMedia/server/database"
	"SocialMedia/server/response"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/exp/slices"
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
		offset = 0
	}

	posts := database.GetUserLikes(user, limit, offset)
	var res_post []response.Post
	for _, post := range posts {
		res_post = append(res_post, response.NewPost(post))
	}

	return ctx.JSON(res_post)
}

func AddLike(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	post_id_str := ctx.Params("post_id")

	post_id, err := primitive.ObjectIDFromHex(post_id_str)
	if err != nil {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status, post := database.GetPostByID(post_id)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	if has := slices.Contains(post.Likes, user.ID); has {
		return ctx.SendStatus(http.StatusNotModified)
	}

	status = database.AddLike(post.ID, user.ID)
	return ctx.SendStatus(status)
}

func RemoveLike(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	post_id_str := ctx.Params("post_id")

	post_id, err := primitive.ObjectIDFromHex(post_id_str)
	if err != nil {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status, post := database.GetPostByID(post_id)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	if has := slices.Contains(post.Likes, user.ID); !has {
		return ctx.SendStatus(http.StatusNotModified)
	}

	status = database.RemoveLike(post.ID, user.ID)
	return ctx.SendStatus(status)
}
