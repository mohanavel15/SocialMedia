package database

import (
	"context"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Post struct {
	ID        primitive.ObjectID   `bson:"_id"`
	ParentID  primitive.ObjectID   `bson:"parent_id"`
	AuthorID  primitive.ObjectID   `bson:"author_id"`
	Content   string               `bson:"content"`
	Likes     []primitive.ObjectID `bson:"likes"`
	CreatedAt int64                `bson:"created_at"`
}

func GetPosts(limit, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	cur, err := postCollection.Find(context.TODO(), bson.M{}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}

func GetUserPosts(user User, limit int64, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	cur, err := postCollection.Find(context.TODO(), bson.M{"author_id": user.ID, "parent_id": primitive.NilObjectID}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}

func GetUserComments(user User, limit int64, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	cur, err := postCollection.Find(context.TODO(), bson.M{"author_id": user.ID, "parent_id": bson.M{"$ne": primitive.NilObjectID}}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}

func CreatePost(user_id primitive.ObjectID, content string) (int, Post) {
	postCollection := Mongo.Collection("posts")

	post := Post{
		ID:        primitive.NewObjectID(),
		ParentID:  primitive.NilObjectID,
		AuthorID:  user_id,
		Content:   content,
		Likes:     []primitive.ObjectID{},
		CreatedAt: time.Now().Unix(),
	}

	_, err := postCollection.InsertOne(context.TODO(), post)
	if err != nil {
		return http.StatusInternalServerError, Post{}
	}

	return http.StatusOK, post
}

func CommentOnPost(user_id primitive.ObjectID, post_id primitive.ObjectID, content string) (int, Post) {
	postCollection := Mongo.Collection("posts")

	post := Post{
		ID:        primitive.NewObjectID(),
		ParentID:  post_id,
		AuthorID:  user_id,
		Content:   content,
		Likes:     []primitive.ObjectID{},
		CreatedAt: time.Now().Unix(),
	}

	_, err := postCollection.InsertOne(context.TODO(), post)
	if err != nil {
		return http.StatusInternalServerError, Post{}
	}

	return http.StatusOK, post
}

func AddLike(like_id, user_id primitive.ObjectID) int {
	postCollection := Mongo.Collection("posts")
	_, err := postCollection.UpdateByID(context.TODO(), like_id, bson.M{"$push": bson.M{"likes": like_id}})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func RemoveLike(like_id, user_id primitive.ObjectID) int {
	postCollection := Mongo.Collection("posts")
	_, err := postCollection.UpdateByID(context.TODO(), like_id, bson.M{"$pull": bson.M{"likes": like_id}})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}
