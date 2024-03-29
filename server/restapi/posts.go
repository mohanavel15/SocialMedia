package restapi

import (
	"SocialMedia/server/database"
	"SocialMedia/server/request"
	"SocialMedia/server/response"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUserPosts(ctx *fiber.Ctx) error {
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

	posts := database.GetUserPosts(user, limit, offset)
	res_posts := []response.Post{}
	for _, post := range posts {
		replies := database.GetRepliesCount(post.ID)
		res_posts = append(res_posts, response.NewPost(post, replies))
	}

	return ctx.JSON(res_posts)
}

func GetPost(ctx *fiber.Ctx) error {
	post_id_str := ctx.Params("post_id")

	post_id, err := primitive.ObjectIDFromHex(post_id_str)
	if err != nil {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status, post := database.GetPostByID(post_id)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	replies := database.GetRepliesCount(post.ID)
	res_post := response.NewPost(post, replies)
	return ctx.JSON(res_post)
}

func CreatePost(ctx *fiber.Ctx) error {
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	var post_request request.Post
	if err := ctx.BodyParser(&post_request); err != nil {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	if post_request.Content == "" && !post_request.Repost {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	parent_id, err := primitive.ObjectIDFromHex(post_request.ParentID)
	if err != nil {
		parent_id = primitive.NilObjectID
	}

	if post_request.Repost && parent_id == primitive.NilObjectID {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status, post := database.CreatePost(user.ID, post_request.Content, parent_id, post_request.Repost)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	replies := database.GetRepliesCount(post.ID)
	return ctx.JSON(response.NewPost(post, replies))
}

func DeletePost(ctx *fiber.Ctx) error {
	post_id_str := ctx.Params("post_id")
	user, status := GetUserFromContext(ctx)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusForbidden)
	}

	post_id, err := primitive.ObjectIDFromHex(post_id_str)
	if err != nil {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status, post := database.GetPostByID(post_id)
	if status != http.StatusOK {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	if post.AuthorID != user.ID {
		return ctx.SendStatus(http.StatusForbidden)
	}

	status = database.DeletePostByID(post.ID)
	return ctx.SendStatus(status)
}

func GetReplies(ctx *fiber.Ctx) error {
	post_id_str := ctx.Params("post_id")

	post_id, err := primitive.ObjectIDFromHex(post_id_str)
	if err != nil {
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

	posts := database.GetReplies(post_id, limit, offset)
	res_posts := []response.Post{}
	for _, post := range posts {
		replies := database.GetRepliesCount(post.ID)
		res_posts = append(res_posts, response.NewPost(post, replies))
	}

	return ctx.JSON(res_posts)
}

func GetAuthor(ctx *fiber.Ctx) error {
	post_id_str := ctx.Params("post_id")

	post_id, err := primitive.ObjectIDFromHex(post_id_str)
	if err != nil {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	status, post := database.GetPostByID(post_id)
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	user, status := database.GetUserByID(post.AuthorID.Hex())
	if status != http.StatusOK {
		return ctx.SendStatus(status)
	}

	return ctx.JSON(response.NewUser(user, 0))
}
