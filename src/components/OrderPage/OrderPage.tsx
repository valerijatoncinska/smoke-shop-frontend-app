import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './OrderPage.module.css';
import { fetchOrderDetails } from '../../store/redux/orderHistorySlice';

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const orderDetails = useSelector((state: RootState) => state.orderHistory.orderDetails);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(parseInt(orderId)));
    }
  }, [dispatch, orderId]);

  const handleComeBack = () => {
    navigate("/order-history");
  };

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <img
        src="/img/unsplash_PzXqG8f2rrE.jpg"
        alt="Main Background"
        className={styles.backgroundImage}
      />
      <div className={styles.detailsContainer}>
        <button
          type="button"
          className={styles.comeBack}
          onClick={handleComeBack}
        >
          Come back
        </button>
        <h1 className={styles.pageHeader}>Order #{orderDetails.data.id}</h1>
        <div className={styles.orderInfo}>
          <p className={styles.date}>Date: {new Date(orderDetails.data.date).toLocaleDateString()}</p>
          <p className={styles.total}>Total Price: ${orderDetails.data.total.toFixed(2)}</p>
        </div>
        <div className={styles.cartItemsContainer}>
          <ul className={styles.productsList}>
            {orderDetails.products.map(product => (
              <li key={product.id} className={styles.productItem}>
                <img
                  src={product.imgUrl}
                  alt={product.title}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <span className={styles.productTitle}>{product.title}</span>
                  <span className={styles.productQuantity}>Quantity: {product.quantity}</span>
                  <span className={styles.productPrice}>Price: ${product.price.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

// const OrderPage: React.FC = () => {
//   const { orderId } = useParams<{ orderId: string }>();
//   const dispatch = useAppDispatch();
//   const orderDetails = useSelector((state: RootState) => state.orderHistory.orderDetails);

//   useEffect(() => {
//       if (orderId) {
//           dispatch(fetchOrderDetails(parseInt(orderId)));
//       }
//   }, [dispatch, orderId]);

//   if (!orderDetails) {
//       return <p>Loading...</p>;
//   }

//   return (
//       <div className={styles.detailsContainer}>
//           <h1>Order #{orderDetails.data.id}</h1>
//           <p>Date: {new Date(orderDetails.data.date).toLocaleDateString()}</p>
//           <p>Total Price: ${orderDetails.data.total}</p>
//           <h2>Products</h2>
//           <ul className={styles.productsList}>
//               {orderDetails.products.map(product => (
//                   <li key={product.id} className={styles.productItem}>
//                       <h3>{product.title}</h3>
//                       <p>Quantity: {product.quantity}</p>
//                       <p>Price: ${product.price}</p>
//                       <p>Total: ${product.total}</p>
//                   </li>
//               ))}
//           </ul>
//       </div>
//   );
// };

// export default OrderPage;

// const OrderPage: React.FC = () => {
//   const orders = [
//     { id: 1, product: 'Product A', quantity: 2, price: 30 },
//     { id: 2, product: 'Product B', quantity: 1, price: 20 },
//   ];

//   return (
//     <div>
//       <h1>Order Page</h1>
//       {orders.map(order => (
//         <OrderItem key={order.id} {...order} />
//       ))}
//     </div>
//   );
// };

// export default OrderPage;
