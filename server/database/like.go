package database

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetUserLikes(user User, limit int64, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	cur, err := postCollection.Find(context.TODO(), bson.M{"likes": user.ID}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}

func AddLike(post_id, user_id primitive.ObjectID) int {
	postCollection := Mongo.Collection("posts")
	_, err := postCollection.UpdateByID(context.TODO(), post_id, bson.M{"$push": bson.M{"likes": user_id}})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func RemoveLike(post_id, user_id primitive.ObjectID) int {
	postCollection := Mongo.Collection("posts")
	_, err := postCollection.UpdateByID(context.TODO(), post_id, bson.M{"$pull": bson.M{"likes": user_id}})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}
