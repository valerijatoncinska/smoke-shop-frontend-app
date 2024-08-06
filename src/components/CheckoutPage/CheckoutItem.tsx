
import React from 'react';
import styles from './checkoutItem.module.css';

// Интерфейс CheckoutItemProps должен включать все поля из CartItem
interface CheckoutItemProps {
  id: string;
  title: string;
  stock: number;
  quantity: number;
  productId: string;
  price: number;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ id, title, stock, quantity, productId, price }) => (
  <div className={styles.item}>
    <h3 className={styles.product}>{title}</h3>
    <p className={styles.quantity}>Quantity: {quantity}</p>
    <p className={styles.price}>Price: ${price}</p>
  </div>
);

export default CheckoutItem;