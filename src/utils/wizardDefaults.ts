import type { ProjectAnswers } from '../components/project-wizard/questions'

/** Sample answers for development / demo — matches valid option labels in QUESTION_ITEMS. */
export const DEFAULT_PROJECT_ANSWERS: ProjectAnswers = {
  idea_name: 'مقهى النيل',
  idea: 'مقهى عصري يقدم قهوة مختصة ومشروبات صحية لطلاب الجامعات ورواد الأعمال في أسيوط، مع مساحة هادئة للعمل والدراسة.',
  sector: 'مطعم',
  legalStatus: 'بدأت في التراخيص',
  audience: 'أفراد',
  geoScope: 'محافظة',
  customerReason: 'جودتي أعلى',
  marketState: 'سوق عليه طلب عالي',
  competitors: 'محلات مشابهة في المنطقة',
  deliveryChannel: 'ميكس بين أكثر من قناة',
  revenueModel: 'بيع مباشر',
  acquisitionChannel: 'سوشيال ميديا',
  techNeed: 'متوسط (موقع أو نظام تشغيل)',
  location: 'متوفرين لكن غاليين',
  budget: 'حتى 500 ألف',
  fundingSource: 'تحويشة شخصية',
  topExpense: 'إيجار',
  experience: 'عندنا خبرة عملية',
  teamSize: 'فريق صغير جدا (2-5)',
  differentiation: 'قهوة مختصة ومساحة عمل مريحة بأسعار مناسبة للشباب',
  pricingModel: 'التكلفة + هامش ربح',
  monthlySalesTarget: 'حتى 50 ألف',
  demandOutlook: 'عالي جدا',
  seasonality: 'شغال طول السنة',
  risks: 'منافس قوي',
  twoYearGoal: 'فتح فروع جديدة',
}

export function createDefaultProjectAnswers(): ProjectAnswers {
  return { ...DEFAULT_PROJECT_ANSWERS }
}

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
