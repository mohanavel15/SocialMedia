export type Post = {
    id:        string,
	parent_id:  string,
	author_id:  string,
	content:   string,
	repost:    boolean,
	likes:     number,
	created_at: number,
}