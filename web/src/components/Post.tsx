import { Post as PostType } from "../models/post";
import { AiOutlineLike, AiOutlineRetweet } from "solid-icons/ai";
import { FaRegularMessage } from "solid-icons/fa";
import { useStore } from "../contexts/store";
import { User } from "../models/user";
import { useContext } from "solid-js";
import { UserContext } from "../contexts/usercontext";
import { Link } from "@solidjs/router";

export default function Post(props: { post: PostType }) {
    const store = useStore();
    let author = {} as User
    const user_ctx = useContext(UserContext)
    if (user_ctx?.user()?.id === props.post.author_id) {
        author = user_ctx?.user()!;
    } else {
        let user = store.users.get(props.post.author_id);
        if (user === undefined) {
            fetch("/api/users-id/"+props.post.author_id).then(res => {
                if (res.ok) {
                  res.json().then((user: User) => { author = user; store.users.set(user.id, user); store.users.set(user.username, user) });
                }
            })
        } else {
            author = user
        }
    }


    let date = new Date(props.post.created_at * 1000).toDateString()
    return (
        <div class="border-b border-b-zinc-600 w-full">
            <div class="flex my-4 w-full">
                <div class="w-32 flex justify-center">
                    <img src="/src/assets/empty.png" class="rounded h-16 w-16" />
                </div>
                <div class="flex flex-col w-full">
                    <div class="flex items-center" >
                        <Link href={`/users/${author.name}`} >{author.name}</Link>
                        <span class="h-0.5 w-4"></span>
                        <span class="text-zinc-600 text-sm">{date}</span>
                    </div>
                    <span>
                        {props.post.content}
                    </span>
                </div>
            </div>
            <div class="flex justify-evenly items-center h-8">
                <button><FaRegularMessage size={16} /></button>
                <button><AiOutlineRetweet size={16} /></button>
                <button class="flex items-center justify-evenly">
                    <AiOutlineLike size={16} />
                    {props.post.likes}
                </button>
            </div>
        </div>
    )
}
