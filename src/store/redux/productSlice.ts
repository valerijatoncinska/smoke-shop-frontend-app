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

// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


// // Интерфейс продукта
// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   quantity?: number;
//   active?: boolean;
//   image?: string;
//   description?: string;
//   characteristics?: string;
// }

// // Интерфейс состояния продуктов
// export interface ProductsState {
//   products: Product[];
//   filteredProducts: Product[];
//   status: "idle" | "loading" | "success" | "error";
// }

// // Начальное состояние
// const initialState: ProductsState = {
//   products: [],
//   filteredProducts: [],
//   status: "idle",
// };

// // Моковые данные
// const mockProducts: Product[] = [
//   { id: 1, title: "Product 1", price: 100 },
//   { id: 2, title: "Product 2", price: 200 },
//   { id: 3, title: "Product 3", price: 300 },
//   { id: 4, title: "Product 4", price: 400 },
//   { id: 5, title: "Product 5", price: 500 }
// ];

// // Асинхронное действие для получения продуктов
// export const fetchProducts = createAsyncThunk<Product[]>(
//   "products/fetchProducts",
//   async () => {
//     // Используйте моковые данные вместо API
//     return new Promise<Product[]>((resolve) => setTimeout(() => resolve(mockProducts), 1000));
//   }
// );

// const productSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     addProduct(state, action: PayloadAction<Product>) {
//       state.products.push(action.payload);
//     },
//     removeProduct(state, action: PayloadAction<number>) {
//       state.products = state.products.filter(
//         (product) => product.id !== action.payload
//       );
//     },
//     sortByPriceAsc(state) {
//       state.filteredProducts = state.filteredProducts.slice().sort((a, b) => a.price - b.price);
//     },
//     sortByPriceDesc(state) {
//       state.filteredProducts = state.filteredProducts.slice().sort((a, b) => b.price - a.price);
//     },
//     filterProductsByName(state, action: PayloadAction<string>) {
//       const query = action.payload.toLowerCase();
//       state.filteredProducts = state.products.filter((product) =>
//         product.title.toLowerCase().includes(query)
//       );
//     },
//     resetFilter(state) {
//       state.filteredProducts = state.products;
//     },
//     archiveProduct(state, action: PayloadAction<number>) {
//       state.products = state.products.map((product) =>
//         product.id === action.payload ? { ...product, active: false } : product
//       );
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchProducts.fulfilled,
//         (state, action: PayloadAction<Product[]>) => {
//           state.products = action.payload;
//           state.filteredProducts = action.payload;
//           state.status = "success";
//         }
//       )
//       .addCase(fetchProducts.rejected, (state) => {
//         state.status = "error";
//       });
//   },
// });

// export const { addProduct, removeProduct, sortByPriceAsc, sortByPriceDesc, filterProductsByName, resetFilter, archiveProduct } = productSlice.actions;

// export default productSlice.reducer;

