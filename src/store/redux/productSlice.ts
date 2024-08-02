import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface Product {
  id: number
  title: string
  price: number
}

export interface ProductsState {
  products: Product[]
}

const initialState: ProductsState = {
  products: [],
}

// export const fetchProducts = createAsyncThunk<
//   {data: Product[]},
//   void,
//   { state: RootState }
// >("products/fetchProducts", async () => {
//   const response = await axios.get<{data: Product[]}>("/api/products")
//   return response.data
// })

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
  },
  // extraReducers: builder => {
  //   builder.addCase(
  //     fetchProducts.fulfilled,
  //     (state, action: PayloadAction<{data: Product[]}>) => {
  //       state.products = action.payload.data
  //     },
  //   )
  // },
})

export const { addProduct, removeProduct } = productSlice.actions
export default productSlice.reducer
