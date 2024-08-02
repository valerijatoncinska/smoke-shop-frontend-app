import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(location.state?.order || null);

  useEffect(() => {
    if (!orderDetails) {
      fetch('https://smoke-shop-68y5q.ondigitalocean.app/api/order/latest')
        .then(response => response.json())
        .then(data => setOrderDetails(data))
        .catch(error => console.error('Error:', error));
    }
  }, [orderDetails]);

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div className="order-confirmation-page">
      <h1>Order Confirmation</h1>
      <div className="order-details">
        <p>Order ID: {orderDetails.id}</p>
        <p>Total Price: {orderDetails.totalPrice}€</p>
        <p>Status: {orderDetails.status}</p>
        <ul>
          {orderDetails.items.map((item: any) => (
            <li key={item.id}>{item.name} - {item.quantity} - {item.price}€</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
