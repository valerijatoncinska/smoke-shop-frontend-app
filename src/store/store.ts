import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './redux/orderSlice';
import productReducer from './redux/productSlice';
import userReducer from './redux/userSlice';
import orderHistoryReducer from './redux/orderHistorySlice';
import addNewProductReducer from './redux/openAddProductFormSlice';
import cartReducer from './redux/cartSlice'; // Обновленный импорт

const store = configureStore({
  reducer: {
    order: orderReducer,
    products: productReducer,
    user: userReducer,
    orderHistory: orderHistoryReducer,
    addNewProduct: addNewProductReducer,
    cart: cartReducer, // Добавляем редьюсер корзины
  },
});

export type RootState = ReturnType<typeof store.getState>; // Определяем RootState
export type AppDispatch = typeof store.dispatch;

export default store;