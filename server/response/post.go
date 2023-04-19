package response

import "SocialMedia/server/database"

type Post struct {
	ID        string `json:"id"`
	ParentID  string `json:"parent_id"`
	AuthorID  string `json:"author_id"`
	Content   string `json:"content"`
	Repost    bool   `json:"repost"`
	Likes     int64  `json:"likes"`
	Replies   int64  `json:"replies"`
	CreatedAt int64  `json:"created_at"`
}

func NewPost(post database.Post, Replies int64) Post {
	return Post{
		ID:        post.ID.Hex(),
		ParentID:  post.ParentID.Hex(),
		AuthorID:  post.AuthorID.Hex(),
		Content:   post.Content,
		Repost:    post.Repost,
		Likes:     int64(len(post.Likes)),
		Replies:   Replies,
		CreatedAt: post.CreatedAt,
	}
}
