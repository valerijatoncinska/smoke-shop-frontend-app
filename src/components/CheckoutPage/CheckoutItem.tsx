import React from 'react';

interface CheckoutItemProps {
  product: string;
  quantity: number;
  price: number;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ product, quantity, price }) => (
  <div>
    <h3>{product}</h3>
    <p>Quantity: {quantity}</p>
    <p>Price: ${price}</p>
  </div>
);

export default CheckoutItem;
