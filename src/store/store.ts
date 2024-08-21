import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './redux/orderSlice';
import productReducer from './redux/productSlice';
import userReducer from './redux/userSlice';
import orderHistoryReducer from './redux/orderHistorySlice';
import addNewProductReducer from './redux/openAddProductFormSlice';
import cartReducer from './redux/cartSlice';
import addressReducer from './redux/addressSlice';
import userSliceForAdminReducer from './redux/userSliceForAdmin';
import adminOrderSliceReducer from './redux/adminOrderSlice';

const store = configureStore({
  reducer: {
    order: orderReducer,
    products: productReducer,
    user: userReducer,
    orderHistory: orderHistoryReducer,
    addNewProduct: addNewProductReducer,
    cart: cartReducer,
    address: addressReducer,
    usersForAdmin: userSliceForAdminReducer,
    adminOrderSlice: adminOrderSliceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;