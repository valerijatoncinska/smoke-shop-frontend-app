import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Используем useNavigate вместо useHistory
import './CartPage.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface User {
  phoneNumber: string;
  email: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Используем useNavigate

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data);
    };

    const fetchUserData = async () => {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUser(data);
    };

    Promise.all([fetchCartItems(), fetchUserData()]).then(() => setLoading(false));
  }, []);

  const handleIncreaseQuantity = (id: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleDeleteItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToPayment = () => {
    navigate('/payment'); // Используем navigate для перехода
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-page">
      <header className="header">
        {user && (
          <>
            <span>number: {user.phoneNumber}</span>
            <span>email: {user.email}</span>
          </>
        )}
      </header>
      <h1 className="title">Tobacco</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/catalog">Catalog</a>
        <a href="/orders">Orders</a>
        <a href="/profile">My profile</a>
        <a href="/signout">Sign out</a>
        <a href="/basket">Basket</a>
      </div>
      <h2 className="basket-title">Basket</h2>
      <div className="cart-items-container">
        <div className="cart-header">
          <span>Product</span>
          <span>Quantity</span>
          <span>Price</span>
        </div>
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="item-image" />
            <div className="item-details">
              <p>{item.name}</p>
              <p>Price for 1 piece: €{item.price}</p>
            </div>
            <div className="quantity-control">
              <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
            </div>
            <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
              Delete
            </button>
            <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <button className="delete-all-button" onClick={handleClearCart}>Delete all</button>
      </div>
      <div className="cart-summary">
        <p>Intermediate cost: €{totalPrice.toFixed(2)}</p>
        <button onClick={handleProceedToPayment}>Continue to payment</button>
      </div>
      <footer>
        <p>Have a good day!</p>
      </footer>
    </div>
  );
};

export default CartPage;
