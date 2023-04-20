import { createEffect, createSignal } from "solid-js";
import { useStore } from "../contexts/store"
import { User as UserType } from "../models/user";
import { Post as PostType } from "../models/post";
import { useNavigate } from "@solidjs/router";

export default function PostPreview(props: { id: string }) {
    const store = useStore()
    const [post, setPost] = createSignal<PostType>();
    const [user, setUser] = createSignal<UserType>();
    const [date, setDate] = createSignal<string>();

    const navigate = useNavigate();

    createEffect(() => {
        store.getPost(props.id).then(p => {
            setPost(p);
            store.getUserById(p.author_id).then(u => {
                setUser(u)
            })
        });
    })

    createEffect(() => {
        const timestamp = post()?.created_at || 0;
        let date = new Date(timestamp * 1000).toDateString();
        setDate(date);
    })

    return (
        <div class="p-2 border-white border w-11/12 rounded cursor-pointer" onclick={() => navigate(`/posts/${props.id}`)}>
            <div class="flex gap-2 items-center">
                <span class="font-bold">{user()?.name}</span>
                <span class="text-zinc-400">@{user()?.username}</span>
                <span class="text-zinc-600 text-sm">{date()}</span>
            </div>
            <span>{post()?.content}</span>
            <div></div>
        </div>
    )
}
