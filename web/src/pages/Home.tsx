import { Outlet } from "@solidjs/router";

export default function Home() {
  return (
    <div class="h-full w-full flex">
      <div class="hidden md:block md:w-[20%] xl:w-[30%] h-full"></div>
      <div class="w-[100%] md:w-[80%] lg:w-[50%] xl:w-[40%] h-full border-x border-white">
        <Outlet />
      </div>
      <div class="hidden lg:block lg:w-[30%] h-full"></div>
    </div>
  )
}
