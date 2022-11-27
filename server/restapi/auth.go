package restapi

import (
	"SocialMedia/server/database"
	"SocialMedia/server/request"
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var JWT_SECRET = os.Getenv("JWT_SECRET")

func Register(ctx *fiber.Ctx) error {
	var register request.LoginRegister
	ctx.BodyParser(&register)

	username := strings.ToLower(strings.TrimSpace(register.Username))
	password := strings.TrimSpace(register.Password)

	if username == "" || password == "" {
		ctx.Status(http.StatusBadRequest)
		return ctx.SendString("Username or Password can't be empty")
	}

	if strings.Contains(username, " ") {
		ctx.Status(http.StatusBadRequest)
		return ctx.SendString("Username can't have spaces")
	}

	if len(username) < 3 || len(username) > 20 {
		ctx.Status(http.StatusBadRequest)
		return ctx.SendString("Username must be between 3 and 20 characters")
	}

	_, status := database.GetUserByUsername(username)
	if status == http.StatusOK {
		ctx.Status(http.StatusForbidden)
		return ctx.SendString("Username Already Taken")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return ctx.SendStatus(http.StatusInternalServerError)
	}

	user := database.User{
		ID:         primitive.NewObjectID(),
		Name:       username,
		Username:   username,
		Bio:        "",
		Password:   hashedPassword,
		CreatedAt:  time.Now().Unix(),
		LastLogout: 0,
	}

	users := database.Mongo.Collection("users")
	_, err = users.InsertOne(context.TODO(), user)
	if err != nil {
		return ctx.SendStatus(http.StatusInternalServerError)
	}

	return ctx.SendStatus(http.StatusOK)
}

func Login(ctx *fiber.Ctx) error {
	var login request.LoginRegister
	ctx.BodyParser(&login)

	username := strings.ToLower(strings.TrimSpace(login.Username))
	password := strings.TrimSpace(login.Password)

	user, status := database.GetUserByUsername(username)
	if status != http.StatusOK {
		ctx.Status(http.StatusBadRequest)
		return ctx.SendString("Invalid Username or Password")
	}

	err := bcrypt.CompareHashAndPassword(user.Password, []byte(password))
	if err != nil {
		ctx.Status(http.StatusBadRequest)
		return ctx.SendString("Invalid Username or Password")
	}

	secret_key := []byte(JWT_SECRET)
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["id"] = user.ID.Hex()
	claims["iat"] = time.Now().Unix()
	claims["exp"] = time.Now().Unix() * 2

	tokenString, err := token.SignedString(secret_key)
	if err != nil {
		return ctx.SendStatus(http.StatusInternalServerError)
	}

	cookie := new(fiber.Cookie)
	cookie.Name = "access_token"
	cookie.Value = tokenString
	cookie.Expires = time.Now().Add(time.Hour * 24 * 365 * 100)
	cookie.HTTPOnly = true
	cookie.Secure = false
	ctx.Cookie(cookie)
	return ctx.SendStatus(http.StatusOK)
}

func Logout(ctx *fiber.Ctx) error {
	accessToken := ctx.Cookies("access_token")

	isValid, user := ValidateAccessToken(accessToken)
	if !isValid {
		return ctx.SendStatus(http.StatusBadRequest)
	}

	users := database.Mongo.Collection("users")
	users.UpdateOne(context.TODO(), bson.M{"_id": user.ID}, bson.M{"$set": bson.M{"last_logout": time.Now().Unix()}})

	cookie := new(fiber.Cookie)
	cookie.Name = "access_token"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-1 * time.Second)
	cookie.HTTPOnly = true
	cookie.Secure = false

	ctx.Cookie(cookie)
	return ctx.SendStatus(http.StatusOK)
}

func GenerateToken(user_id string) (string, error) {
	secret_key := []byte(JWT_SECRET)
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["id"] = user_id
	claims["iat"] = time.Now().Unix()
	claims["exp"] = time.Now().Unix() * 2

	return token.SignedString(secret_key)
}

func ValidateAccessToken(AccessToken string) (bool, database.User) {
	var user database.User
	claims, err := ValidateJWT(AccessToken)
	if err != nil {
		return false, user
	}

	user, status := database.GetUserByID(claims["id"].(string))
	if status != http.StatusOK {
		return false, user
	}

	iat := int64(claims["iat"].(float64))
	if user.LastLogout >= iat {
		return false, user
	}

	return true, user
}

func ValidateJWT(tokenString string) (jwt.MapClaims, error) {
	secret_key := []byte(JWT_SECRET)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there was an error")
		}
		return secret_key, nil
	})

	if err != nil {
		return jwt.MapClaims{}, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	} else {
		return jwt.MapClaims{}, fmt.Errorf("token is invalid")
	}
}

func GetUserFromContext(ctx *fiber.Ctx) (database.User, int) {
	accessToken := ctx.Cookies("access_token")
	isValid, user := ValidateAccessToken(accessToken)
	if !isValid {
		return user, http.StatusBadGateway
	}
	return user, http.StatusOK
}
