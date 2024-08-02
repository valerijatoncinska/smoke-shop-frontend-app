import React from 'react';
import { useSelector } from 'react-redux';
import styles from './OrderHistoryPage.module.css';
import { RootState } from 'store/store';

const OrderHistoryPage: React.FC = () => {
    const orderHistory = useSelector((state: RootState) => state.orderHistory.history);

    return (
        <div className={styles.historyContainer}>
            <h1 className={styles.pageHeader}>Order History</h1>
            {orderHistory.length > 0 ? (
                <ul className={styles.historyList}>
                    {orderHistory.map((order, index) => (
                        <li key={index} className={styles.historyItem}>
                            <h3>{order.productName}</h3>
                            <p>Quantity: {order.quantity}</p>
                            <p>Total Price: ${order.totalPrice}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderHistoryPage;
