import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "js-cookie"

interface User {
  id?: number
  email: string
  isAdult?: boolean
  subscribe?: boolean
  accessToken: string
  refreshToken: string
  roles: [
    {
      authority: string
    },
  ]
}

export interface ActivationResponse {
  message: string | undefined
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  status: "idle" | "loading" | "success" | "error"
  error: string | undefined
  activationStatus: "idle" | "loading" | "success" | "error"
  messageState: ActivationResponse
}

const initialState: UserState = {
  user: null,
  isLoggedIn: Boolean(localStorage.getItem("isLoggedIn")),
  status: "idle",
  error: undefined,
  activationStatus: "idle",
  messageState: {
    message: undefined,
  },
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

    const { email, accessToken, refreshToken, roles } = response.data

    const userData: User = {
      email,
      accessToken,
      refreshToken,
      roles,
    }

    return userData
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Проверяем код ответа от сервера
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return rejectWithValue("Incorrect email or password")
          case 403:
            return rejectWithValue("Forbidden: Access denied")
          case 404:
            return rejectWithValue("Email or password is incorrect")
          default:
            return rejectWithValue(
              "Account is not active. Please check your email.",
            )
        }
      }
    }
    return rejectWithValue("Email or password is incorrect")
  }
})

export const registerUser = createAsyncThunk<
  void,
  { email: string; password: string; isAdult: boolean; subscribe: boolean },
  { rejectValue: string }
>("user/registerUser", async (userData, { rejectWithValue }) => {
  try {
    await axios.post("/api/author/reg", userData, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return rejectWithValue(
          "User already exists. Please try a different email.",
        )
      }
      return rejectWithValue(
        error.message || "An error has occurred. Try again.",
      )
    }
    return rejectWithValue("An unexpected error has occurred. Try again.")
  }
})

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/author/logout")

      if (response.status !== 200) {
        throw new Error("Failed to logout")
      }
    } catch (error) {
      return rejectWithValue("Failed to logout. Please try again.")
    }
  },
)

export const activateAccount = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("user/activateAccount", async (uuid, { rejectWithValue }) => {
  try {
    const response = await axios.get<ActivationResponse>(
      `/api/author/account-activate/${uuid}`,
    )
    return response.data.message || "Account successfully activated!"
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return rejectWithValue("Activation link is invalid or expired.")
      }
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
    }
    return rejectWithValue("An unexpected error occurred during activation.")
  }
})

export const getCurrentUser = createAsyncThunk<User, void>(
  "user/getCurrentUser",
  async _ => {
    try {
      const response = await axios.get("/api/author/profile")

      if (response.status !== 200) {
        throw new Error("Failed to logout")
      }
      return response.data
    } catch (error) {}
  },
)

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
      state.error = undefined
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    clearError(state) {
      state.error = undefined
    },
  },
  extraReducers: builder => {
    builder
      // Вход
      .addCase(loginUser.pending, state => {
        state.status = "loading"
        state.error = undefined
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "success"
        state.user = action.payload
        state.isLoggedIn = true
        localStorage.setItem("isLoggedIn", JSON.stringify(true))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload
        state.isLoggedIn = false
        localStorage.setItem("isLoggedIn", JSON.stringify(""))
        state.user = null
      })

      // Регистрация
      .addCase(registerUser.pending, state => {
        state.status = "loading"
        state.error = undefined
      })
      .addCase(registerUser.fulfilled, state => {
        state.status = "success"
        state.user = null
        state.isLoggedIn = false
        localStorage.setItem("isLoggedIn", "")
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload
      })
      // Выход
      .addCase(logoutUser.pending, state => {
        state.status = "loading"
      })
      .addCase(logoutUser.fulfilled, state => {
        state.status = "success"
        state.user = null
        state.isLoggedIn = false
        localStorage.setItem("isLoggedIn", "")
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload
      })
      // Активация аккаунта
      .addCase(activateAccount.pending, state => {
        state.activationStatus = "loading"
        state.messageState.message = undefined
      })

      .addCase(activateAccount.fulfilled, (state, action) => {
        state.activationStatus = "success"
        state.messageState.message = action.payload
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.activationStatus = "error"
        state.messageState.message = action.payload as string
      })
  },
})

export const { login, logout, updateUser, clearError } = userSlice.actions
export default userSlice.reducer
