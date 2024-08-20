import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useAppDispatch } from "../../app/hook"
import { fetchOrders } from "../../store/redux/orderHistorySlice"
import styles from "./OrderHistoryPage.module.css"
import { useNavigate } from "react-router-dom"

interface Order {
  id: number
  date: string
  total: number
}

const OrderHistoryPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const orderHistory = useSelector((state: RootState) => state.orderHistory.history);
    const navigate = useNavigate();
  
    useEffect(() => {
      dispatch(fetchOrders());
    }, [dispatch]);
  
    const handleViewDetails = (orderId: number) => {
      navigate(`/orders/${orderId}`);
    };
  
    const handleGoHome = () => {
      navigate("/");
    };
  
    return (
      <div className={styles.container}>
        <img
          src="/img/unsplash_PzXqG8f2rrE.jpg"
          alt="Main Background"
          className={styles.backgroundImage}
        />
        <div className={styles.historyContainer}>
          <button
            type="button"
            className={styles.goHomeButton}
            onClick={handleGoHome}
          >
            Go to Home
          </button>
          <h1 className={styles.pageHeader}>History of Orders</h1>
          {orderHistory.length > 0 ? (
            <ul className={styles.historyList}>
              {orderHistory.map(order => (
                <li key={order.id} className={styles.historyItem}>
                  <h3>Order #{order.id}</h3>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Total Price: ${order.total.toFixed(2)}</p>
                  <button
                    className={styles.viewDetailsButton}
                    onClick={() => handleViewDetails(order.id)}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default OrderHistoryPage;

// export default OrderHistoryPage;

// const OrderHistoryPage: React.FC = () => {
//     const orderHistory = useSelector((state: RootState) => state.orderHistory.history);

//     return (
//         <div className={styles.historyContainer}>
//             <h1 className={styles.pageHeader}>Order History</h1>
//             {orderHistory.length > 0 ? (
//                 <ul className={styles.historyList}>
//                     {orderHistory.map((order, index) => (
//                         <li key={index} className={styles.historyItem}>
//                             <h3>{order.productName}</h3>
//                             <p>Quantity: {order.quantity}</p>
//                             <p>Total Price: ${order.totalPrice}</p>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No orders found.</p>
//             )}
//         </div>
//     );
// };

// export default OrderHistoryPage;
