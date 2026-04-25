import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import type { ProjectAnswers } from '../../components/project-wizard/questions'
import { apiClient } from '../../api/client'

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
  ProjectAnswers,
  { rejectValue: string }
>('projectWizard/submit', async (answers, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<SubmitProjectWizardResponse>(
      '/projects/wizard',
      answers,
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ??
        'Could not submit project wizard. Please try again.',
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
          'Could not submit project wizard. Please try again later.'
      })
  },
})

export const { resetProjectWizardState } = projectWizardSlice.actions
export default projectWizardSlice.reducer
