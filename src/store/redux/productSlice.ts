import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface Product {
  id: number
  title: string
  price: number
  image?: string
  isActive?: boolean
}

export interface ProductsState {
  products: Product[]
  status: "loading" | "success" | "error"
}

const initialState: ProductsState = {
  products: [],
  status: "loading",
}

export const fetchProducts = createAsyncThunk<
  { data: Product[] },
  void,
  { state: RootState }
>("products/fetchProducts", async () => {
  const response = await axios.get<{ data: Product[] }>("/api/products")
  return response.data
})

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload)
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        product => product.id !== action.payload,
      )
    },
    sortByPriceAsc: state => {
      state.products.sort((a, b) => a.price - b.price)
    },
    sortByPriceDesc: state => {
      state.products.sort((a, b) => b.price - a.price)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = "loading"
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<{ data: Product[] }>) => {
          state.products = action.payload.data
        },
      )
      .addCase(fetchProducts.rejected, state => {
        state.status = "error"
      })
  },
})

export const { addProduct, removeProduct, sortByPriceAsc, sortByPriceDesc } =
  productSlice.actions
export default productSlice.reducer
