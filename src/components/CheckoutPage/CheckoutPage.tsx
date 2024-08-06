import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchCartItems } from '../../store/redux/cartSlice';
import CheckoutItem from './CheckoutItem';
import styles from './CheckoutPage.module.css';

const CheckoutPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const status = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCartItems());
    }
  }, [status, dispatch]);

  const totalCost = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.pageHeader}>Checkout Page</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p className={styles.error}>Error: {error}</p>}
      <ul className={styles.itemList}>
        {items.map((item) => (
          <CheckoutItem
            key={item.id}
            id={item.id}
            title={item.title}
            stock={item.stock}
            quantity={item.quantity}
            productId={item.productId}
            price={item.price}
          />
        ))}
      </ul>
      <div className={styles.totalCost}>Total Cost: ${totalCost.toFixed(2)}</div>
    </div>
  );
};

export default CheckoutPage;