import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./AllOrdersPage.css"
import { useSelector } from "react-redux"
import { RootState } from "store/store"
import OrderComponent from "./OrderComponent"

const AllOrdersPage = () => {
  // const orders = [
  //   {
  //     id: 1,
  //     product: "First Order",
  //     date: new Date(),
  //     status: "OK",
  //     quantity: 20,
  //     price: 200,
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },
  //   {
  //     id: 1,
  //     product: "First Order",
  //     quantity: 20,
  //     price: 200,
  //     date: new Date(),
  //     status: "OK",
  //   },

  //   // Add more orders as needed
  // ]

  const { orders } = useSelector((state: RootState) => state.order)

  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0)
  const totalCost = orders.reduce(
    (sum, order) => sum + order.quantity * order.price,
    0,
  )

  return (
    <div className="order-table-container p-5">
      <div className="tableContainer">
        <h2 className="text-center mb-5">View orders</h2>
        <table className="table">
          <div className="d-flex justify-content-between mb-4">
            <h5>Product name</h5>
            <h5>Date</h5>
            <h5>Order status</h5>
            <h5>Price</h5>
            <h5>Total quantity</h5>
            <h5>Total cost</h5>
          </div>
          <div className="data">
            {orders.map(order => (
              <OrderComponent key={order.id} order={order} />
            ))}
          </div>
        </table>
        <div className="order-summary">
          <p>
            Total quantity: <span>{totalQuantity}</span>
          </p>
          <p>
            Total cost: <span>{totalCost} €</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AllOrdersPage
