import { Post as PostType } from "../models/post";
import { AiFillLike, AiOutlineLike, AiOutlineRetweet } from "solid-icons/ai";
import { FaRegularMessage } from "solid-icons/fa";
import { useStore } from "../contexts/store";
import { User } from "../models/user";
import { useUserContext } from "../contexts/usercontext";
import { Link, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import PostPreview from "./PostPreview";

export default function Post(props: { post: PostType }) {
    const store = useStore();
    const user_ctx = useUserContext();
    const [author, setAuthor] = createSignal({ name: "", username: "" } as User);
    const [parentAuthor, setParentAuthor] = createSignal({ name: "", username: "" } as User);

    let user = store.users.get(props.post.author_id);
    if (user === undefined) {
        fetch("/api/users-id/" + props.post.author_id).then(res => {
            if (res.ok) {
                res.json().then((user: User) => { setAuthor(user); store.users.set(user.id, user); store.users.set(user.username, user) });
            }
        })
    } else {
        setAuthor(user)
    }

    function GetParentAuthor(parent_id: string) {
        fetch(`/api/posts/${parent_id}/author`).then(res => {
            if (res.ok) {
                res.json().then((user: User) => setParentAuthor(user));
            }
        })
    }

    if (props.post.parent_id != "000000000000000000000000") {
        GetParentAuthor(props.post.parent_id);
    }

    function ToggleLike(add: boolean) {
        fetch(`/api/posts/${props.post.id}/like`, {
            method: add ? "POST" : "DELETE",
        }).then((r) => {
            if (r.ok) {
                if (add) {
                    props.post.likes += 1;
                    user_ctx?.likes.set(props.post.id, props.post);
                } else {
                    props.post.likes -= 1;
                    user_ctx?.likes.delete(props.post.id);
                }
                let like_el = document.getElementById(`${props.post.id}-like`);
                if (like_el) {
                    like_el.innerText = props.post.likes.toString();
                }
            }
        })
    }

    const navigate = useNavigate();

    let date = new Date(props.post.created_at * 1000).toDateString()
    return (
        <div class="border-b border-b-zinc-600 w-full">
            { (props.post.parent_id != "000000000000000000000000" && !props.post.repost) && <span class="mt-4 px-6">Replying to <Link href={`/users/${parentAuthor().username}`} class="text-blue-600" >{parentAuthor().username}</Link></span> }
            <div class="flex my-4 w-full">
                <div class="w-32 flex justify-center">
                    <div class="rounded h-16 w-16 bg-white flex items-center justify-center">
                        <span class="text-3xl text-black">{author().name.charAt(0)}</span>
                    </div>
                </div>
                <div class="flex flex-col w-full">
                    <div class="flex items-center" >
                        <Link href={`/users/${author().username}`} >{author().name}</Link>
                        <span class="h-0.5 w-4"></span>
                        <span class="text-zinc-600 text-sm">{date}</span>
                    </div>
                    <span>
                        {props.post.content}
                    </span>
                    { props.post.repost && <PostPreview id={props.post.parent_id}  /> }
                </div>
            </div>
            <div class="flex justify-evenly items-center h-8">
                <button class="flex items-center justify-evenly gap-1" onclick={() => navigate(`/posts/${props.post.id}`)}>
                    <FaRegularMessage size={16} />
                    <span>{props.post.replies}</span>
                </button>
                <button><AiOutlineRetweet size={16} /></button>
                <button class="flex items-center justify-evenly gap-1" onclick={() => ToggleLike(user_ctx?.likes.get(props.post.id) === undefined)}>
                    {user_ctx?.likes.get(props.post.id) !== undefined ? <AiFillLike size={16} color="red" /> : <AiOutlineLike size={16} />}
                    <span id={`${props.post.id}-like`}>{props.post.likes}</span>
                </button>
            </div>
        </div>
    )
}
