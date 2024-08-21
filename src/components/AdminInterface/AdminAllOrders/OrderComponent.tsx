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

  console.log(date);
  

  useEffect(() => {
    dispatch(fetchAdminUsers())
  }, [])

  const filteredUser = users.filter(user => user.id === userId)[0]
  console.log(filteredUser)

  return (
    <>
      {status === "success" && (
        <div className="d-flex">
          <p>{filteredUser.email}</p>
          <p className="date">{new Date(date).toLocaleDateString()}</p>
          <p className="quantity">1</p>
          <p className="total">{total} €</p>
        </div>
      )}
    </>
  )
}

export default OrderComponent
