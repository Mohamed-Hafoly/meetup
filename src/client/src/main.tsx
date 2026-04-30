
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "react-loading-skeleton/dist/skeleton.css"
import "./styles/main.scss"

const rootElement = document.getElementById("root")

const { default: App } = await import("./App")

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
