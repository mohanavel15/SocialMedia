import { useNavigate } from "@solidjs/router";
import { Match, Show, Switch, useContext } from "solid-js";

import Login from "../components/Login";
import Profile from "../components/Profile";
import { PopUpContext } from "../contexts/popupcontext";
import { UserContext } from "../contexts/usercontext";

export default function LeftSideBar() {
    const navigate = useNavigate()
    const user_ctx = useContext(UserContext)
    const popup_ctx = useContext(PopUpContext)
    return (
        <div class="relative flex-col hidden md:flex md:w-[20%] xl:w-[30%] h-full">
            <div class="absolute top-0 right-0 flex flex-col w-48 h-1/2 mx-3">
                <Show when={user_ctx?.isLoggedIn()}>
                    <button onclick={() => navigate("/feed")} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded">Feed</button>
                </Show>
                <button onclick={() => navigate("/global")} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded">Global</button>
                <Show when={user_ctx?.isLoggedIn()}>
                    <button onclick={() => navigate(`/users/${user_ctx?.user()?.name}`)} class="text-white text-xl hover:bg-zinc-800 h-12 my-2 px-8 rounded">Profile</button>
                    <button class="text-white bg-black hover:bg-white hover:text-black border-2 text-xl h-12 my-2 px-8 rounded">Post</button>
                </Show>
            </div>
            <div class="absolute bottom-0 right-0 flex flex-col w-48 h-1/2 justify-end mx-3">
                <Switch>
                    <Match when={user_ctx?.isLoggedIn()}>
                        <Profile />
                    </Match>
                    <Match when={!user_ctx?.isLoggedIn()}>
                        <button class="text-white text-xl bg-black hover:bg-white hover:text-black border-2 h-12 my-2 px-8 rounded items-end" onclick={() => { popup_ctx?.setCompent(Login); popup_ctx?.setVisible(true) }}>Login</button>
                    </Match>
                </Switch>
            </div>
        </div>
    )
}
