import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'
import type { FeasibilityStudyResponse } from '../../types/feasibilityStudy'

export type {
  FeasibilityStudyCosts,
  FeasibilityStudyResponse,
  FinancialBreakdownItem,
  FinancialDashboard,
  FinancialKpis,
  MonthlyFinancialProjection,
} from '../../types/feasibilityStudy'

export type FeasibilityStep3Response = {
  message: string
  prompt: string
  res: FeasibilityStudyResponse
  marketResearchUsed: boolean
}

type FeasibilityState = {
  loading: boolean
  error: string | null
  data: FeasibilityStep3Response | null
}

const initialState: FeasibilityState = {
  loading: false,
  error: null,
  data: null,
}

export const fetchFeasibilityStep3 = createAsyncThunk<
  FeasibilityStep3Response,
  string,
  { rejectValue: string }
>('feasibility/fetchStep3', async (projectId, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<FeasibilityStep3Response>(
      '/project/step3',
      { projectId },
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ??
        'تعذر تحميل دراسة الجدوى. حاول مرة أخرى.',
    )
  }
})

const feasibilitySlice = createSlice({
  name: 'feasibility',
  initialState,
  reducers: {
    clearFeasibility: (state) => {
      state.loading = false
      state.error = null
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeasibilityStep3.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeasibilityStep3.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchFeasibilityStep3.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload ?? 'تعذر تحميل دراسة الجدوى. حاول مرة أخرى.'
      })
  },
})

export const { clearFeasibility } = feasibilitySlice.actions
export default feasibilitySlice.reducer
