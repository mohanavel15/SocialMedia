import { FiLogOut } from 'solid-icons/fi'
import { useContext } from 'solid-js'
import { UserContext } from '../contexts/usercontext'

export default function Profile() {
	const user_ctx = useContext(UserContext)
	function logout() {
		fetch("/api/logout", { method: "POST" }).then(r => { if(r.ok) user_ctx?.updateUser() })
	}
	return (
		<div class="flex justify-evenly items-center p-2 rounded-md hover:cursor-pointer">
			<div class="rounded h-12 w-12 bg-white flex items-center justify-center">
				<span class="text-2xl text-black">{user_ctx?.user()?.name.charAt(0)}</span>
			</div>
			<div class="flex flex-col">
				<span class="text-lg">{user_ctx?.user()?.name}</span>
				<span class="text-sm">@{user_ctx?.user()?.username}</span>
			</div>
			<FiLogOut size={32} class="p-2 rounded hover:bg-red-400" color='red' onclick={logout} />
		</div>
	)
}
