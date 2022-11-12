package response

import "SocialMedia/server/database"

type User struct {
	Name      string `json:"name"`
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	Verified  bool   `json:"verified"`
	CreatedAt int64  `json:"created_at"`
}

func NewUser(user database.User) User {
	return User{
		Name:      user.Name,
		Username:  user.Username,
		Bio:       user.Bio,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}
}
