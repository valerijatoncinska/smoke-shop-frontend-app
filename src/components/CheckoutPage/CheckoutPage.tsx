import React from 'react';
import CheckoutItem from './CheckoutItem';

const CheckoutPage: React.FC = () => {
  const items = [
    { id: 1, product: 'Product A', quantity: 2, price: 30 },
    { id: 2, product: 'Product B', quantity: 1, price: 20 },
  ];

  return (
    <div>
      <h1>Checkout Page</h1>
      {items.map(item => (
        <CheckoutItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default CheckoutPage;
