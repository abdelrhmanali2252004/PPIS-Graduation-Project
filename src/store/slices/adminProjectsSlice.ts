import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'
import type { AdminProjectRecord, AllAdminProjectsResponse } from '../../types/adminProject'

type AdminProjectsState = {
  projects: AdminProjectRecord[]
  count: number
  loading: boolean
  error: string | null
}

const initialState: AdminProjectsState = {
  projects: [],
  count: 0,
  loading: false,
  error: null,
}

export const fetchAllAdminProjects = createAsyncThunk<
  AllAdminProjectsResponse,
  void,
  { rejectValue: string }
>('adminProjects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<AllAdminProjectsResponse>('project/admin/projects')
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحميل المشاريع. حاول مرة أخرى.',
    )
  }
})

const adminProjectsSlice = createSlice({
  name: 'adminProjects',
  initialState,
  reducers: {
    clearAdminProjectsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdminProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAdminProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload.data ?? []
        state.count = action.payload.count ?? state.projects.length
      })
      .addCase(fetchAllAdminProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'تعذر تحميل المشاريع. حاول مرة أخرى.'
      })
  },
})

export const { clearAdminProjectsError } = adminProjectsSlice.actions
export default adminProjectsSlice.reducer
