/**
 * Branding wizard — Step 4 API contract
 * POST /api/project/step4
 *
 * Copy this file to the backend (or mirror enums/validation from it).
 */

// ─── Logo style (ستايل اللوجو) ───────────────────────────────────────────────

export type LogoStyle = 'icon' | 'text' | 'mix'

export const LOGO_STYLES = [
  { id: 'icon' as const, labelAr: 'أيقونة ورمز', labelEn: 'Icon / symbol only' },
  { id: 'text' as const, labelAr: 'اسم بخط مميز', labelEn: 'Wordmark / typography only' },
  { id: 'mix' as const, labelAr: 'ميكس بين الاثنين', labelEn: 'Combination (icon + text)' },
] as const

export const LOGO_STYLE_IDS: LogoStyle[] = ['icon', 'text', 'mix']

export const DEFAULT_LOGO_STYLE: LogoStyle = 'mix'

// ─── Brand vibe (روح البراند) ────────────────────────────────────────────────

export type BrandVibe = 'pro' | 'fun' | 'lux' | 'min'

export const BRAND_VIBES = [
  { id: 'pro' as const, titleAr: 'احترافي', descAr: 'ثقة ومؤسسية', labelEn: 'Professional / corporate' },
  { id: 'fun' as const, titleAr: 'مرح وحيوي', descAr: 'ألوان وطاقة', labelEn: 'Fun / energetic' },
  { id: 'lux' as const, titleAr: 'فاخر وراقي', descAr: 'تفاصيل راقية', labelEn: 'Luxury / elegant' },
  { id: 'min' as const, titleAr: 'بسيط وعصري', descAr: 'مساحات وهدوء', labelEn: 'Minimal / modern' },
] as const

export const BRAND_VIBE_IDS: BrandVibe[] = ['pro', 'fun', 'lux', 'min']

export const DEFAULT_BRAND_VIBE: BrandVibe = 'pro'

// ─── Color palette (اختيار الألوان) ────────────────────────────────────────

export type BrandPalette = 'as' | 'nile' | 'sun' | 'ai'

export const BRAND_PALETTES = [
  {
    id: 'as' as const,
    nameAr: 'تراث أسيوط',
    colors: ['#1B4C8C', '#C9A05D', '#F9FAFB', '#111827', '#059669'] as const,
  },
  {
    id: 'nile' as const,
    nameAr: 'نيل هادئ',
    colors: ['#0D2F5E', '#38BDF8', '#E5E7EB', '#1E293B', '#22C55E'] as const,
  },
  {
    id: 'sun' as const,
    nameAr: 'شمس الصعيد',
    colors: ['#B45309', '#FDE68A', '#FFFBEB', '#422006', '#15803D'] as const,
  },
  {
    id: 'ai' as const,
    nameAr: 'AI يختار الألوان',
    colors: [] as const,
  },
] as const

export const BRAND_PALETTE_IDS: BrandPalette[] = ['as', 'nile', 'sun', 'ai']

export const DEFAULT_BRAND_PALETTE: BrandPalette = 'as'

// ─── Target audience (جمهورك مين؟) ───────────────────────────────────────────
// UI stores `AudienceId`; API receives Arabic `AudienceApiValue`.

export type AudienceId = 'youth' | 'kids' | 'business' | 'all'

export type AudienceApiValue = 'شباب' | 'أطفال' | 'رجال أعمال' | 'عامة الناس'

export const AUDIENCE_OPTIONS = [
  { id: 'youth' as const, labelAr: 'شباب', apiValue: 'شباب' as const },
  { id: 'kids' as const, labelAr: 'أطفال', apiValue: 'أطفال' as const },
  { id: 'business' as const, labelAr: 'رجال أعمال', apiValue: 'رجال أعمال' as const },
  { id: 'all' as const, labelAr: 'عامة الناس', apiValue: 'عامة الناس' as const },
] as const

export const AUDIENCE_ID_TO_API: Record<AudienceId, AudienceApiValue> = {
  youth: 'شباب',
  kids: 'أطفال',
  business: 'رجال أعمال',
  all: 'عامة الناس',
}

// ─── Step 1 free text ──────────────────────────────────────────────────────────

export type BrandingStep1Fields = {
  brandName: string
  tagline: string
  businessType: string
  symbolHint: string
}

// ─── Request / response (POST /project/step4) ────────────────────────────────

export type Step4LogoRequest = {
  projectId: string
  brandName: string
  tagline: string
  businessType: string
  /** Arabic label — see AudienceApiValue */
  audience: AudienceApiValue | string
  vibe: BrandVibe
  logoStyle: LogoStyle
  palette: BrandPalette
}

export type Step4LogoResponse = {
  message: string
  logoUrl: string
  relativeUrl?: string
  logoPrompt: string
  data?: {
    _id?: string
    logoUrl?: string
    logoPrompt?: string
    step?: number
  }
}
