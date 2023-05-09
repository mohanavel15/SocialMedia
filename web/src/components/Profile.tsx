import { FiLogOut } from 'solid-icons/fi'
import { useContext } from 'solid-js'
import { UserContext } from '../contexts/usercontext'
import { default_avatar } from '../utils/default_avatar'

export default function Profile() {
	const user_ctx = useContext(UserContext)
	function logout() {
		fetch("/api/logout", { method: "POST" }).then(r => { if(r.ok) user_ctx?.updateUser() })
	}
	return (
		<div class="flex justify-evenly items-center p-2 rounded-md hover:cursor-pointer">
			<img src={user_ctx?.user()?.id || ""} class="rounded h-12 w-12 bg-white" onError={async (e) => { e.currentTarget.src = await default_avatar(user_ctx?.user()?.id || "") } } />
			<div class="flex flex-col">
				<span class="text-lg">{user_ctx?.user()?.name}</span>
				<span class="text-sm">@{user_ctx?.user()?.username}</span>
			</div>
			<FiLogOut size={32} class="p-2 rounded hover:bg-red-400" color='red' onclick={logout} />
		</div>
	)
}
