import { RootState } from './../store';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface IUser {
  id: number
  email: string
  timeVisit: Date
}

export interface ActivationResponse {
  message: string | undefined
}

interface UserState {
  users: IUser[]
  status: "loading" | "success" | "error"
}

const initialState: UserState = {
  users: [],
  status: "loading"
}



export const fetchAdminUsers = createAsyncThunk<
  IUser[],
  void,
  { state: RootState }
>("users/fetchUsersForAdmin", async () => {
  try {
    const response = await axios.get<IUser[]>("/api/ctrl-panel/users");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
})


const userSliceForAdmin = createSlice({
  name: "users",
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminUsers.pending, state => {
        state.status = "loading"
            })
      .addCase(
        fetchAdminUsers.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.users = action.payload
          state.status = "success"
        },
      )
      .addCase(fetchAdminUsers.rejected, state => {
        state.status = "error"
      })
  },
})

export default userSliceForAdmin.reducer