import { createSignal, For } from "solid-js"
import Post from "../components/Post"
import { Post as PostType } from "../models/post"

export default function Feed() {
  const [posts, setPost] = createSignal<PostType[]>([])
  fetch("/api/feed").then(res => {
    if (res.ok) {
      res.json().then(res_post => { setPost(res_post); res_post.forEach((post: any) => console.log(post.parent_id)) })
    }
  })

  return (
    <div class="h-full flex flex-col">
      <For each={posts()}>
        { post => <>{ (post.parent_id === "000000000000000000000000" || post.repost) && <Post post={post}/> }</> }
      </For>
    </div>
  )
}
