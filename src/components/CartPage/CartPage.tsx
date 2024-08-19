import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import {
  addItemToCart,
  updateCartItem,
  clearCart,
  fetchCartItems,
  fetchAddresses,
  selectAddresses,
  CartItem,
  deleteCartItem,
  clearCartReducer,
} from "../../store/redux/cartSlice"
import { useNavigate } from "react-router-dom"
import "./CartPage.css"
import { tobaccoImages } from "../../constans/tobaccoImg";

const CartPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const addresses = useSelector(selectAddresses)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // useEffect используется для загрузки данных корзины и адресов при загрузке компонента
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCartItems())
      await dispatch(fetchAddresses())
      setLoading(false)
    }
    fetchData()
  }, [dispatch])

  // Логика для перехода к оплате с учетом выбранного адреса
  const handleProceedToPayment = () => {
    navigate("/payment")
  }
  const handleAddItemToCart = (item: CartItem) => {
    dispatch(updateCartItem({ type: "plus", id: item.id }))

    /* const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
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
            })); */
    // }
  }

  const handleRemoveOneItemFromCart = (item: CartItem) => {
    dispatch(updateCartItem({ type: "minus", id: item.id }))
  }
  if (loading) {
    return <div>Loading...</div>
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    dispatch(clearCartReducer())
  }

  const handleGoHome = () => {
    navigate("/")
  }


  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1 className="title">Your Cart</h1>
        <button
            type="button"
            className="goHomeButton"
            onClick={handleGoHome}
          >
            Go to Home
          </button>
      </header>
      <div className="cart-items-container">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            {/* Контейнер для изображения товара */}
            <div className="item-image-container">
              <div className="item-image"></div>
            </div>
            {/* Детали товара */}
            <div className="item-details">
              <span className="item-title">{item.title}</span>
              <span className="item-price">${item.totalPrice.toFixed(2)}</span>
            </div>
            {/* Контроллер количества товара */}
            <div className="quantity-control">
              <button onClick={() => handleRemoveOneItemFromCart(item)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => handleAddItemToCart(item)}>+</button>
            </div>
            {/* Кнопка удаления товара из корзины */}
            <button
              onClick={() => dispatch(deleteCartItem(item.id))}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
        {/* Кнопка для очистки корзины */}
        <button onClick={handleClearCart} className="clear-cart-button">
          Clear Cart
        </button>
      </div>
      <footer className="cart-footer">
        {/* Отображение общей суммы корзины */}
        <span>
          Total Price: $
          {cartItems
            .reduce((total, item) => total + item.totalPrice, 0)
            .toFixed(2)}
        </span>
        {/* Кнопка для перехода к оплате */}
        <button
          onClick={handleProceedToPayment}
          className="proceed-to-payment-button"
        >
          Proceed to Payment
        </button>
      </footer>
    </div>
  )
}

export default CartPage
