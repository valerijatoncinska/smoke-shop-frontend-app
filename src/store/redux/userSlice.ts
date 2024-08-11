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
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  status: "idle" | "loading" | "success" | "error"
  error: string | null
  activationStatus: "idle" | "loading" | "success" | "error";
  activationMessage: string | null;
  activationErrorMessage: string | null;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  status: "idle",
  error: null,
  activationStatus: 'idle',
  activationMessage: null,
  activationErrorMessage: null
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

    const { email, accessToken, refreshToken } = response.data

    Cookies.set("ACCESS_TOKEN", accessToken, { expires: 1 })
    Cookies.set("REFRESH_TOKEN", refreshToken, { expires: 3 })
    Cookies.set("EMAIL", email, { expires: 3 })

    const userData: User = {
      email,
      accessToken,
      refreshToken,
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
            return rejectWithValue("Email not registered")
          default:
            return rejectWithValue(
              "Account is not active. Please check your email.",
            )
        }
      }
    }
    return rejectWithValue("An unexpected error occurred")
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
        error.response?.data.message || "An error has occurred. Try again.",
      )
    }
    return rejectWithValue("An unexpected error has occurred. Try again.")
  }
})


export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get("/api/author/logout", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to logout");
      }

      Cookies.remove("ACCESS_TOKEN");
      Cookies.remove("REFRESH_TOKEN");
      Cookies.remove("EMAIL");
    } catch (error) {
      return rejectWithValue("Failed to logout. Please try again.");
    }
  }
);

export const activateAccount = createAsyncThunk<{ message: string; errorMessage: string | null }, string, { rejectValue: string}>("user/activateAccount", async (uuid, {rejectWithValue}) => {
  try {
    const response = await axios.get(`/api/author/account-activate/${uuid}`);
    return { message: response.data.message, errorMessage: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return rejectWithValue("Activation link is invalid or expired.");
      }
    }
    return rejectWithValue("An unexpected error occurred during activation.");
  }
});



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
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "success"
        state.user = null
        state.isLoggedIn = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload as string
      })
      // Выход
      .addCase(logoutUser.pending, state => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, state => {
        state.status = "success";
        state.user = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      // Активация аккаунта
      .addCase(activateAccount.pending, (state) => {
        state.activationStatus = 'loading';
        state.error = null;
        state.activationMessage = null;
        state.activationErrorMessage = null;
      })
      .addCase(activateAccount.fulfilled, (state, action) => {
        state.activationStatus = 'success';
        state.activationMessage = action.payload.message;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.activationStatus = 'error';
        state.activationErrorMessage = action.payload as string
      })
  },
})

export const { login, logout, updateUser, clearError } = userSlice.actions
export default userSlice.reducer
