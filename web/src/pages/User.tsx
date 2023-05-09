import { useParams } from "@solidjs/router";
import { createEffect, createSignal, For, useContext } from "solid-js";
import { useStore } from "../contexts/store";
import { UserContext } from "../contexts/usercontext";
import { User as UserOBJ } from "../models/user";
import { Post as PostType } from "../models/post"
import Post from "../components/Post";
import { default_avatar } from "../utils/default_avatar";

export default function User() {
  const store = useStore();
  const user_ctx = useContext(UserContext);
  const [user, setUser] = createSignal<UserOBJ>();
  const [tab, setTab] = createSignal(1);
  const params = useParams();

  const [posts, setPost] = createSignal<PostType[]>([])
  const [likes, setLike] = createSignal<PostType[]>([])
  
  createEffect(() => {
    store.getUserByUsername(params.username).then(u => setUser(u));

    fetch(`/api/users/${params.username}/posts`).then(res => {
      if (res.ok) {
        res.json().then(res_post => setPost(res_post))
      }
    })
    fetch(`/api/users/${params.username}/likes`).then(res => {
      if (res.ok) {
        res.json().then(res_post => setLike(res_post))
      }
    })
  })

  function ToggleFollow(follow: boolean) {
    let user_obj = user();
    if (user_obj === undefined) return

    fetch(`/api/users/${user_obj.username}/follow`, {
      method: follow ? "POST" : "DELETE"
    }).then(res => {
      if (res.ok && user_obj !== undefined) {
        if (follow) {
          user_ctx?.following.set(user_obj.id, user_obj);
        } else {
          user_ctx?.following.delete(user_obj.id);
        }
      }
    })
  }

  return (
    <div class="h-full w-full overflow-y-scroll">
      <div class="relative w-[100%] h-[20%] flex p-8">
        <div class="w-[30%] h-full flex items-center justify-center">
          <img src={user_ctx?.user()?.id || ""} class="border-black border-8 rounded-lg w-32 h-32 bg-white" onError={async (e) => { e.currentTarget.src = await default_avatar(user_ctx?.user()?.id || "") } } />
        </div>
        <div class="relative w-[70%] h-full flex items-center">
          <div class="flex flex-col">
            <span class="text-xl font-bold">{user()?.name}</span>
            <span>@{user()?.username}</span>
            <div class="flex items-center">
              <span class="font-semibold">Following {user()?.following}</span>
              <span class="w-4"></span>
              <span class="font-semibold">Followers {user()?.followers}</span>
            </div>
          </div>
          { user_ctx?.user()?.id !== user()?.id && user_ctx?.following.get(user()?.id || "") === undefined && <button class="absolute right-0 top-0 border-2 border-white rounded h-8 w-24 hover:bg-white hover:text-black cursor-pointer" onclick={() => ToggleFollow(true)}>Follow</button> }
          { user_ctx?.user()?.id !== user()?.id && user_ctx?.following.get(user()?.id || "") !== undefined && <button class="absolute right-0 top-0 border-2 border-red-600 text-red-600 rounded h-8 w-24 hover:bg-red-600 hover:text-black cursor-pointer" onclick={() => ToggleFollow(false)}>Unfollow</button> }
        </div>
      </div>
      <div class="border-b border-zinc-600 flex items-center justify-evenly h-12">
        <button class="w-1/2 hover:bg-zinc-900 h-full" onclick={() => setTab(1)}>
          <span class={tab() === 1 ? "border-blue-700 border-b-4" : ""}>Posts</span>
        </button>
        <button class="w-1/2 hover:bg-zinc-900 h-full" onclick={() => setTab(2)}>
          <span class={tab() === 2 ? "border-blue-700 border-b-4" : ""}>Likes</span>
        </button>
      </div>
      <For each={tab() === 1 ? posts() : likes()}>
        { post => <Post post={post} thread={false} /> }
      </For>
    </div>
  )
}