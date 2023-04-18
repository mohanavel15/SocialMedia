import { createSignal } from "solid-js";
import { useUserContext } from "../contexts/usercontext"

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
                    <div class="rounded h-12 w-12 bg-white flex items-center justify-center">
                        <span class="text-xl text-black">{user_ctx?.user()?.name.charAt(0)}</span>
                    </div>
                </div>
                <div class="flex flex-col w-full justify-evenly items-end">
                    <textarea class="w-full bg-zinc-900 h-16 rounded p-2" onchange={(e) => setContent(e.target.value)} value={content()} />
                    <button class="border-2 px-2 rounded mt-2 hover:bg-white hover:text-black" onclick={post}>Post</button>
                </div>
            </div>
        </div>
    )
}
