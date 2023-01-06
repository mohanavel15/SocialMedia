import { Outlet, useNavigate } from "@solidjs/router";
import { Match, Show, Switch, useContext } from "solid-js";
import Login from "../components/Login";
import Profile from "../components/Profile";
import { PopUpContext } from "../contexts/popupcontext";
import { UserContext } from "../contexts/usercontext";

export default function Home() {
  const navigate = useNavigate()
  const user_ctx = useContext(UserContext)
  const popup_ctx = useContext(PopUpContext)

  return (
    <div class="h-full w-full flex">
      <div class="relative hidden md:block md:w-[20%] xl:w-[30%] h-full">
        <div class="absolute right-0 flex flex-col w-48 h-full">
          <Show when={user_ctx?.isLoggedIn()}>
            <button onclick={() => navigate("/feed")} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded-2xl">Feed</button>
          </Show>
          <button onclick={() => navigate("/global")} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded-2xl">Global</button>
          <Switch>
            <Match when={user_ctx?.isLoggedIn()}>
              <button onclick={() => navigate(`/${user_ctx?.user()?.name}`)} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded-2xl">Profile</button>
              <button class="text-white text-xl hover:bg-green-800 h-12 my-2 px-8 rounded-2xl bg-green-600">Post</button>
              <Profile />
            </Match>
            <Match when={!user_ctx?.isLoggedIn()}>
              <button class="text-white text-xl bg-cyan-500 h-12 my-2 px-8 rounded-2xl items-end" onclick={() => { popup_ctx?.setCompent(<Login />); popup_ctx?.setVisible(true) }}>Login</button>
            </Match>
          </Switch>
        </div>
      </div>
      <div class="w-[100%] md:w-[80%] lg:w-[50%] xl:w-[40%] h-full border-x border-white">
        <Outlet />
      </div>
      <div class="hidden lg:block lg:w-[30%] h-full"></div>
    </div>
  )
}
