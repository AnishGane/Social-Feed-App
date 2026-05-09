import { RouterProvider } from "react-router-dom"
import { router } from "./routes/app-route"

const App = () => {
  return <RouterProvider router={router} />
}

export default App