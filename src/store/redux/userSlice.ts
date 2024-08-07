import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface User {
  id: number
  name: string
  email: string
  isAdult: boolean
  subscribe: boolean
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  status: "idle" | "loading" | "success" | "error"
  error: string | null
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  status: "idle",
  error: null,
}

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/author/login", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const token = response.data.token

    localStorage.setItem("authToken", token)
    console.log("Ответ от сервера:", response.data)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Проверяем код ответа от сервера
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return rejectWithValue("Incorrect email or password")
          case 404:
            return rejectWithValue("Email not registered")
          default:
            return rejectWithValue("An error has occurred. Try again.")
        }
      }
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

export const registerUser = createAsyncThunk<
  User,
  { email: string; password: string; isAdult: boolean; subscribe: boolean },
  { rejectValue: string }
>("user/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/author/reg", userData, {
      headers: { "Content-Type": "application/json" },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return rejectWithValue(
          "User already exists. Please try a different email.",
        )
      }
      return rejectWithValue(
        error.response?.data.message || "An error has occurred. Try again.",
      )
    }
    return rejectWithValue("An unexpected error has occurred. Try again.")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isLoggedIn = true
    },
    logout(state) {
      state.user = null
      state.isLoggedIn = false
      state.status = "success"
      state.error = null
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Вход
      .addCase(loginUser.pending, state => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "success"
        state.user = action.payload
        state.isLoggedIn = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload as string
      })

      // Регистрация
      .addCase(registerUser.pending, state => {
        state.status = "loading"
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "success"
        state.user = action.payload
        state.isLoggedIn = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload as string
      })
  },
})

export const { login, logout, updateUser, clearError } = userSlice.actions
export default userSlice.reducer
