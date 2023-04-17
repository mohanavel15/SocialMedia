package response

import "SocialMedia/server/database"

type User struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	Following int64  `json:"following"`
	Followers int64  `json:"followers"`
	CreatedAt int64  `json:"created_at"`
}

func NewUser(user database.User, followers int64) User {
	return User{
		ID:        user.ID.Hex(),
		Name:      user.Name,
		Username:  user.Username,
		Bio:       user.Bio,
		Following: int64(len(user.Following)),
		Followers: followers,
		CreatedAt: user.CreatedAt,
	}
}
