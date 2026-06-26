import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import {
  audienceIdToApiValue,
  type BrandPalette,
  type BrandVibe,
  type LogoStyle,
  type Step4LogoRequest,
  type Step4LogoResponse,
} from '../../api/branding'
import { apiClient } from '../../api/client'
import { buildLogoPromptFromUserInputs, optionalTrim } from '../../utils/buildLogoPromptFromUserInputs'

export const BRANDING_STORAGE_KEY = 'ideaTechBrandingData'

export type SavedBranding = {
  logoUrl: string
  logoPrompt: string
  brandName: string
  tagline: string
}

type BrandingState = {
  generating: boolean
  saving: boolean
  error: string | null
  saved: SavedBranding | null
}

function loadFromStorage(): SavedBranding | null {
  try {
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedBranding) : null
  } catch {
    return null
  }
}

function persistBranding(saved: SavedBranding) {
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(saved))
}

const initialState: BrandingState = {
  generating: false,
  saving: false,
  error: null,
  saved: loadFromStorage(),
}

export type GenerateLogoPayload = Omit<
  Step4LogoRequest,
  'audience' | 'vibe' | 'logoStyle' | 'palette' | 'logoPrompt'
> & {
  audience: string
  vibe: string
  logoStyle: string
  palette: string
  symbolHint: string
}

export const generateLogo = createAsyncThunk<
  SavedBranding,
  GenerateLogoPayload,
  { rejectValue: string; state: { branding: BrandingState } }
>('branding/generateLogo', async (payload, { rejectWithValue }) => {
  try {
    const audienceLabel = audienceIdToApiValue(payload.audience)
    const brandName = optionalTrim(payload.brandName)
    const tagline = optionalTrim(payload.tagline)
    const businessType = optionalTrim(payload.businessType)
    const symbolHint = optionalTrim(payload.symbolHint)

    const logoPrompt = buildLogoPromptFromUserInputs({
      brandName: brandName ?? '',
      tagline: tagline ?? '',
      businessType: businessType ?? '',
      audience: payload.audience,
      symbolHint: symbolHint ?? '',
      vibe: payload.vibe,
      logoStyle: payload.logoStyle,
      palette: payload.palette,
    }).trim()

    const body: Step4LogoRequest = {
      projectId: payload.projectId,
      audience: audienceLabel,
      vibe: payload.vibe as BrandVibe,
      logoStyle: payload.logoStyle as LogoStyle,
      palette: payload.palette as BrandPalette,
      ...(brandName ? { brandName } : {}),
      ...(tagline ? { tagline } : {}),
      ...(businessType ? { businessType } : {}),
      ...(symbolHint ? { symbolHint } : {}),
      ...(logoPrompt ? { logoPrompt } : {}),
    }

    const response = await apiClient.post<Step4LogoResponse>(
      'project/step4',
      body,
      { timeout: 300_000 },
    )

    const logoUrl = response.data.logoUrl ?? response.data.relativeUrl ?? ''

    if (!logoUrl) {
      return rejectWithValue('لم يُرجع الخادم رابط اللوجو.')
    }

    const saved: SavedBranding = {
      logoUrl,
      logoPrompt: logoPrompt || brandName || '',
      brandName: brandName ?? '',
      tagline: tagline ?? '',
    }
    persistBranding(saved)
    return saved
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return rejectWithValue(
      axiosError.response?.data?.message ?? 'فشل توليد اللوجو. حاول مرة أخرى.',
    )
  }
}, {
  condition: (_, { getState }) => !getState().branding.generating,
})

type SaveLogoPayload = {
  projectId: string
  logoUrl: string
  logoPrompt: string
  brandName: string
  tagline: string
}

/** @deprecated Prefer generateLogo (step4 persists on the server). Kept for legacy blob URLs. */
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
    persistBranding(saved)
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
    setBrandingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLogo.pending, (state) => {
        state.generating = true
        state.error = null
      })
      .addCase(generateLogo.fulfilled, (state, action) => {
        state.generating = false
        state.saved = action.payload
      })
      .addCase(generateLogo.rejected, (state, action) => {
        state.generating = false
        state.error = action.payload ?? 'فشل توليد اللوجو.'
      })
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

export const { clearSavedBranding, setBrandingError } = brandingSlice.actions
export default brandingSlice.reducer
