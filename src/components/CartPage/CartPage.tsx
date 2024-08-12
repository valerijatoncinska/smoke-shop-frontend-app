import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addItemToCart, updateCartItem, removeItemFromCart, clearCart, fetchCartItems, fetchAddresses, selectAddresses, CartItem } from '../../store/redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const addresses = useSelector(selectAddresses);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // useEffect используется для загрузки данных корзины и адресов при загрузке компонента
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchCartItems());
            await dispatch(fetchAddresses());
            setLoading(false);
        };
        fetchData();
    }, [dispatch]);

    // Логика для перехода к оплате с учетом выбранного адреса
    const handleProceedToPayment = () => {
        navigate('/payment');
    };
    const handleAddItemToCart = (item: CartItem) => {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            // Если товар уже есть в корзине, обновляем его количество и общую стоимость
            dispatch(updateCartItem({ 
                ...existingItem, 
                quantity: existingItem.quantity + 1, 
                totalPrice: (existingItem.quantity + 1) * existingItem.price 
            }));
        } else {
            // Если товара нет в корзине, добавляем его со всеми необходимыми полями
            dispatch(addItemToCart({ 
                ...item, 
                quantity: 1, 
                totalPrice: item.price, 
                title: item.title || 'Unknown Title', // title обязательное поле
                stock: item.stock || 0,               // stock обязательное поле
                productId: item.productId || 'Unknown Product ID' // productId обязательное поле
            }));
        }
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
                        {/* Используем handleAddItemToCart для обработки нажатия на "+" */}
                        <button onClick={() => handleAddItemToCart(item)}>+</button>
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