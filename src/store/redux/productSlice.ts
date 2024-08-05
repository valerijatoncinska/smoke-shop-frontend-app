import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface Product {
  id: number
  title: string
  price: number
}

export interface ProductsState {
  products: Product[],
  filteredProducts: Product[],
  status: "loading" | "success" | "error"
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
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
    sortByPriceAsc: (state) => {
      state.products.sort((a, b) => a.price - b.price);
    },
    sortByPriceDesc: (state) => {
      state.products.sort((a, b) => b.price - a.price);
    },
    filterProductsByName(state, action: PayloadAction<string>) {
      const query = action.payload.toLowerCase()
      state.filteredProducts = state.products.filter(product =>
        product.title.toLowerCase().includes(query)
      )
    },
    // Reducer для сброса фильтра
    resetFilter(state) {
      state.filteredProducts = state.products
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
          state.filteredProducts = action.payload.data
          state.status = "success"
        },
      )
      .addCase(fetchProducts.rejected, state => {
        state.status = "error"
      })
  },
})

export const { addProduct, removeProduct, sortByPriceAsc, sortByPriceDesc, filterProductsByName, resetFilter } = productSlice.actions
export default productSlice.reducer
