import { useParams } from "@solidjs/router";
import { createSignal, For, onMount, useContext } from "solid-js";
import { useStore } from "../contexts/store";
import { UserContext } from "../contexts/usercontext";
import { User as UserOBJ } from "../models/user";
import { Post as PostType } from "../models/post"
import Post from "../components/Post";

export default function User() {
  const store = useStore();
  const user_ctx = useContext(UserContext);
  const [user, setUser] = createSignal<UserOBJ>();
  const [tab, setTab] = createSignal(1);
  const params = useParams();

  const getUser = (username: string) => {
    if (username == user_ctx?.user()?.username) {
      setUser(user_ctx?.user())
    } else {
      let user = store.users.get(username);
      if (user === undefined) {
        fetch("/api/users/" + username).then(res => {
          if (res.ok) {
            res.json().then((user: UserOBJ) => { setUser(user); store.users.set(user.id, user); store.users.set(user.username, user) });
          }
        })
      } else {
        setUser(user)
      }
    }
  }

  const [posts, setPost] = createSignal<PostType[]>([])
  fetch(`/api/users/${params.username}/posts`).then(res => {
    if (res.ok) {
      res.json().then(res_post => setPost(res_post))
    }
  })

  const [likes, setLike] = createSignal<PostType[]>([])
  fetch(`/api/users/${params.username}/likes`).then(res => {
    if (res.ok) {
      res.json().then(res_post => setLike(res_post))
    }
  })

  onMount(() => {
    getUser(params.username)
  })

  return (
    <div class="h-full w-full overflow-y-scroll">
      <div class="relative w-[100%] h-[30%] flex">
        <div class="w-[30%] h-full flex items-center justify-center">
          <div class="border-black border-8 rounded-lg w-32 h-32 bg-white flex items-center justify-center">
            <span class="text-6xl text-black">{user()?.name.charAt(0)}</span>
          </div>
        </div>
        <div class="w-[70%] h-full flex items-center">
          <div class="flex flex-col">
            <span class="text-xl font-bold">{user()?.name}</span>
            <span>@{user()?.username}</span>
          </div>
        </div>
      </div>
      <div class="border-b border-white flex items-center justify-evenly h-12">
        <button class="w-1/2 hover:bg-zinc-900 h-full" onclick={() => setTab(1)}>
          <span class={tab() === 1 ? "border-blue-700 border-b-4" : ""}>Posts</span>
        </button>
        <button class="w-1/2 hover:bg-zinc-900 h-full" onclick={() => setTab(2)}>
          <span class={tab() === 2 ? "border-blue-700 border-b-4" : ""}>Likes</span>
        </button>
      </div>
      <For each={tab() === 1 ? posts() : likes()}>
        { post => <>{ (post.parent_id === "000000000000000000000000" || post.repost) && <Post post={post}/> }</> }
      </For>
    </div>
  )
}