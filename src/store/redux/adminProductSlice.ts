import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface IProduct {
  id: number
  title: string
  price: number
  quantity?: number
  active?: boolean
  image?: string
}

export interface InitialState {
  adminProducts: IProduct[]
  status: "loading" | "success" | "error"
}

const initialState: InitialState = {
  adminProducts: [],
  status: "loading",
}

export const fetchAdminProducts = createAsyncThunk<
  {data: IProduct[]},
  void,
  { state: RootState }
>("/admin/products/fetchAdminProducts", async () => {
  const response = await axios.get<{data: IProduct[]}>("/api/products")
  return response.data
})

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<IProduct>) {
      state.adminProducts.push(action.payload)
    },
    archiveProduct(state, action: PayloadAction<number>) {
      state.adminProducts = state.adminProducts.map(product =>
        product.id === action.payload ? { ...product, active: false } : product,
      )
    },
    sortByPriceAsc(state) {
      state.adminProducts = state.adminProducts
        .slice()
        .sort((a, b) => a.price - b.price)
    },
    sortByPriceDesc(state) {
      state.adminProducts = state.adminProducts
        .slice()
        .sort((a, b) => b.price - a.price)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminProducts.pending, state => {
        state.status = "loading"
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<{data: IProduct[]}>) => {
          state.adminProducts = action.payload.data
          state.status = "success"
        },
      )
      .addCase(fetchAdminProducts.rejected, state => {
        state.status = "error"
      })
  },
})

export const {
  addProduct,
  archiveProduct,
  sortByPriceAsc,
  sortByPriceDesc,
} = adminProductSlice.actions

export default adminProductSlice.reducer
