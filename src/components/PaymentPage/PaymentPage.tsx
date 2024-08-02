import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Send payment details to the backend and get order details in response
    fetch('https://smoke-shop-68y5q.ondigitalocean.app/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardNumber, expiryDate, cvv }),
    })
    .then(response => response.json())
    .then(order => {
      // Redirect to order confirmation page with order details
      navigate('/order-confirmation', { state: { order } });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Card Number:
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Expiry Date:
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            CVV:
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="buttons">
          <button type="submit" className="pay-button">Pay</button>
          <button type="button" className="paypal-button">PayPal</button>
          <button type="button" className="gpay-button">GPay</button>
        </div>
      </form>
    </div>
  );
}

export default PaymentPage;
