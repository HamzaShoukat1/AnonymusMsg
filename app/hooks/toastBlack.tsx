import { toast } from "sonner"

const toastBlack = (title?: string, description?: string) => {
  toast(
    <div style={{ color: "black" }}>
      <strong>{title}</strong>
      <div>{description}</div>
      
    </div>,
    { position: "top-right" }
  )
}
export {toastBlack}