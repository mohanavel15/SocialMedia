import { FaSolidAngleUp } from 'solid-icons/fa'
import { useContext } from 'solid-js'
import { UserContext } from '../contexts/usercontext'

export default function Profile() {
	const user_ctx = useContext(UserContext)
	return (
		<div class="flex hover:bg-zinc-800 justify-evenly items-center p-2 rounded-md hover:cursor-pointer">
			<img class="h-12 w-12 rounded-full" src="/src/assets/empty.png" />
			<div class="flex flex-col">
				<span class="text-lg">{user_ctx?.user()?.name}</span>
				<span class="text-sm">@{user_ctx?.user()?.username}</span>
			</div>
			<FaSolidAngleUp />
		</div>
	)
}
