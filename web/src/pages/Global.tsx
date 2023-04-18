import { createSignal, For } from "solid-js"
import Post from "../components/Post"
import { Post as PostType } from "../models/post"

export default function Global() {
  const [posts, setPost] = createSignal<PostType[]>([])
  fetch("/api/feed/global").then(res => {
    if (res.ok) {
      res.json().then(res_post => setPost(res_post))
    }
  })
  return (
    <div class="h-full flex flex-col overflow-y-scroll">
      <For each={posts()}>
        { post => <Post post={post}/> }
      </For>
    </div>
  )
}
