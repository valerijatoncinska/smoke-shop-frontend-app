import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./PaymentPage.css"
import axios from "axios"

const PaymentPage: React.FC = () => {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Send payment details to the backend and get order details in response
    /* fetch('/api/checkout', {
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
    }); */

    try {
      // Получаем адрес пользователя
      const response = await axios.get("/api/address").then(response => {console.log(response.data)
        return response
      }
      )
      const addressData = response.data[0]

      // После того как состояние userAddress обновится, можно использовать его
      if (addressData && addressData.id) {
        const data = {
          payments: "paypal",
          deliveryAddress: addressData.id, // Используем значение id из ответа
          billingAddress: addressData.id,
        }
        console.log(data);
        

        await axios
          .post("/api/cart/order", data)
          .then(response => console.log(response.data))
          .catch(error => console.log(error))
        // Переход на страницу подтверждения заказа
        navigate("/order-history")
      }
    } catch (error) {
      console.log("Error:", error)
    }
  }

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
              onChange={e => setCardNumber(e.target.value)}
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
              onChange={e => setExpiryDate(e.target.value)}
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
              onChange={e => setCvv(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="buttons mt-4 d-flex justify-content-center">
          {/* <button type="submit" className="pay-button" onClick={() => navigate("/order-history")}>Pay</button> */}
          <button type="submit" className="paypal-button">
            PayPal
          </button>
          {/* <button type="button" className="gpay-button">GPay</button> */}
        </div>
      </form>
    </div>
  )
}

export default PaymentPage
