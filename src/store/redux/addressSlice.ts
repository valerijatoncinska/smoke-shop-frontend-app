import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Address {
  id: number;
  street: string;
  house: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  email: string;
  phone: string;
}

interface AddressState {
  addresses: Address[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  status: 'idle',
  error: null,
};

export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async () => {
  const response = await axios.get('/api/address');
  return response.data;
});

export const addAddress = createAsyncThunk('address/addAddress', async (newAddress: Address) => {
  const response = await axios.post('/api/address', newAddress);
  return response.data;
});

export const updateAddress = createAsyncThunk('address/updateAddress', async (updatedAddress: Address) => {
  const response = await axios.put(`/api/address/${updatedAddress.id}`, updatedAddress);
  return response.data;
});

export const deleteAddress = createAsyncThunk('address/deleteAddress', async (addressId: number) => {
  await axios.delete(`/api/address/${addressId}`);
  return addressId;
});

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex((address) => address.id === action.payload.id);
        state.addresses[index] = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((address) => address.id !== action.payload);
      });
  },
});

export default addressSlice.reducer;