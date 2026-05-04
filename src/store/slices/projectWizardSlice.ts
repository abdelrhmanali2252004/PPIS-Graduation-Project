import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import {
  projectAnswersToStep2List,
  type ProjectAnswers,
} from '../../components/project-wizard/questions'
import { apiClient } from '../../api/client'

type SubmitProjectWizardPayload = {
  projectId: string
  answers: ProjectAnswers
}

type ProjectWizardState = {
  loading: boolean
  success: boolean
  error: string | null
}

type SubmitProjectWizardResponse = {
  id: string
  message?: string
}

const initialState: ProjectWizardState = {
  loading: false,
  success: false,
  error: null,
}

export const submitProjectWizard = createAsyncThunk<
  SubmitProjectWizardResponse,
  SubmitProjectWizardPayload,
  { rejectValue: string }
>('projectWizard/submit', async ({ projectId, answers }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<SubmitProjectWizardResponse>(
      '/project/step2',
      {
        projectId,
        answers: projectAnswersToStep2List(answers),
      },
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ??
        'تعذر حفظ إجابات المشروع. حاول مرة أخرى.',
    )
  }
})

const projectWizardSlice = createSlice({
  name: 'projectWizard',
  initialState,
  reducers: {
    resetProjectWizardState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProjectWizard.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(submitProjectWizard.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(submitProjectWizard.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error =
          action.payload ??
          'تعذر حفظ إجابات المشروع. حاول مرة أخرى.'
      })
  },
})

export const { resetProjectWizardState } = projectWizardSlice.actions
export default projectWizardSlice.reducer
