import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addItemToCart, updateCartItem, removeItemFromCart, clearCart, fetchCartItems, CartItem } from '../../store/redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartData = async () => {
            const resultAction = await dispatch(fetchCartItems());
            if (fetchCartItems.rejected.match(resultAction)) {
                console.error('Failed to load cart items:', resultAction.payload);
            }
            setLoading(false);
        };

        fetchCartData();
    }, [dispatch]);

    const handleIncreaseQuantity = (id: string) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            const updatedItem = { ...item, quantity: item.quantity + 1 };
            dispatch(updateCartItem(updatedItem));
        }
    };

    const handleDecreaseQuantity = (id: string) => {
        const item = cartItems.find(item => item.id === id);
        if (item && item.quantity > 1) {
            const updatedItem = { ...item, quantity: item.quantity - 1 };
            dispatch(updateCartItem(updatedItem));
        }
    };

    const handleDeleteItem = (id: string) => {
        dispatch(removeItemFromCart(id));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleProceedToPayment = () => {
        navigate('/payment');
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="cart-page">
            <header className="cart-header">
                <h1 className="title">Your Cart</h1>
            </header>
            <div className="cart-items-container">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <span>{item.title}</span>
                        <span>{item.quantity}</span>
                        <span>{item.price}</span>
                        <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                        <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <footer className="cart-footer">
                <span>Total Price: ${totalPrice.toFixed(2)}</span>
                <button onClick={handleClearCart}>Clear Cart</button>
                <button onClick={handleProceedToPayment}>Proceed to Payment</button>
            </footer>
        </div>
    );
};

export default CartPage;