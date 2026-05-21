import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'
import type {
  AllServiceRequestsResponse,
  ServiceRequestRecord,
  ServiceRequestStatus,
} from '../../types/serviceRequest'

type UpdateRequestStatusPayload = {
  requestId: string
  status: ServiceRequestStatus
}

type UpdateRequestStatusResponse = {
  message?: string
  data?: ServiceRequestRecord
}

type AdminRequestsState = {
  requests: ServiceRequestRecord[]
  count: number
  loading: boolean
  error: string | null
  updatingStatusId: string | null
  updateStatusError: string | null
}

const initialState: AdminRequestsState = {
  requests: [],
  count: 0,
  loading: false,
  error: null,
  updatingStatusId: null,
  updateStatusError: null,
}

export const fetchAllAdminRequests = createAsyncThunk<
  AllServiceRequestsResponse,
  void,
  { rejectValue: string }
>('adminRequests/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<AllServiceRequestsResponse>('request/all')
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحميل الطلبات. حاول مرة أخرى.',
    )
  }
})

export const updateAdminRequestStatus = createAsyncThunk<
  UpdateRequestStatusResponse,
  UpdateRequestStatusPayload,
  { rejectValue: string }
>('adminRequests/updateStatus', async ({ requestId, status }, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch<UpdateRequestStatusResponse>(
      `request/${requestId}`,
      { status },
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'تعذر تحديث حالة الطلب. حاول مرة أخرى.',
    )
  }
})

const adminRequestsSlice = createSlice({
  name: 'adminRequests',
  initialState,
  reducers: {
    clearAdminRequestsError: (state) => {
      state.error = null
    },
    clearUpdateStatusError: (state) => {
      state.updateStatusError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdminRequests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAdminRequests.fulfilled, (state, action) => {
        state.loading = false
        state.requests = action.payload.data ?? []
        state.count = action.payload.count ?? state.requests.length
      })
      .addCase(fetchAllAdminRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'تعذر تحميل الطلبات. حاول مرة أخرى.'
      })
      .addCase(updateAdminRequestStatus.pending, (state, action) => {
        state.updatingStatusId = action.meta.arg.requestId
        state.updateStatusError = null
      })
      .addCase(updateAdminRequestStatus.fulfilled, (state, action) => {
        const { requestId, status } = action.meta.arg
        const index = state.requests.findIndex((request) => request._id === requestId)

        if (index !== -1) {
          state.requests[index] = action.payload.data
            ? action.payload.data
            : { ...state.requests[index], status }
        }

        state.updatingStatusId = null
      })
      .addCase(updateAdminRequestStatus.rejected, (state, action) => {
        state.updatingStatusId = null
        state.updateStatusError =
          action.payload ?? 'تعذر تحديث حالة الطلب. حاول مرة أخرى.'
      })
  },
})

export const { clearAdminRequestsError, clearUpdateStatusError } = adminRequestsSlice.actions
export default adminRequestsSlice.reducer
