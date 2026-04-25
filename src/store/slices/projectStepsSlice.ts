import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'

export const PROJECT_ID_STORAGE_KEY = 'ideaTechProjectId'

type StepStatus = 'idle' | 'loading' | 'success' | 'error'

type ProjectStepsState = {
  projectId: string | null
  creatingStep1: boolean
  uploadingMarketResearch: boolean
  error: string | null
  marketResearchError: string | null
  steps: Record<1 | 2 | 3 | 4 | 5, StepStatus>
}

const initialState: ProjectStepsState = {
  projectId: localStorage.getItem(PROJECT_ID_STORAGE_KEY),
  creatingStep1: false,
  uploadingMarketResearch: false,
  error: null,
  marketResearchError: null,
  steps: {
    1: 'idle',
    2: 'idle',
    3: 'idle',
    4: 'idle',
    5: 'idle',
  },
}

function extractProjectId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const root = payload as Record<string, unknown>
  const directProjectId =
    root.projectId ?? root._id ?? root.id ?? (root.data as Record<string, unknown>)?.projectId
  const nestedData = root.data as Record<string, unknown> | undefined
  const nestedProjectId = nestedData?._id ?? nestedData?.id
  const value = directProjectId ?? nestedProjectId

  return typeof value === 'string' && value.trim() ? value : null
}

export const createStep1Project = createAsyncThunk<
  string,
  void,
  { rejectValue: string; state: { projectSteps: ProjectStepsState } }
>('projectSteps/createStep1Project', async (_, { getState, rejectWithValue }) => {
  const existingId = getState().projectSteps.projectId
  if (existingId) {
    return existingId
  }

  try {
    const response = await apiClient.get('project/step1')
    const projectId = extractProjectId(response.data)

    if (!projectId) {
      return rejectWithValue('تعذر قراءة رقم المشروع من الاستجابة.')
    }

    localStorage.setItem(PROJECT_ID_STORAGE_KEY, projectId)
    return projectId
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'فشل إنشاء المشروع الافتراضي. حاول مرة أخرى.',
    )
  }
})

export const uploadMarketResearchPdf = createAsyncThunk<
  string,
  File,
  { rejectValue: string; state: { projectSteps: ProjectStepsState } }
>('projectSteps/uploadMarketResearchPdf', async (file, { getState, rejectWithValue }) => {
  const projectId = getState().projectSteps.projectId

  if (!projectId) {
    return rejectWithValue('لا يوجد رقم مشروع لإرسال ملف دراسة السوق.')
  }

  const formData = new FormData()
  formData.append('projectId', projectId)
  formData.append('pdf', file)

  try {
    const response = await apiClient.post<{ message?: string }>('project/market-research', formData)
    return response.data.message ?? 'market research stored successfuly'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'فشل رفع ملف دراسة السوق. حاول مرة أخرى.',
    )
  }
})

const projectStepsSlice = createSlice({
  name: 'projectSteps',
  initialState,
  reducers: {
    clearProjectStepsError: (state) => {
      state.error = null
    },
    resetProjectSteps: (state) => {
      state.projectId = null
      state.creatingStep1 = false
      state.uploadingMarketResearch = false
      state.error = null
      state.marketResearchError = null
      state.steps = { 1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle' }
      localStorage.removeItem(PROJECT_ID_STORAGE_KEY)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStep1Project.pending, (state) => {
        state.creatingStep1 = true
        state.error = null
        state.steps[1] = 'loading'
      })
      .addCase(createStep1Project.fulfilled, (state, action) => {
        state.creatingStep1 = false
        state.projectId = action.payload
        state.steps[1] = 'success'
      })
      .addCase(createStep1Project.rejected, (state, action) => {
        state.creatingStep1 = false
        state.error = action.payload ?? 'فشل إنشاء المشروع الافتراضي. حاول مرة أخرى.'
        state.steps[1] = 'error'
      })
      .addCase(uploadMarketResearchPdf.pending, (state) => {
        state.uploadingMarketResearch = true
        state.marketResearchError = null
      })
      .addCase(uploadMarketResearchPdf.fulfilled, (state) => {
        state.uploadingMarketResearch = false
      })
      .addCase(uploadMarketResearchPdf.rejected, (state, action) => {
        state.uploadingMarketResearch = false
        state.marketResearchError = action.payload ?? 'فشل رفع ملف دراسة السوق. حاول مرة أخرى.'
      })
  },
})

export const { clearProjectStepsError, resetProjectSteps } = projectStepsSlice.actions
export default projectStepsSlice.reducer
