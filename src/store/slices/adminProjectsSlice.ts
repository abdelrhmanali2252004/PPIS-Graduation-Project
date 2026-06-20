import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'
import type {
  AdminProjectByIdResponse,
  AdminProjectRecord,
  AllAdminProjectsResponse,
} from '../../types/adminProject'
import type { FeasibilityStudyResponse } from '../../types/feasibilityStudy'
import type { ProjectDetails } from './projectDetailsSlice'

type AdminSelectedProjectState = {
  loading: boolean
  error: string | null
  data: ProjectDetails | null
}

type AdminProjectsState = {
  projects: AdminProjectRecord[]
  count: number
  loading: boolean
  error: string | null
  selectedProject: AdminSelectedProjectState
}

const initialSelectedProject: AdminSelectedProjectState = {
  loading: false,
  error: null,
  data: null,
}

const initialState: AdminProjectsState = {
  projects: [],
  count: 0,
  loading: false,
  error: null,
  selectedProject: initialSelectedProject,
}

function mapAdminProjectToDetails(raw: AdminProjectRecord): ProjectDetails {
  const feasibility = raw.feasibilityResponse as FeasibilityStudyResponse | null | undefined

  return {
    id: raw._id,
    name: raw.name?.trim() || 'مشروع بدون اسم',
    step: raw.step ?? 5,
    logoUrl: raw.logoUrl ?? null,
    logoPrompt: raw.logoPrompt ?? null,
    feasibility: feasibility ?? null,
    marketResearchUsed: Boolean(raw.marketResearchUsed),
  }
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

export const fetchAdminProjectById = createAsyncThunk<
  ProjectDetails,
  string,
  { rejectValue: string }
>('adminProjects/fetchById', async (projectId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<AdminProjectByIdResponse>(
      `project/admin/projects/${projectId}`,
    )
    const raw = response.data.data
    if (!raw?._id) {
      return rejectWithValue('لم يتم العثور على بيانات المشروع.')
    }
    return mapAdminProjectToDetails(raw)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحميل تفاصيل المشروع. حاول مرة أخرى.',
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
    clearAdminProjectDetails: (state) => {
      state.selectedProject = initialSelectedProject
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
      .addCase(fetchAdminProjectById.pending, (state) => {
        state.selectedProject.loading = true
        state.selectedProject.error = null
      })
      .addCase(fetchAdminProjectById.fulfilled, (state, action) => {
        state.selectedProject.loading = false
        state.selectedProject.data = action.payload
      })
      .addCase(fetchAdminProjectById.rejected, (state, action) => {
        state.selectedProject.loading = false
        state.selectedProject.error =
          action.payload ?? 'تعذر تحميل تفاصيل المشروع.'
      })
  },
})

export const { clearAdminProjectsError, clearAdminProjectDetails } = adminProjectsSlice.actions
export default adminProjectsSlice.reducer
