import { createSignal } from "solid-js"
import { usePopUp } from "../contexts/popupcontext"
import { useUserContext } from "../contexts/usercontext"

export default function Login() {
  const user_ctx = useUserContext()
  const popup_ctx = usePopUp();

  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")

  async function do_login() {
    let res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "username": username(),
        "password": password(),
      })
    })
    if (res.ok) {
      user_ctx?.updateUser();
      popup_ctx?.setVisible(false);
      popup_ctx?.setCompent(undefined);
    }
  }

  return (
    <div class="flex flex-col w-96 h-full justify-evenly text-black">
      <input type="text" placeholder="Username" class="p-4 bg-blue-100 h-12 rounded-full" onChange={e => setUsername(e.currentTarget.value)}></input>
      <input type="password" placeholder="password" class="p-4 bg-blue-100 h-12 rounded-full" onChange={e => setPassword(e.currentTarget.value)}></input>
      <button class="bg-blue-600 h-12 rounded-full hover:bg-blue-700" onClick={do_login}>Login</button>
    </div>
  )
}
