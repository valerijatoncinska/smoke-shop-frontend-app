import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface Order {
  id: number
  product: string
  quantity: number
  price: number
  date: Date
  status?: string
}

interface OrdersState {
  orders: Order[],
  status: "loading" | "success" | "error"
}

const initialState: OrdersState = {
  orders: [],
  status: "loading"
}

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState }
>("products/fetchProducts", async () => {
  try {
    const response = await axios.get<{ data: Order[] }>("/api/products");
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
})

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload)
    },
    removeOrder(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter(order => order.id !== action.payload)
    },
    updateOrder(state, action: PayloadAction<Order>) {
      const index = state.orders.findIndex(
        order => order.id === action.payload.id,
      )
      if (index !== -1) {
        state.orders[index] = action.payload
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.status = "loading"
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload
        },
      )
      .addCase(fetchOrders.rejected, state => {
        state.status = "error"
      })
  },
})

export const { addOrder, removeOrder, updateOrder } = orderSlice.actions
export default orderSlice.reducer
