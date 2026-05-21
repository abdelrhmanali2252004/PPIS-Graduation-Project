import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'
import type { AdminUserRecord, AllAdminUsersResponse } from '../../types/adminUser'

type AdminUsersState = {
  users: AdminUserRecord[]
  count: number
  loading: boolean
  error: string | null
}

const initialState: AdminUsersState = {
  users: [],
  count: 0,
  loading: false,
  error: null,
}

export const fetchAllAdminUsers = createAsyncThunk<
  AllAdminUsersResponse,
  void,
  { rejectValue: string }
>('adminUsers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<AllAdminUsersResponse>('user/users')
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحميل المستخدمين. حاول مرة أخرى.',
    )
  }
})

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearAdminUsersError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdminUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAdminUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data ?? []
        state.count = action.payload.count ?? state.users.length
      })
      .addCase(fetchAllAdminUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'تعذر تحميل المستخدمين. حاول مرة أخرى.'
      })
  },
})

export const { clearAdminUsersError } = adminUsersSlice.actions
export default adminUsersSlice.reducer
