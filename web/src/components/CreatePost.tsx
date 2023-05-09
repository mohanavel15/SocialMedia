import { createSignal } from "solid-js";
import { useUserContext } from "../contexts/usercontext"
import { default_avatar } from "../utils/default_avatar";

export default function CreatePost({ parent_id }: { parent_id: string }) {
    const user_ctx = useUserContext();
    const [content, setContent] = createSignal("");

    function post() {
        fetch(`/api/users/${user_ctx?.user()?.username || ""}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "parent_id": parent_id,
                "content": content(),
                "repost": false,
            })
        }).then(r => {
            if (r.ok) setContent("")
        })
    }

    return (
        <div class="border-b border-b-zinc-600 w-full p-6">
            <div class="flex w-full">
                <div class="w-32 flex justify-center">
			        <img src={user_ctx?.user()?.id || ""} class="rounded h-12 w-12 bg-white" onError={async (e) => { e.currentTarget.src = await default_avatar(user_ctx?.user()?.id || "") } } />
                </div>
                <div class="flex flex-col w-full justify-evenly items-end">
                    <textarea class="w-full bg-zinc-900 h-16 rounded p-2" onchange={(e) => setContent(e.target.value)} value={content()} />
                    <button class="border-2 px-2 rounded mt-2 hover:bg-white hover:text-black" onclick={post}>Post</button>
                </div>
            </div>
        </div>
    )
}
