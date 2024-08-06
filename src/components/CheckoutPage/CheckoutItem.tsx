import React from 'react';
import styles from './CheckoutItem.module.css';

interface CheckoutItemProps {
  id: string;
  title: string;
  stock: number;
  quantity: number;
  productId: string;
  price: number;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({
  id,
  title,
  stock,
  quantity,
  productId,
  price,
}) => (
  <div className={styles.item}>
    <h3 className={styles.product}>{title}</h3>
    <p className={styles.id}>ID: {id}</p>
    <p className={styles.stock}>Stock: {stock}</p>
    <p className={styles.quantity}>Quantity: {quantity}</p>
    <p className={styles.productId}>Product ID: {productId}</p>
    <p className={styles.price}>Price: ${price}</p>
  </div>
);

export default CheckoutItem;