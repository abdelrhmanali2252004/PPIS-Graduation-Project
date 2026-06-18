import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import {
  changePassword,
  getProfile,
  updateProfile,
  type ChangePasswordPayload,
  type UpdateProfilePayload,
  type UserProfile,
} from '../../api/profile'
import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../api/client'
import type { AuthUser } from '../../types/auth'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  phoneNumber: string
}

type RegisterResult =
  | { mode: 'authenticated'; data: LoginResponse }
  | { mode: 'pending_login' }

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
  profileLoading: boolean
  profileSaving: boolean
  passwordSaving: boolean
}

function profileToAuthUser(profile: UserProfile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    phoneNumber: profile.phoneNumber,
    secondaryPhoneNumber: profile.secondaryPhoneNumber ?? null,
    role: profile.role,
  }
}

function persistUser(user: AuthUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
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
  profileLoading: false,
  profileSaving: false,
  passwordSaving: false,
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

export const registerUser = createAsyncThunk<
  RegisterResult,
  RegisterPayload,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<Partial<LoginResponse>>(
      '/user/register',
      payload,
    )
    const data = response.data
    if (data.token && data.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
      return {
        mode: 'authenticated',
        data: { token: data.token, user: data.user },
      }
    }
    return { mode: 'pending_login' }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ??
        'تعذر إنشاء الحساب. حاول مرة أخرى.',
    )
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
})

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await getProfile()
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحميل بيانات الحساب.',
    )
  }
})

export const updateUserProfile = createAsyncThunk<
  UserProfile,
  UpdateProfilePayload,
  { rejectValue: string }
>('auth/updateUserProfile', async (payload, { rejectWithValue }) => {
  try {
    return await updateProfile(payload)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر حفظ التغييرات.',
    )
  }
})

export const changeUserPassword = createAsyncThunk<
  string,
  ChangePasswordPayload,
  { rejectValue: string }
>('auth/changeUserPassword', async (payload, { rejectWithValue }) => {
  try {
    return await changePassword(payload)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تغيير كلمة المرور.',
    )
  }
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.mode === 'authenticated') {
          state.token = action.payload.data.token
          state.user = action.payload.data.user
          state.isAuthenticated = true
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload ?? 'تعذر إنشاء الحساب. حاول مرة أخرى.'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false
        const user = profileToAuthUser(action.payload)
        state.user = user
        persistUser(user)
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.profileLoading = false
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.profileSaving = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileSaving = false
        const user = profileToAuthUser(action.payload)
        state.user = user
        persistUser(user)
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.profileSaving = false
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.passwordSaving = true
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.passwordSaving = false
      })
      .addCase(changeUserPassword.rejected, (state) => {
        state.passwordSaving = false
      })
  },
})

export const { clearAuthError, setAuthToken } = authSlice.actions
export default authSlice.reducer
