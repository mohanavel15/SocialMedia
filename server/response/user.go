package response

import "SocialMedia/server/database"

type User struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	Following int    `json:"following"`
	CreatedAt int64  `json:"created_at"`
}

func NewUser(user database.User) User {
	return User{
		ID:        user.ID.Hex(),
		Name:      user.Name,
		Username:  user.Username,
		Bio:       user.Bio,
		Following: len(user.Following),
		CreatedAt: user.CreatedAt,
	}
}
