import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: number;
  product: string;
  quantity: number;
  price: number;
  date: Date;
  status?: string;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    removeOrder(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
    updateOrder(state, action: PayloadAction<Order>) {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    }
  },
});

export const { addOrder, removeOrder, updateOrder } = orderSlice.actions;
export default orderSlice.reducer;