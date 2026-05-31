import type { ProjectAnswers } from '../components/project-wizard/questions'

export function createEmptyProjectAnswers(): ProjectAnswers {
  return {
    idea_name: '',
    idea: '',
    sector: '',
    legalStatus: '',
    audience: '',
    geoScope: '',
    customerReason: '',
    marketState: '',
    competitors: '',
    deliveryChannel: '',
    revenueModel: '',
    acquisitionChannel: '',
    techNeed: '',
    location: '',
    budget: '',
    fundingSource: '',
    topExpense: '',
    experience: '',
    teamSize: '',
    differentiation: '',
    pricingModel: '',
    monthlySalesTarget: '',
    demandOutlook: '',
    seasonality: '',
    risks: '',
    twoYearGoal: '',
  }
}

export type BrandingFormState = {
  sub: number
  brandName: string
  tagline: string
  businessType: string
  audience: string
  symbolHint: string
  vibe: string
  palette: string
  logoStyle: string
  accordionOpen: boolean
  sent: boolean
}

export const DEFAULT_BRANDING_FORM: BrandingFormState = {
  sub: 0,
  brandName: '',
  tagline: '',
  businessType: 'technology',
  audience: 'youth',
  symbolHint: '',
  vibe: 'pro',
  palette: 'as',
  logoStyle: 'mix',
  accordionOpen: false,
  sent: false,
}
