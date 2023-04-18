import { createSignal, For } from "solid-js"
import CreatePost from "../components/CreatePost"
import Post from "../components/Post"
import { useUserContext } from "../contexts/usercontext"
import { Post as PostType } from "../models/post"

export default function Feed() {
  const user_ctx = useUserContext();
  const [posts, setPost] = createSignal<PostType[]>([])
  fetch("/api/feed").then(res => {
    if (res.ok) {
      res.json().then(res_post => { setPost(res_post) })
    }
  })

  return (
    <div class="h-full flex flex-col overflow-y-scroll">
      { user_ctx?.isLoggedIn && <CreatePost parent_id="" /> }
      <For each={posts()}>
        { post => <>{ (post.parent_id === "000000000000000000000000" || post.repost) && <Post post={post}/> }</> }
      </For>
    </div>
  )
}
