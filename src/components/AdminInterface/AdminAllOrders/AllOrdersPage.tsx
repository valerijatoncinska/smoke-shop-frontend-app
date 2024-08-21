import { useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./AllOrdersPage.css"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store/store"
import OrderComponent from "./OrderComponent"
import { fetchAdminOrders } from "../../../store/redux/adminOrderSlice"

const AllOrdersPage = () => {
  const dispatch: AppDispatch = useDispatch()
  const { adminOrders } = useSelector(
    (state: RootState) => state.adminOrderSlice,
  )
  const status = useSelector((state: RootState) => state.adminOrderSlice.status)

  useEffect(() => {
    window.scrollTo(0, 0)
  })

  useEffect(() => {
    dispatch(fetchAdminOrders())
    
  }, [])

  // const totalQuantity = adminOrders.reduce((sum, order) => sum + order.quantity, 0)
  const totalCost = adminOrders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="order-table-container p-5">
      <div className="tableContainer">
        <h2 className="text-center mb-5">View orders</h2>
        <table className="table">
          <div className="text d-flex justify-content-between mb-4">
            <h5>User Email</h5>
            <h5>Date</h5>
            <h5>Total quantity</h5>
            <h5>Total cost</h5>
          </div>

          <div className="data">
            {status === "loading" && (
              <div className="text-center">
                <div className="spinner-border text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {status === "success" &&
              adminOrders.map(order => (
                <OrderComponent key={order.id} order={order} />
              ))}

            {status === "error" && <>Error!</>}
          </div>
        </table>
        <div className="order-summary">
          <p>
            Total quantity: <span className="ms-4">{adminOrders.length}</span>
          </p>
          <p>
            Total cost: <span className="ms-4">{totalCost} €</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AllOrdersPage
