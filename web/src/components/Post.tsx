import { Post as PostType } from "../models/post";
import { AiOutlineLike, AiOutlineRetweet } from "solid-icons/ai";
import { FaRegularMessage } from "solid-icons/fa";

export default function Post(props: {post: PostType}) {
    let date = new Date(props.post.created_at * 1000).toDateString()
  return (
    <div class="border-b border-b-zinc-600 w-full">
        <div class="flex my-4 w-full">
            <div class="w-32 flex justify-center">
                <img src="/src/assets/empty.png" class="rounded-full h-16 w-16" />
            </div>
            <div class="flex flex-col w-full">
                <div class="flex items-center" >
                    <span>{props.post.author_id}</span>
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
            <button class="flex justify-evenly">
                <AiOutlineLike size={16} /> 
                {props.post.likes}
            </button>
        </div>
    </div>
  )
}
