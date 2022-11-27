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
	Repost    bool                 `bson:"repost"`
	Likes     []primitive.ObjectID `bson:"likes"`
	CreatedAt int64                `bson:"created_at"`
}

func GetUserPosts(user User, limit int64, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	cur, err := postCollection.Find(context.TODO(), bson.M{"author_id": user.ID}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}

func CreatePost(user_id primitive.ObjectID, content string, parent_id primitive.ObjectID, repost bool) (int, Post) {
	postCollection := Mongo.Collection("posts")

	post := Post{
		ID:        primitive.NewObjectID(),
		ParentID:  parent_id,
		AuthorID:  user_id,
		Content:   content,
		Repost:    repost,
		Likes:     []primitive.ObjectID{},
		CreatedAt: time.Now().Unix(),
	}

	_, err := postCollection.InsertOne(context.TODO(), post)
	if err != nil {
		return http.StatusInternalServerError, Post{}
	}

	return http.StatusOK, post
}

func GetPostByID(author_id, post_id primitive.ObjectID) (int, Post) {
	var post Post
	postCollection := Mongo.Collection("posts")
	err := postCollection.FindOne(context.TODO(), bson.M{"author_id": author_id, "_id": post_id}).Decode(&post)
	if err != nil {
		return http.StatusNotFound, Post{}
	}

	return http.StatusOK, post
}

func DeletePostByID(author_id, post_id primitive.ObjectID) int {
	postCollection := Mongo.Collection("posts")
	_, err := postCollection.DeleteOne(context.TODO(), bson.M{"author_id": author_id, "_id": post_id})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}
