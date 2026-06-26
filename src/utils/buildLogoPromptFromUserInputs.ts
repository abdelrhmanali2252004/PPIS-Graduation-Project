import {
  audienceIdToApiValue,
  type BrandPalette,
  type BrandVibe,
  type LogoStyle,
} from '../api/branding'

export type LogoUserInputs = {
  brandName: string
  tagline: string
  businessType: string
  audience: string
  symbolHint: string
  vibe: string
  logoStyle: string
  palette: string
}

const VIBE_PROMPT_LABELS: Record<BrandVibe, string> = {
  pro: 'Professional / corporate — trust and institutional tone',
  fun: 'Fun / energetic — lively colors and dynamic energy',
  lux: 'Luxury / elegant — refined premium details',
  min: 'Minimal / modern — calm spacing and simplicity',
}

const LOGO_STYLE_PROMPT_LABELS: Record<LogoStyle, string> = {
  icon: 'Icon / symbol only',
  text: 'Wordmark / typography only',
  mix: 'Combination mark — balanced icon plus brand name text',
}

function palettePromptLabel(paletteId: string): string {
  if (paletteId === 'ai') return 'ai'
  return paletteId
}

/**
 * Builds a short logo prompt from user answers only.
 * Empty optional fields are omitted. Returns "" when nothing to send
 * so the backend can build the prompt itself.
 */
export function buildLogoPromptFromUserInputs(input: LogoUserInputs): string {
  const segments: string[] = []

  const brandName = input.brandName.trim()
  if (brandName) {
    segments.push(`Brand name: ${brandName}`)
  }

  const tagline = input.tagline.trim()
  if (tagline) {
    segments.push(`Tagline: ${tagline}`)
  }

  const businessType = input.businessType.trim()
  if (businessType) {
    segments.push(`Business type: ${businessType}`)
  }

  const audience = audienceIdToApiValue(input.audience) || input.audience.trim()
  if (audience) {
    segments.push(`Audience: ${audience}`)
  }

  const symbolHint = input.symbolHint.trim()
  if (symbolHint) {
    segments.push(`Symbol hint: ${symbolHint}`)
  }

  const vibe = input.vibe as BrandVibe
  if (VIBE_PROMPT_LABELS[vibe]) {
    segments.push(`Brand vibe: ${VIBE_PROMPT_LABELS[vibe]}`)
  }

  const logoStyle = input.logoStyle as LogoStyle
  if (LOGO_STYLE_PROMPT_LABELS[logoStyle]) {
    segments.push(`Logo style: ${LOGO_STYLE_PROMPT_LABELS[logoStyle]}`)
  }

  const palette = input.palette as BrandPalette | string
  if (palette) {
    segments.push(`Color palette: ${palettePromptLabel(palette)}`)
  }

  return segments.join('. ')
}

export function optionalTrim(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed || undefined
}
