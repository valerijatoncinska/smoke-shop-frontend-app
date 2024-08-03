import React from 'react';
import styles from './CheckoutItem.module.css';

interface CheckoutItemProps {
    product: string;
    quantity: number;
    price: number;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ product, quantity, price }) => (
    <div className={styles.item}>
        <h3 className={styles.product}>{product}</h3>
        <p className={styles.quantity}>Quantity: {quantity}</p>
        <p className={styles.price}>Price: ${price}</p>
    </div>
);

export default CheckoutItem;