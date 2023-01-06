import { FaRegularCircleXmark } from "solid-icons/fa"
import { useContext } from "solid-js"
import { PopUpContext } from "../contexts/popupcontext"


export default function PopUp() {
  const popup_ctx = useContext(PopUpContext)
  return (
    <div class={`absolute bg-white/5 backdrop-blur-sm h-full w-full top-0 ${popup_ctx?.visible() ? "flex" : "hidden"} items-center justify-center`}  onclick={() => popup_ctx?.setVisible(false)}>
        
        <div class="relative h-2/4 w-1/4 bg-white rounded-xl flex items-center justify-center" onclick={e => e.stopPropagation()}>
        <FaRegularCircleXmark class="absolute top-2 right-2 hover:cursor-pointer" color="black" size={24} onclick={() => popup_ctx?.setVisible(false)} />
        {popup_ctx?.component()}
        </div>
    </div>
  )
}
