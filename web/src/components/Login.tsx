import { createSignal, useContext } from "solid-js"
import { PopUpContext } from "../contexts/popupcontext"
import { UserContext } from "../contexts/usercontext"

export default function Login() {
  const user_ctx = useContext(UserContext)
  const popup_ctx = useContext(PopUpContext)

  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")

  function do_login() {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "username": username(),
        "password": password(),
      })
    }).then(res => {
      if (res.ok) {
        user_ctx?.updateUser()
        popup_ctx?.setVisible(false)
      }
    })
  }
  return (
    <div class="flex flex-col w-96 h-full justify-evenly text-black">
      <input type="text" placeholder="Username" class="p-4 bg-cyan-100 h-12 rounded-full" onChange={e => setUsername(e.currentTarget.value)}></input>
      <input type="password" placeholder="password" class="p-4 bg-cyan-100 h-12 rounded-full" onChange={e => setPassword(e.currentTarget.value)}></input>
      <button class="bg-cyan-500 h-12 rounded-full hover:bg-cyan-600" onClick={do_login}>Login</button>
    </div>
  )
}
