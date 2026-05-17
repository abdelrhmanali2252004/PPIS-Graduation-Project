import { AUDIENCE_ID_TO_API, type AudienceId, type Step4LogoRequest } from '../types/brandingStep4'

export type { Step4LogoRequest, Step4LogoResponse } from '../types/brandingStep4'
export type {
  LogoStyle,
  BrandVibe,
  BrandPalette,
  AudienceId,
  AudienceApiValue,
  BrandingStep1Fields,
} from '../types/brandingStep4'
export {
  LOGO_STYLES,
  LOGO_STYLE_IDS,
  DEFAULT_LOGO_STYLE,
  BRAND_VIBES,
  BRAND_VIBE_IDS,
  DEFAULT_BRAND_VIBE,
  BRAND_PALETTES,
  BRAND_PALETTE_IDS,
  DEFAULT_BRAND_PALETTE,
  AUDIENCE_OPTIONS,
  AUDIENCE_ID_TO_API,
} from '../types/brandingStep4'

/** @deprecated Use AUDIENCE_ID_TO_API */
export const AUDIENCE_API_LABELS = AUDIENCE_ID_TO_API

const fallbackApiBase = 'http://localhost:8090/api'

/** Turn `/uploads/...` or blob URLs into a browser-loadable src. */
export function resolveLogoUrl(logoUrl: string): string {
  if (!logoUrl) return logoUrl
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://') || logoUrl.startsWith('blob:')) {
    return logoUrl
  }
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? fallbackApiBase
  const origin = apiBase.replace(/\/api\/?$/, '')
  return `${origin}${logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`}`
}

export function audienceIdToApiValue(audienceId: string): string {
  return AUDIENCE_ID_TO_API[audienceId as AudienceId] ?? audienceId
}

export async function downloadLogoFile(displayUrl: string, filename: string): Promise<void> {
  try {
    const res = await fetch(displayUrl)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    a.click()
    URL.revokeObjectURL(objectUrl)
  } catch {
    const a = document.createElement('a')
    a.href = displayUrl
    a.download = filename
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }
}

/** @deprecated Use Step4LogoRequest */
export type Step4LogoPayload = Step4LogoRequest
