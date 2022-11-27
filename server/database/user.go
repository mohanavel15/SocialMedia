package database

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID   `bson:"_id"`
	Name       string               `bson:"name"`
	Username   string               `bson:"username"`
	Bio        string               `bson:"bio"`
	Password   []byte               `bson:"password"`
	Following  []primitive.ObjectID `bson:"following"`
	CreatedAt  int64                `bson:"created_at"`
	LastLogout int64                `bson:"last_logout"`
}

func GetUserByID(id string) (User, int) {
	var user User

	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return user, http.StatusBadRequest
	}

	users := Mongo.Collection("users")
	err = users.FindOne(context.TODO(), bson.M{"_id": oid}).Decode(&user)
	if err != nil {
		return user, http.StatusNotFound
	}

	return user, http.StatusOK
}

func GetUserByUsername(username string) (User, int) {
	var user User
	users := Mongo.Collection("users")

	err := users.FindOne(context.TODO(), bson.M{"username": username}).Decode(&user)
	if err != nil {
		return user, http.StatusNotFound
	}

	return user, http.StatusOK
}

func UpdateUsername(user_id primitive.ObjectID, username string) int {
	users := Mongo.Collection("users")
	_, err := users.UpdateByID(context.TODO(), user_id, bson.M{"username": username})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func UpdateName(user_id primitive.ObjectID, name string) int {
	users := Mongo.Collection("users")
	_, err := users.UpdateByID(context.TODO(), user_id, bson.M{"name": name})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func UpdateBio(user_id primitive.ObjectID, bio string) int {
	users := Mongo.Collection("users")
	_, err := users.UpdateByID(context.TODO(), user_id, bson.M{"bio": bio})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func Follow(user_id, follow_user_id primitive.ObjectID) int {
	users := Mongo.Collection("users")
	_, err := users.UpdateByID(context.TODO(), user_id, bson.M{"$push": bson.M{"following": follow_user_id}})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func Unfollow(user_id, unfollow_user_id primitive.ObjectID) int {
	users := Mongo.Collection("users")
	_, err := users.UpdateByID(context.TODO(), user_id, bson.M{"$pull": bson.M{"following": unfollow_user_id}})
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}
