import { Link, useNavigate, useParams } from "@solidjs/router";
import { AiFillLike, AiOutlineArrowLeft, AiOutlineLike, AiOutlineRetweet } from "solid-icons/ai";
import { FaRegularMessage } from "solid-icons/fa";
import { createEffect, createSignal, For } from "solid-js";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import PostPreview from "../components/PostPreview";
import { useStore } from "../contexts/store";
import { useUserContext } from "../contexts/usercontext";
import { Post as PostType } from "../models/post";
import { User } from "../models/user";

export default function PostPage() {
  const store = useStore();
  const user_ctx = useUserContext();
  const params = useParams();
  const [parents, setParents] = createSignal<PostType[]>([]);
  const [post, setPost] = createSignal<PostType>();
  const [author, setAuthor] = createSignal<User>();
  const [replies, setReplies] = createSignal<PostType[]>([]);

  function ToggleLike(add: boolean, post: PostType) {
    fetch(`/api/posts/${post.id}/like`, {
      method: add ? "POST" : "DELETE",
    }).then((r) => {
      if (r.ok) {
        if (add) {
          post.likes += 1;
          user_ctx?.likes.set(post.id, post);
        } else {
          post.likes -= 1;
          user_ctx?.likes.delete(post.id);
        }
        let like_el = document.getElementById(`${post.id}-like`);
        if (like_el) {
          like_el.innerText = post.likes.toString();
        }
      }
    })
  }

  async function getReplies(post_id: string) {
    let res = await fetch(`/api/posts/${post_id}/replies`);
    if (res.ok) {
      res.json().then(res_post => setReplies(res_post))
    }
  }

  function GetParents(parent_id: string) {
    store.getPost(parent_id).then(post => {
      setParents(p => [post, ...p]);
      if (post.parent_id != "000000000000000000000000") {
        GetParents(post.parent_id);
      }
    })
  }

  createEffect(() => {
    store.getPost(params.id).then(p => {
      setPost(p);
      getReplies(p.id);
      store.getUserById(p.author_id).then(u => {
        setAuthor(u)
      })
      setParents([]);
      if (p.parent_id != "000000000000000000000000") {
        GetParents(p.parent_id)
      }
    });
  });

  const navigate = useNavigate();

  return (
    <div class="flex flex-col w-full h-full overflow-y-scroll p-4 gap-4">
      <div class="flex h-14 items-center">
        <AiOutlineArrowLeft class="hover:bg-zinc-900 rounded-full cursor-pointer" size={32} onclick={() => navigate(-1)} />
        <span class="px-6 font-bold text-xl">Post</span>
      </div>
      <For each={parents()}>{p => <Post post={p} thread={true} />}</For>
      <div class="flex items-center gap-4 px-6">
        <div class="rounded h-16 w-16 bg-white flex items-center justify-center">
          <span class="text-3xl text-black">{author()?.name.charAt(0)}</span>
        </div>
        <div class="flex flex-col">
          <Link href={`/users/${author()?.username}`} class="font-bold text-xl">{author()?.name}</Link>
          <span>@{author()?.username}</span>
        </div>
      </div>
      <span class="px-6">{post()?.content}</span>
      {post()?.repost && <PostPreview id={post()?.parent_id || ""} />}
      <div class="flex justify-evenly items-center h-12 border-y border-white">
        <button class="flex items-center justify-evenly gap-1">
          <FaRegularMessage size={16} />
          <span>{post()?.replies}</span>
        </button>
        <button><AiOutlineRetweet size={16} /></button>
        <button class="flex items-center justify-evenly gap-1" onclick={() => ToggleLike(user_ctx?.likes.get(post()?.id || "") === undefined, post()!)}>
          {user_ctx?.likes.get(post()?.id || "") !== undefined ? <AiFillLike size={16} color="red" /> : <AiOutlineLike size={16} />}
          <span id={`${post()?.id}-like`}>{post()?.likes}</span>
        </button>
      </div>
      <CreatePost parent_id={params.id} />
      <For each={replies()}>{post => <Post post={post} thread={false} />}</For>
    </div>
  )
}
