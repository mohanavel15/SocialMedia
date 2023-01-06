export default function Login() {
  return (
    <div class="flex flex-col w-96 h-full justify-evenly">
      <input type="text" placeholder="Username" class="p-4 bg-cyan-100 h-12 rounded-full"></input>
      <input type="text" placeholder="password" class="p-4 bg-cyan-100 h-12 rounded-full"></input>
      <button class="bg-cyan-500 h-12 rounded-full hover:bg-cyan-600">Login</button>
    </div>
  )
}
