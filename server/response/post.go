package response

import "SocialMedia/server/database"

type Post struct {
	ID        string `json:"id"`
	ParentID  string `json:"parent_id"`
	AuthorID  string `json:"author_id"`
	Content   string `json:"content"`
	Repost    bool   `json:"repost"`
	Likes     int    `json:"likes"`
	CreatedAt int64  `json:"created_at"`
}

func NewPost(post database.Post) Post {
	return Post{
		ID:        post.ID.Hex(),
		ParentID:  post.ParentID.Hex(),
		AuthorID:  post.AuthorID.Hex(),
		Content:   post.Content,
		Repost:    post.Repost,
		Likes:     len(post.Likes),
		CreatedAt: post.CreatedAt,
	}
}
