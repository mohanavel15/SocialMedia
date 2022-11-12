package database

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `bson:"_id"`
	Name       string             `bson:"name"`
	Username   string             `bson:"username"`
	Bio        string             `bson:"bio"`
	Verified   bool               `bson:"verified"`
	Password   []byte             `bson:"password"`
	CreatedAt  int64              `bson:"created_at"`
	LastLogout int64              `bson:"last_logout"`
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
