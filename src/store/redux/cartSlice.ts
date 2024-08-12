import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import Cookies from 'js-cookie';

export interface CartItem {
    id: string;
    title: string;
    stock: number;
    quantity: number;
    productId: string;
    price: number;
    totalPrice: number;
}

export interface Address {
    id: string;
    name: string;
    street: string;
    house: string;
    postalCode: string;
    locality: string;
    region: string;
    email: string;
    phone: string;
}

export interface CartState {
    items: CartItem[];
    addresses: Address[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    items: [],
    addresses: [],
    status: 'idle',
    error: null,
};

// Асинхронный экшен для получения товаров корзины
export const fetchCartItems = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('accessToken'); // Получаем токен из Cookies
            const response = await fetch('/api/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            return data.products as CartItem[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронные экшены для работы с адресами
// Получение адресов
export const fetchAddresses = createAsyncThunk<Address[], void, { rejectValue: string }>(
    'cart/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('accessToken');
            const response = await fetch('/api/address', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }

            const data = await response.json();
            return data as Address[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Добавление адреса
export const addAddress = createAsyncThunk<Address, Address, { rejectValue: string }>(
    'cart/addAddress',
    async (newAddress, { rejectWithValue }) => {
        try {
            const token = Cookies.get('accessToken');
            const response = await fetch('/api/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAddress),
            });

            if (!response.ok) {
                throw new Error('Failed to add address');
            }

            const data = await response.json();
            return data as Address;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Редактирование адреса
export const updateAddress = createAsyncThunk<Address, Address, { rejectValue: string }>(
    'cart/updateAddress',
    async (updatedAddress, { rejectWithValue }) => {
        try {
            const token = Cookies.get('accessToken');
            const response = await fetch(`/api/address/${updatedAddress.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAddress),
            });

            if (!response.ok) {
                throw new Error('Failed to update address');
            }
            const data = await response.json();
            return data as Address;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Удаление адреса
export const deleteAddress = createAsyncThunk<string, string, { rejectValue: string }>(
    'cart/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const token = Cookies.get('accessToken');
            const response = await fetch(`/api/address/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete address');
            }

            return addressId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Добавление товара в корзину
        addItemToCart(state, action: PayloadAction<CartItem>) {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                // Если товар уже есть в корзине, увеличиваем количество и пересчитываем общую стоимость
                existingItem.quantity += action.payload.quantity;
                existingItem.totalPrice = existingItem.quantity * existingItem.price;
            } else {
                // Если товара нет в корзине, добавляем его
                state.items.push(action.payload);
            }
        },
        // Обновление товара в корзине
        updateCartItem(state, action: PayloadAction<CartItem>) {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        // Удаление товара из корзины
        removeItemFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        // Очистка корзины
        clearCart(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Обработка состояния во время загрузки товаров корзины
            .addCase(fetchCartItems.pending, (state) => {
                state.status = 'loading';
            })
            // Обработка успешного получения товаров корзины
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            // Обработка ошибки при получении товаров корзины
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Could not fetch cart items';
            })
            // Обработка состояния во время загрузки адресов
            .addCase(fetchAddresses.pending, (state) => {
                state.status = 'loading';
            })
            // Обработка успешного получения адресов
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.addresses = action.payload;
            })
            // Обработка ошибки при получении адресов
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Could not fetch addresses';
            })
            // Обработка успешного добавления адреса
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
            })
            // Обработка успешного обновления адреса
            .addCase(updateAddress.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(address => address.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            // Обработка успешного удаления адреса
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(address => address.id !== action.payload);
            });
    },
});

export const { addItemToCart, updateCartItem, removeItemFromCart, clearCart } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.items;
export const selectAddresses = (state: RootState) => state.cart.addresses;

export default cartSlice.reducer;