import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addItemToCart, updateCartItem, removeItemFromCart, clearCart, fetchCartItems, fetchAddresses, selectAddresses } from '../../store/redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const addresses = useSelector(selectAddresses);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchCartItems());
            await dispatch(fetchAddresses());
            setLoading(false);
        };
        fetchData();
    }, [dispatch]);

    const handleProceedToPayment = () => {
        // Логика для перехода к оплате с учетом выбранного адреса
        navigate('/payment');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="cart-page">
            <header className="cart-header">
                <h1 className="title">Your Cart</h1>
            </header>
            <div className="cart-items-container">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <span>{item.title}</span>
                        <span>{item.quantity}</span>
                        <span>{item.totalPrice}</span>
                        <button onClick={() => dispatch(updateCartItem({ ...item, quantity: item.quantity + 1 }))}>+</button>
                        <button onClick={() => dispatch(updateCartItem({ ...item, quantity: item.quantity - 1 }))}>-</button>
                        <button onClick={() => dispatch(removeItemFromCart(item.id))}>Delete</button>
                    </div>
                ))}
            </div>
            <footer className="cart-footer">
                <span>Total Price: {cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)}</span>
                <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
                <button onClick={handleProceedToPayment}>Proceed to Payment</button>
            </footer>
        </div>
    );
};

export default CartPage;