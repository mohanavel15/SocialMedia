package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetGlobalFeed(limit, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	cur, err := postCollection.Find(context.TODO(), bson.M{}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}

func GetFeed(user User, limit int64, offset int64) []Post {
	posts := []Post{}
	postCollection := Mongo.Collection("posts")

	following := []primitive.ObjectID{}
	following = append(following, user.ID)
	following = append(following, user.Following...)

	cur, err := postCollection.Find(context.TODO(), bson.M{"author_id": bson.M{"$in": following}}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(limit).SetSkip(offset))
	if err != nil {
		return posts
	}

	_ = cur.All(context.TODO(), &posts)
	return posts
}
