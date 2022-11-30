import { Outlet, Link } from "@solidjs/router";
import { Show, useContext } from "solid-js";
import { UserContext } from "../contexts/usercontext";

export default function Home() {
  const user_ctx = useContext(UserContext)

  return (
    <div class="h-full w-full flex">
      <div class="relative hidden md:block md:w-[20%] xl:w-[30%] h-full">
        <div class="absolute right-0 flex flex-col w-48 h-full">
          <Show when={user_ctx.isLoggedIn()}>
            <Link href="/feed" class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded-2xl">Feed</Link>
          </Show>
          <Link href="/global" class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded-2xl">Global</Link>
          <Show when={user_ctx.isLoggedIn()}>
            <Link href={`/${user_ctx.user()?.name}`} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded-2xl">Profile</Link>
            <button class="text-white text-xl hover:bg-green-800 h-12 my-2 px-8 rounded-2xl bg-green-600">Post</button>
          </Show>
        </div>
      </div>
      <div class="w-[100%] md:w-[80%] lg:w-[50%] xl:w-[40%] h-full border-x border-white">
        <Outlet />
      </div>
      <div class="hidden lg:block lg:w-[30%] h-full"></div>
    </div>
  )
}
