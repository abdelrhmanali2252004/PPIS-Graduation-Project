import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'
import type { FeasibilityStudyResponse } from '../../types/feasibilityStudy'
import type { FeasibilityStep3Response } from './feasibilitySlice'

export type ProjectDetails = {
  id: string
  name: string
  step: number
  logoUrl: string | null
  logoPrompt: string | null
  feasibility: FeasibilityStudyResponse | null
  marketResearchUsed: boolean
}

type ProjectDetailsApiData = {
  _id: string
  name?: string
  step?: number
  logoUrl?: string
  logoPrompt?: string
  feasibilityResponse?: FeasibilityStudyResponse
  marketResearchUsed?: boolean
}

type ProjectDetailsApiResponse = {
  message?: string
  data?: ProjectDetailsApiData
}

type ProjectDetailsState = {
  loading: boolean
  error: string | null
  data: ProjectDetails | null
}

const initialState: ProjectDetailsState = {
  loading: false,
  error: null,
  data: null,
}

function mapToProjectDetails(raw: ProjectDetailsApiData): ProjectDetails {
  return {
    id: raw._id,
    name: raw.name?.trim() || 'مشروع بدون اسم',
    step: raw.step ?? 5,
    logoUrl: raw.logoUrl ?? null,
    logoPrompt: raw.logoPrompt ?? null,
    feasibility: raw.feasibilityResponse ?? null,
    marketResearchUsed: Boolean(raw.marketResearchUsed),
  }
}

export function projectDetailsToFeasibilityStudy(
  details: ProjectDetails | null,
): FeasibilityStep3Response | null {
  if (!details?.feasibility) return null
  return {
    message: 'success',
    prompt: '',
    res: details.feasibility,
    marketResearchUsed: details.marketResearchUsed,
  }
}

export const fetchProjectDetails = createAsyncThunk<
  ProjectDetails,
  string,
  { rejectValue: string }
>('projectDetails/fetch', async (projectId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<ProjectDetailsApiResponse>(
      `project/get-project/${projectId}`,
    )
    const raw = response.data.data
    if (!raw?._id) {
      return rejectWithValue('لم يتم العثور على بيانات المشروع.')
    }
    return mapToProjectDetails(raw)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحميل تفاصيل المشروع. حاول مرة أخرى.',
    )
  }
})

const projectDetailsSlice = createSlice({
  name: 'projectDetails',
  initialState,
  reducers: {
    clearProjectDetails: (state) => {
      state.loading = false
      state.error = null
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'تعذر تحميل تفاصيل المشروع.'
      })
  },
})

export const { clearProjectDetails } = projectDetailsSlice.actions
export default projectDetailsSlice.reducer
