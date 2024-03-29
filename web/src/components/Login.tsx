import { createSignal } from "solid-js"
import { usePopUp } from "../contexts/popupcontext"
import { useUserContext } from "../contexts/usercontext"

export default function Login() {
  const user_ctx = useUserContext()
  const popup_ctx = usePopUp();

  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")

  async function do_login_or_register(register: boolean) {
    let res = await fetch(`/api/${register ? 'register' : 'login' }`, {
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
      setUsername("");
      setPassword("");
      if (!register) {
        user_ctx?.updateUser();
        popup_ctx?.setVisible(false);
        popup_ctx?.setCompent(undefined);
      }
    }
  }

  return (
    <div class="flex flex-col w-96 h-full justify-evenly text-black">
      <input type="text" placeholder="Username" class="p-4 bg-zinc-100 h-12 rounded" value={username()} onChange={e => setUsername(e.currentTarget.value)}></input>
      <input type="password" placeholder="password" class="p-4 bg-zinc-100 h-12 rounded" value={password()} onChange={e => setPassword(e.currentTarget.value)}></input>
      <button class="border-2 border-black h-12 rounded hover:bg-black hover:text-white" onClick={() => do_login_or_register(false)}>Login</button>
      <button class="border-2 border-black h-12 rounded hover:bg-black hover:text-white" onClick={() => do_login_or_register(true)}>Register</button>
    </div>
  )
}
