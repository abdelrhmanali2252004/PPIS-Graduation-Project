import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { apiClient } from '../../api/client'

export const BRANDING_STORAGE_KEY = 'ideaTechBrandingData'

export type SavedBranding = {
  logoUrl: string
  logoPrompt: string
  brandName: string
  tagline: string
}

type BrandingState = {
  saving: boolean
  error: string | null
  saved: SavedBranding | null
}

// Persist branding locally so the user sees it on return even before API responds
function loadFromStorage(): SavedBranding | null {
  try {
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedBranding) : null
  } catch {
    return null
  }
}

const initialState: BrandingState = {
  saving: false,
  error: null,
  saved: loadFromStorage(),
}

type SaveLogoPayload = {
  projectId: string
  logoUrl: string
  logoPrompt: string
  brandName: string
  tagline: string
}

export const saveLogo = createAsyncThunk<
  SavedBranding,
  SaveLogoPayload,
  { rejectValue: string }
>('branding/saveLogo', async (payload, { rejectWithValue }) => {
  try {
    await apiClient.post('project/save-logo', {
      projectId: payload.projectId,
      logoUrl: payload.logoUrl,
      logoPrompt: payload.logoPrompt,
    })
    const saved: SavedBranding = {
      logoUrl: payload.logoUrl,
      logoPrompt: payload.logoPrompt,
      brandName: payload.brandName,
      tagline: payload.tagline,
    }
    localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(saved))
    return saved
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'فشل حفظ اللوجو. حاول مرة أخرى.',
    )
  }
})

const brandingSlice = createSlice({
  name: 'branding',
  initialState,
  reducers: {
    clearSavedBranding: (state) => {
      state.saved = null
      state.error = null
      localStorage.removeItem(BRANDING_STORAGE_KEY)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveLogo.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveLogo.fulfilled, (state, action) => {
        state.saving = false
        state.saved = action.payload
      })
      .addCase(saveLogo.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'فشل حفظ اللوجو.'
      })
  },
})

export const { clearSavedBranding } = brandingSlice.actions
export default brandingSlice.reducer
