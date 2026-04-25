import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'

type RequestType = 'MARKET_RESEARCH' | 'MANUAL_LOGO' | 'CONSULTATION'

type CreateRequestPayload = {
  projectId: string
  type: RequestType
}

type CreateRequestResponse = {
  message: string
  data: {
    _id: string
    projectId: string
    type: RequestType
    status: string
  }
}

type ServiceRequestState = {
  creating: boolean
  error: string | null
  lastRequestId: string | null
}

const initialState: ServiceRequestState = {
  creating: false,
  error: null,
  lastRequestId: null,
}

export const createServiceRequest = createAsyncThunk<
  CreateRequestResponse,
  CreateRequestPayload,
  { rejectValue: string }
>('serviceRequest/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<CreateRequestResponse>(
      'request/create-request',
      payload,
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'فشل إرسال الطلب. حاول مرة أخرى.',
    )
  }
})

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    clearServiceRequestError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceRequest.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.creating = false
        state.error = null
        state.lastRequestId = action.payload.data._id
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload ?? 'فشل إرسال الطلب. حاول مرة أخرى.'
      })
  },
})

export const { clearServiceRequestError } = serviceRequestSlice.actions
export default serviceRequestSlice.reducer
