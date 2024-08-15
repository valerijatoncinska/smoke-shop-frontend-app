import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../store/store"
import Cookies from "js-cookie"
import { Product } from "./productSlice"

export interface CartItem {
  id: string
  title: string
  stock: number
  quantity: number
  productId: string
  price: number
  totalPrice: number
}

export interface Address {
  id: string
  name: string
  street: string
  house: string
  postalCode: string
  locality: string
  region: string
  email: string
  phone: string
}

interface UpdateCartInfo {
    id: string
    type: string
}

export interface CartState {
  items: CartItem[]
  addresses: Address[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: CartState = {
  items: [],
  addresses: [],
  status: "idle",
  error: null,
}

// Асинхронный экшен для получения товаров корзины
export const fetchCartItems = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchCartItems", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken") // Получаем токен из Cookies
    const response = await fetch("/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch cart items")
    }

    const data = await response.json()
    return data.products as CartItem[]
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Асинхронные экшены для работы с адресами
// Получение адресов
export const fetchAddresses = createAsyncThunk<
  Address[],
  void,
  { rejectValue: string }
>("cart/fetchAddresses", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken")
    const response = await fetch("/api/address", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch addresses")
    }

    const data = await response.json()
    return data as Address[]
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Добавление адреса
export const addAddress = createAsyncThunk<
  Address,
  Address,
  { rejectValue: string }
>("cart/addAddress", async (newAddress, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken")
    const response = await fetch("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddress),
    })

    if (!response.ok) {
      throw new Error("Failed to add address")
    }

    const data = await response.json()
    return data as Address
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Редактирование адреса
export const updateAddress = createAsyncThunk<
  Address,
  Address,
  { rejectValue: string }
>("cart/updateAddress", async (updatedAddress, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken")
    const response = await fetch(`/api/address/${updatedAddress.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAddress),
    })

    if (!response.ok) {
      throw new Error("Failed to update address")
    }
    const data = await response.json()
    return data as Address
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Удаление адреса
export const deleteAddress = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cart/deleteAddress", async (addressId, { rejectWithValue }) => {
  try {
    const token = Cookies.get("accessToken")
    const response = await fetch(`/api/address/${addressId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete address")
    }

    return addressId
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const updateCartItem = createAsyncThunk<
  CartItem,
  UpdateCartInfo,
  { rejectValue: string }
>("cart/updateCartItem", async (updateCartInfo, { rejectWithValue }) => {
  try {
    // const token = Cookies.get("accessToken")
    const response = await fetch(`/api/cart/${updateCartInfo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: updateCartInfo.type,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update address")
    }
    const data = await response.json()
    return data as CartItem
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const deleteCartItem = createAsyncThunk<
  string,
  CartItem["id"],
  { rejectValue: string }
>("cart/deleteCartItem", async (cartItemId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete address")
    }

    return response.json();
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const addItemToCart = createAsyncThunk<
CartItem,
  Product["id"],
  { rejectValue: string }
>("cart/addItemToCart", async (newItemId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/products/${newItemId}/addition-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to add Item")
    }

    return response.json()
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const clearCart = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/cart/clear`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete address")
    }

    return response.json();
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Добавление товара в корзину
    addItemToCart(state, action: PayloadAction<CartItem>) {
      // Находим товар в корзине по ID, если он уже есть
      const existingItem = state.items.find(
        item => item.id === action.payload.id,
      )
      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем количество и пересчитываем общую стоимость
        existingItem.quantity += action.payload.quantity
        existingItem.totalPrice = parseFloat(
          (existingItem.quantity * existingItem.price).toFixed(2),
        ) // Округляем сумму до 2 знаков после запятой
      } else {
        // Если товара нет в корзине, добавляем его
        state.items.push({
          ...action.payload,
          totalPrice: parseFloat(
            (action.payload.quantity * action.payload.price).toFixed(2),
          ), // Округляем сумму до 2 знаков после запятой
        })
      }
    },
    // Удаление товара из корзины
    // removeItemFromCart(state, action: PayloadAction<string>) {
    //   state.items = state.items.filter(item => item.id !== action.payload)
    // },
    // Очистка корзины
    clearCartReducer(state) {
      state.items = []
    },
  },
  extraReducers: builder => {
    builder
      // Обработка состояния во время загрузки товаров корзины
      .addCase(fetchCartItems.pending, state => {
        state.status = "loading"
      })
      // Обработка успешного получения товаров корзины
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      // Обработка ошибки при получении товаров корзины
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Could not fetch cart items"
      })
      // Обработка состояния во время загрузки адресов
      .addCase(fetchAddresses.pending, state => {
        state.status = "loading"
      })
      // Обработка успешного получения адресов
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.addresses = action.payload
      })
      // Обработка ошибки при получении адресов
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Could not fetch addresses"
      })
      // Обработка успешного добавления адреса
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload)
      })
      // Обработка успешного обновления адреса
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          address => address.id === action.payload.id,
        )
        if (index !== -1) {
          state.addresses[index] = action.payload
        }
      })
      // Обработка успешного удаления адреса
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          address => address.id !== action.payload,
        )
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        let temp = true;
        state.items = state.items.map((item) => {
            if(item.id === action.payload.id){
                temp = false;
                return action.payload
            }
            return item
        })
        if (temp) {
            state.items.push(action.payload)
        }
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => item.id !== action.payload,
        )
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
      })
  },
})

export const {
//   addItemToCart,
  /* updateCartItem, */ /* removeItemFromCart, */
  clearCartReducer,
} = cartSlice.actions

export const selectCart = (state: RootState) => state.cart.items
export const selectAddresses = (state: RootState) => state.cart.addresses

export default cartSlice.reducer
