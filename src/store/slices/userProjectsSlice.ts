import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'

export type ProjectCard = {
  id: string
  name: string
  category: string
  location: string
  updatedAt: string
  step: number
}

type UserProjectApiItem = {
  _id: string
  name: string
  status: number
  step?: number
}

type UserProjectsResponse = {
  message: string
  count: number
  data: UserProjectApiItem[]
}

type UserProjectsState = {
  loading: boolean
  error: string | null
  projects: ProjectCard[]
}

const initialState: UserProjectsState = {
  loading: false,
  error: null,
  projects: [],
}

export const fetchUserProjects = createAsyncThunk<
  ProjectCard[],
  void,
  { rejectValue: string }
>('userProjects/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<UserProjectsResponse>(
      'project/get-my-projects',
    )

    return (response.data.data ?? []).map((project) => ({
      id: project._id,
      name: project.name || 'Untitled Project',
      category: project.status === 1 ? 'نشط' : 'غير نشط',
      location: 'غير متوفر',
      updatedAt: 'آخر تحديث غير متوفر',
      step: project.step ?? 1,
    }))
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'فشل تحميل المشروعات. حاول مرة أخرى.',
    )
  }
})

const userProjectsSlice = createSlice({
  name: 'userProjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.projects = action.payload
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.loading = false
        state.projects = []
        state.error = action.payload ?? 'فشل تحميل المشروعات. حاول مرة أخرى.'
      })
  },
})

export default userProjectsSlice.reducer
