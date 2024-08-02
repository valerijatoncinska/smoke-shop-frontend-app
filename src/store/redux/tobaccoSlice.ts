import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "store/store";

export interface ITobacco {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export interface ITobaccoState {
  items: ITobacco[];
  status: "loading" | "success" | "error";
}

const initialState: ITobaccoState = {
  items: [],
  status: "loading",
};

export const fetchTobacco = createAsyncThunk<ITobacco[], void, { state: RootState }>(
  "tobacco/fetchTobacco",
  async () => {
    const response = await axios.get<ITobacco[]>("/api/tobacco");
    return response.data;
  }
);

const tobaccoSlice = createSlice({
  name: "tobacco",
  initialState,
  reducers: {
    sortByPriceAsc: (state) => {
      state.items.sort((a, b) => a.price - b.price);
    },
    sortByPriceDesc: (state) => {
      state.items.sort((a, b) => b.price - a.price);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTobacco.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTobacco.fulfilled, (state, action: PayloadAction<ITobacco[]>) => {
        state.status = "success";
        state.items = action.payload;
      })
      .addCase(fetchTobacco.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { sortByPriceAsc, sortByPriceDesc } = tobaccoSlice.actions;

export default tobaccoSlice.reducer;