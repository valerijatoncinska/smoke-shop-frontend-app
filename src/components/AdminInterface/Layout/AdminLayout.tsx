import { Outlet } from "react-router-dom"
import Navigation from "../Navigation/Navigation"

const AdminLayout = () => {
  return (
    <div>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout;
