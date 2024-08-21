import { NavLink } from "react-router-dom"
import "./Navigation.css"
import axios from "axios"
import { AppDispatch } from "store/store"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../../store/redux/userSlice"

const Navigation = () => {

  const dispatch: AppDispatch = useDispatch()
  return (
    <nav className="vertical-navbar">
      <h4 className="text-center mt-4">Hello, Admin :)</h4>
      <ul className="nav flex-column mt-5">
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin">
            Account Admin
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/catalog">
            Catalog Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/archivated-products">
            Archived Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/view-orders">
            View Orders
          </NavLink>
        </li>
      </ul>
      <NavLink to="/auth/login">
        <button
          onClick={() => {axios.get("/api/author/logout")
            dispatch(logoutUser())
          }}
          className="button ms-3"
        >
          Sign out
        </button>
      </NavLink>
    </nav>
  )
}

export default Navigation
