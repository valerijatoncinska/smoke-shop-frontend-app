import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
    id: number;
    productName: string;
    quantity: number;
    totalPrice: number;
}

interface OrderHistoryState {
    history: Order[];
}

const initialState: OrderHistoryState = {
    history: []
};

const orderHistorySlice = createSlice({
    name: 'orderHistory',
    initialState,
    reducers: {
        addOrder: (state, action: PayloadAction<Order>) => {
            state.history.push(action.payload);
        },
        clearHistory: (state) => {
            state.history = [];
        }
    }
});

export const { addOrder, clearHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
