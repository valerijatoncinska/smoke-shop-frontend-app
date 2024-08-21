import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface AdminOrder {
  id: number,
  date: string,
  total: number
  userId: number
}

interface OrdersState {
  adminOrders: AdminOrder[]
  status: "loading" | "success" | "error"
}

const initialState: OrdersState = {
  adminOrders: [],
  status: "loading"
}


export const fetchAdminOrders = createAsyncThunk<
  AdminOrder[],
  void,
  { state: RootState }
>("orders/fetchAdminOrders", async () => {
  try {
    const response = await axios.get<AdminOrder[]>("/api/ctrl-panel/orders");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
})

const adminOrderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder
    .addCase(fetchAdminOrders.pending, state => {
      state.status = "loading"
    })
    .addCase(
      fetchAdminOrders.fulfilled,
      (state, action: PayloadAction<AdminOrder[]>) => {
        state.adminOrders = action.payload
        state.status = "success"
      },
    )
    .addCase(fetchAdminOrders.rejected, state => {
      state.status = "error"
    })
  },
})

export default adminOrderSlice.reducer
