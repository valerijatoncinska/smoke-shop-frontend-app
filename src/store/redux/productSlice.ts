import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "store/store"

export interface Product {
  id: number
  title: string
  price: number
  quantity?: number
  active?: boolean
  image?: string
  description?: string,
  characteristics?: string
}

export interface ProductsState {
  products: Product[],
  filteredProducts: Product[],
  status: "idle" | "loading" | "success" | "error"
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  status: "idle",
}

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("products/fetchProducts", async () => {
  try {
    const response = await axios.get<{ data: Product[] }>("/api/products");
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
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
    sortByPriceAsc(state) {
      state.filteredProducts = state.filteredProducts.slice().sort((a, b) => a.price - b.price);
    },
    sortByPriceDesc(state) {
      state.filteredProducts = state.filteredProducts.slice().sort((a, b) => b.price - a.price);
    },
    filterProductsByName(state, action: PayloadAction<string>) {
      const query = action.payload.toLowerCase();
      state.filteredProducts = state.products.filter(product =>
        product.title.toLowerCase().includes(query)
      );
    },
    resetFilter(state) {
      state.filteredProducts = state.products;
    },
    archiveProduct(state, action: PayloadAction<number>) {
      state.products = state.products.map(product =>
        product.id === action.payload ? { ...product, active: false } : product,
      )
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = "loading"
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload
          state.filteredProducts = action.payload
          state.status = "success"
        },
      )
      .addCase(fetchProducts.rejected, state => {
        state.status = "error"
      })
  },
})


export const { addProduct, removeProduct, sortByPriceAsc, sortByPriceDesc, filterProductsByName, resetFilter, archiveProduct } = productSlice.actions

export default productSlice.reducer

