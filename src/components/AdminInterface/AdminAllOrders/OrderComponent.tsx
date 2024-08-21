import { useEffect, type FC } from "react"
import { AdminOrder } from "../../../store/redux/adminOrderSlice"
import "./OrderComponent.css"
import { AppDispatch, RootState } from "store/store"
import { useDispatch, useSelector } from "react-redux"
import { fetchAdminUsers } from "../../../store/redux/userSliceForAdmin"

interface IProps {
  order: AdminOrder
}

const OrderComponent: FC<IProps> = ({ order: { date, total, userId } }) => {
  const dispatch: AppDispatch = useDispatch()
  const { users } = useSelector((state: RootState) => state.usersForAdmin)
  const status = useSelector((state: RootState) => state.usersForAdmin.status)

  console.log(date)

  useEffect(() => {
    dispatch(fetchAdminUsers())
  }, [])

  const filteredUser = users.filter(user => user.id === userId)[0]
  console.log(filteredUser)

  return (
    <>
      {status === "loading" && (
        <div className="text-center">
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {status === "success" && (
        <div className="d-flex">
          <p className="email mx-0">{filteredUser.email}</p>
          <p className="date mx-0">{new Date(date).toLocaleDateString()}</p>
          <p className="quantity mx-0">1</p>
          <p className="total mx-0">{total} €</p>
        </div>
      )}
      {status === "error" && <>Error!</>}
    </>
  )
}

export default OrderComponent
