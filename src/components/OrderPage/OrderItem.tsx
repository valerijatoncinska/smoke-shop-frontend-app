import React from 'react';

interface OrderItemProps {
  product: string;
  quantity: number;
  price: number;
}

const OrderItem: React.FC<OrderItemProps> = ({ product, quantity, price }) => (
  <div>
    <h3>{product}</h3>
    <p>Quantity: {quantity}</p>
    <p>Price: ${price}</p>
  </div>
);

export default OrderItem;
