import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient, TOKEN_STORAGE_KEY ,USER_STORAGE_KEY } from '../../api/client'

type LoginPayload = {
  email: string
  password: string
}

type AuthUser = {
  id: string
  email: string
  name?: string
}

type LoginResponse = {
  token: string
  user: AuthUser
}

type AuthState = {
  loading: boolean
  isAuthenticated: boolean
  token: string | null
  user: AuthUser | null
  error: string | null
}

function readStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: readStoredUser(),
  error: null,
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<LoginResponse>('/user/login', payload)
    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'Login failed. Please try again.',
    )
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    setAuthToken: (state, action: { payload: string | null }) => {
      state.token = action.payload
      state.isAuthenticated = Boolean(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Login failed. Please try again.'
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearAuthError, setAuthToken } = authSlice.actions
export default authSlice.reducer
