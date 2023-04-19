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

    const getPost = (post_id: string) => {
        let post = store.posts.get(post_id);

        if (post !== undefined) {
            setPost(post);
            getUser(post.author_id);
        } else {
            fetch("/api/posts/" + post_id).then(res => {
                if (res.ok) {
                    res.json().then((p: PostType) => {
                        setPost(p);
                        store.posts.set(p.id, p);
                        getUser(p.author_id);
                    });
                }
            })
        }
    }

    async function getUser(user_id: string) {
        let user = store.users.get(user_id);
        if (user === undefined) {
            let res = await fetch("/api/users-id/" + user_id)
            if (res.ok) {
                let user: UserType = await res.json();
                setUser(user);
                store.users.set(user.id, user);
                store.users.set(user.username, user);
            }
        } else {
            setUser(user)
        }
    }

    createEffect(() => {
        getPost(props.id)
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
