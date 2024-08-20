import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Order {
  id: number;
  date: string;
  total: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  total: number;
  quantity: number;
}

interface OrderDetails {
  data: {
    id: number;
    total: number;
    date: string;
  };
  products: Product[];
}

interface OrderHistoryState {
  history: Order[];
  orderDetails: OrderDetails | null;
  loading: boolean;
}

const initialState: OrderHistoryState = {
  history: [],
  orderDetails: null,
  loading: false,
};

export const fetchOrders = createAsyncThunk('orderHistory/fetchOrders', async () => {
  const response = await fetch('/api/orders');
  return response.json();
});

export const fetchOrderDetails = createAsyncThunk('orderHistory/fetchOrderDetails', async (orderId: number) => {
  const response = await fetch(`/api/orders/${orderId}`);
  return response.json();
});

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.history = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderDetails = action.payload;
      });
  }
});

export const { clearHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;




// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface Order {
//     id: number;
//     productName: string;
//     quantity: number;
//     totalPrice: number;
// }

// interface OrderHistoryState {
//     history: Order[];
// }

// const initialState: OrderHistoryState = {
//     history: []
// };

// const orderHistorySlice = createSlice({
//     name: 'orderHistory',
//     initialState,
//     reducers: {
//         addOrder: (state, action: PayloadAction<Order>) => {
//             state.history.push(action.payload);
//         },
//         clearHistory: (state) => {
//             state.history = [];
//         }
//     }
// });

// export const { addOrder, clearHistory } = orderHistorySlice.actions;
// export default orderHistorySlice.reducer;
