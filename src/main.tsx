import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import "./index.css"
import { HashRouter } from "react-router-dom"
import store from "./store/store"
import "bootstrap/dist/css/bootstrap.min.css"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
