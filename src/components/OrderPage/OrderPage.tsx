import React from 'react';
import OrderItem from './OrderItem';

const OrderPage: React.FC = () => {
  const orders = [
    { id: 1, product: 'Product A', quantity: 2, price: 30 },
    { id: 2, product: 'Product B', quantity: 1, price: 20 },
  ];

  return (
    <div>
      <h1>Order Page</h1>
      {orders.map(order => (
        <OrderItem key={order.id} {...order} />
      ))}
    </div>
  );
};

export default OrderPage;
