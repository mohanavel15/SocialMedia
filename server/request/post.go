package request

type Post struct {
	Content  string `json:"content"`
	ParentID string `json:"parent_id"`
	Repost   bool   `json:"repost"`
}
