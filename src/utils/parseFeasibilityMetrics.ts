import type { FeasibilityStudyResponse } from '../store/slices/feasibilitySlice'

export type DashboardAlert = {
  type: 'risk' | 'opportunity' | 'positive' | 'action'
  title: string
  body: string
}

export type MetricSlice = {
  label: string
  percent: number
  amount: number
  color: string
}

export type MonthForecast = {
  month: string
  revenue: number
  costs: number
  profit: number
}

export type DashboardMetrics = {
  totalCapital: number
  startupCosts: number
  operatingReserve: number
  monthlyRevenue: number
  monthlyOperatingCosts: number
  monthlyNetProfit: number
  costOfSales: number
  breakEvenWeeks: string
  startupPercent: number
  reservePercent: number
  profitMarginPercent: number
  costsPercentOfRevenue: number
  revenueSources: MetricSlice[]
  operatingBreakdown: MetricSlice[]
  sixMonthForecast: MonthForecast[]
  alerts: DashboardAlert[]
  sectorLabel: string
  teamSizeLabel: string
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'
const MONTH_LABELS = ['الشهر ١', 'الشهر ٢', 'الشهر ٣', 'الشهر ٤', 'الشهر ٥', 'الشهر ٦']

function toWesternDigits(input: string): string {
  return input.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
}

function parseAmountToken(raw: string, context: string): number | null {
  const normalized = toWesternDigits(raw).replace(/,/g, '').trim()
  const num = parseFloat(normalized)
  if (!Number.isFinite(num) || num <= 0) return null

  const ctx = context.toLowerCase()
  if (/\b(k|ألف|الف|الاف)\b/i.test(ctx) && num < 10_000) {
    return num * 1_000
  }
  if (/\b(مليون|million|m)\b/i.test(ctx) && num < 10_000) {
    return num * 1_000_000
  }
  return num
}

/** Extract EGP-like amounts from Arabic/English feasibility prose. */
export function extractAmounts(text: string): number[] {
  if (!text?.trim()) return []

  const western = toWesternDigits(text)
  const amounts: number[] = []
  const patterns = [
    /([\d][\d.,]*)\s*(?:ج\.?\s*م|جنيه|egp|جنية)/gi,
    /(?:ج\.?\s*م|جنيه|egp)\s*[:：]?\s*([\d][\d.,]*)/gi,
    /([\d][\d.,]*)\s*(?:ألف|الف|الاف|k)\b/gi,
    /([\d][\d.,]*)\s*(?:مليون|million)\b/gi,
    /([\d]{2,})(?:\s*[-–]\s*([\d]{2,}))?\s*(?:ألف|الف)/gi,
  ]

  for (const pattern of patterns) {
    let match: RegExpExecArray | null
    const re = new RegExp(pattern.source, pattern.flags)
    while ((match = re.exec(western)) !== null) {
      const ctx = western.slice(Math.max(0, match.index - 24), match.index + match[0].length + 24)
      const primary = parseAmountToken(match[1], ctx)
      if (primary) amounts.push(primary)
      if (match[2]) {
        const secondary = parseAmountToken(match[2], ctx)
        if (secondary) amounts.push(secondary)
      }
    }
  }

  return [...new Set(amounts)].sort((a, b) => b - a)
}

function firstAmount(text: string, fallback: number): number {
  const found = extractAmounts(text)
  return found[0] ?? fallback
}

function inferBudgetCapital(text: string): number | null {
  if (/أكثر من 2 مليون|أكثر من ٢ مليون/i.test(text)) return 2_500_000
  if (/حتى 2 مليون|حتى ٢ مليون/i.test(text)) return 2_000_000
  if (/حتى 500 ألف|حتى ٥٠٠ ألف|500\s*ألف/i.test(text)) return 500_000
  if (/أقل من 100 ألف|أقل من ١٠٠ ألف/i.test(text)) return 80_000
  return null
}

function inferBreakEven(text: string): string {
  const weekMatch = text.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:أسبوع|اسبوع|week)/i)
  if (weekMatch) return `${weekMatch[1]}-${weekMatch[2]} أسابيع`
  const singleWeek = text.match(/(\d+)\s*(?:أسبوع|اسبوع|week)/i)
  if (singleWeek) return `${singleWeek[1]} أسابيع`
  const monthMatch = text.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:شهر|month)/i)
  if (monthMatch) return `${monthMatch[1]}-${monthMatch[2]} أشهر`
  return '6-8 أسابيع'
}

function inferSectorLabel(study: FeasibilityStudyResponse): string {
  const blob = [
    study.executiveSummary,
    study.marketAndCustomersAnalysis,
    study.operationsModel,
  ]
    .join(' ')
    .toLowerCase()

  if (/مطعم|مأكول|كافيه|fast casual|وجبات/i.test(blob)) return 'مطعم سريع الخدمة'
  if (/تجارة|متجر|retail/i.test(blob)) return 'تجارة تجزئة'
  if (/تعليم|تدريب/i.test(blob)) return 'تعليم وتدريب'
  if (/تقنية|برمج|saas|تطبيق/i.test(blob)) return 'تقنية وبرمجيات'
  if (/خدمات/i.test(blob)) return 'خدمات مهنية'
  if (/صناعة|مصنع/i.test(blob)) return 'صناعة'
  return 'مشروع ريادي'
}

function inferTeamSize(study: FeasibilityStudyResponse): string {
  const blob = [study.operationsModel, study.executiveSummary].join(' ')
  if (/لوحدي|فرد واحد/i.test(blob)) return 'رائد أعمال منفرد'
  if (/6-20|شركة صغيرة/i.test(blob)) return 'فريق 6-20'
  if (/أكثر من 20|كيان كبير/i.test(blob)) return 'فريق +20'
  if (/2-5|فريق صغير/i.test(blob)) return 'فريق 2-5'
  return 'فريق 2-5'
}

function buildRevenueSources(
  marketing: string,
  revenue: number,
): MetricSlice[] {
  const text = marketing.toLowerCase()
  let direct = 55
  let delivery = 30
  let catering = 15

  if (/توصيل|ديليفري|طلبات/i.test(text)) delivery = Math.max(delivery, 35)
  if (/كاترينج|مناسبات|فعاليات/i.test(text)) catering = Math.max(catering, 20)
  if (/محل|فرع|مباشر|داخل/i.test(text)) direct = Math.max(direct, 50)
  if (/أونلاين|اونلاين|تطبيق/i.test(text)) delivery = Math.max(delivery, 25)

  const total = direct + delivery + catering
  direct = Math.round((direct / total) * 100)
  delivery = Math.round((delivery / total) * 100)
  catering = 100 - direct - delivery

  return [
    {
      label: 'مبيعات مباشرة في الفرع',
      percent: direct,
      amount: Math.round((revenue * direct) / 100),
      color: '#1B4C8C',
    },
    {
      label: 'تطبيقات التوصيل',
      percent: delivery,
      amount: Math.round((revenue * delivery) / 100),
      color: '#C9A05D',
    },
    {
      label: 'تموين ومناسبات',
      percent: catering,
      amount: Math.round((revenue * catering) / 100),
      color: '#059669',
    },
  ]
}

function buildOperatingBreakdown(operatingText: string, total: number): MetricSlice[] {
  const text = operatingText.toLowerCase()
  let materials = 40
  let salaries = 30
  let rent = 18
  let delivery = 12

  if (/مرتبات|رواتب|أجور/i.test(text)) salaries = Math.max(salaries, 32)
  if (/إيجار|rent/i.test(text)) rent = Math.max(rent, 22)
  if (/خامات|مواد|تكلفة المبيعات/i.test(text)) materials = Math.max(materials, 45)
  if (/توصيل|شحن/i.test(text)) delivery = Math.max(delivery, 15)

  const sum = materials + salaries + rent + delivery
  materials = Math.round((materials / sum) * 100)
  salaries = Math.round((salaries / sum) * 100)
  rent = Math.round((rent / sum) * 100)
  delivery = 100 - materials - salaries - rent

  return [
    {
      label: 'مواد خام وتكلفة مبيعات',
      percent: materials,
      amount: Math.round((total * materials) / 100),
      color: '#1B4C8C',
    },
    {
      label: 'مرتبات وفريق',
      percent: salaries,
      amount: Math.round((total * salaries) / 100),
      color: '#C9A05D',
    },
    {
      label: 'إيجار وخدمات',
      percent: rent,
      amount: Math.round((total * rent) / 100),
      color: '#059669',
    },
    {
      label: 'عمولات توصيل',
      percent: delivery,
      amount: Math.round((total * delivery) / 100),
      color: '#F97316',
    },
  ]
}

function buildAlerts(study: FeasibilityStudyResponse, metrics: DashboardMetrics): DashboardAlert[] {
  const alerts: DashboardAlert[] = []
  const risks = study.risksAndMitigation?.trim()
  const recs = study.recommendations?.trim()

  if (risks) {
    const riskLine = risks.split(/[.\n]/).find((s) => s.trim().length > 20)?.trim()
    if (riskLine) {
      alerts.push({
        type: 'risk',
        title: 'مخاطرة عالية',
        body: riskLine.slice(0, 120) + (riskLine.length > 120 ? '…' : ''),
      })
    }
  }

  const market = study.marketAndCustomersAnalysis ?? ''
  if (/طلب|فرصة|نمو|ارتفاع/i.test(market)) {
    alerts.push({
      type: 'opportunity',
      title: 'فرصة سوق',
      body: market.split(/[.\n]/)[0]?.trim().slice(0, 120) || 'يوجد طلب متزايد في شريحتك المستهدفة.',
    })
  }

  alerts.push({
    type: 'positive',
    title: 'نقطة التعادل',
    body: `من المتوقع الوصول لنقطة التعادل خلال ${metrics.breakEvenWeeks} وفق توقعات الدراسة.`,
  })

  const plan = study.ninetyDayActionPlan?.trim()
  if (plan) {
    alerts.push({
      type: 'action',
      title: 'إجراء مقترح',
      body: plan.split(/[.\n]/)[0]?.trim().slice(0, 120) || 'راجع خطة الـ 90 يوماً لجدولة المهام القادمة.',
    })
  } else if (recs) {
    alerts.push({
      type: 'action',
      title: 'إجراء مقترح',
      body: recs.split(/[.\n]/)[0]?.trim().slice(0, 120) || 'نفّذ التوصيات القصيرة المدى من الدراسة.',
    })
  }

  return alerts.slice(0, 4)
}

function buildSixMonthForecast(
  revenue: number,
  costs: number,
  profit: number,
): MonthForecast[] {
  return MONTH_LABELS.map((month, i) => {
    const growth = 1 + i * 0.04
    const rev = Math.round(revenue * growth)
    const c = Math.round(costs * (0.95 + i * 0.02))
    return {
      month,
      revenue: rev,
      costs: c,
      profit: Math.max(0, rev - c) || Math.round(profit * growth),
    }
  })
}

export function parseFeasibilityMetrics(
  study: FeasibilityStudyResponse | null | undefined,
): DashboardMetrics | null {
  if (!study) return null

  const combined = [
    study.executiveSummary,
    study.costs?.establishment,
    study.costs?.operating,
    study.revenueAndProfitOutlook,
    study.marketingAndSalesPlan,
    study.operationsModel,
  ]
    .filter(Boolean)
    .join('\n')

  const establishment = study.costs?.establishment ?? ''
  const operating = study.costs?.operating ?? ''
  const revenueText = study.revenueAndProfitOutlook ?? ''

  const budgetCapital = inferBudgetCapital(combined)
  const allAmounts = extractAmounts(combined)

  let totalCapital =
    budgetCapital ??
    (firstAmount(establishment, 0) || (allAmounts.length ? allAmounts[0] : 500_000))

  let startupCosts = firstAmount(establishment, 0)
  if (!startupCosts || startupCosts > totalCapital) {
    startupCosts = Math.round(totalCapital * 0.6)
  }

  let operatingReserve = totalCapital - startupCosts
  if (operatingReserve <= 0) {
    operatingReserve = Math.round(totalCapital * 0.4)
    startupCosts = totalCapital - operatingReserve
  }

  let monthlyRevenue = firstAmount(revenueText, 0)
  if (!monthlyRevenue) {
    const mid = allAmounts.find((a) => a >= 20_000 && a <= totalCapital * 0.8)
    monthlyRevenue = mid ?? Math.round(totalCapital * 0.4)
  }

  let monthlyOperatingCosts = firstAmount(operating, 0)
  if (!monthlyOperatingCosts) {
    monthlyOperatingCosts = Math.round(monthlyRevenue * 0.75)
  }

  if (monthlyOperatingCosts >= monthlyRevenue) {
    monthlyOperatingCosts = Math.round(monthlyRevenue * 0.75)
  }

  const monthlyNetProfit = Math.max(0, monthlyRevenue - monthlyOperatingCosts)
  const costOfSales = Math.round(monthlyOperatingCosts * 0.6)

  const startupPercent = Math.round((startupCosts / totalCapital) * 100)
  const reservePercent = 100 - startupPercent
  const profitMarginPercent =
    monthlyRevenue > 0 ? Math.round((monthlyNetProfit / monthlyRevenue) * 100) : 0
  const costsPercentOfRevenue =
    monthlyRevenue > 0 ? Math.round((monthlyOperatingCosts / monthlyRevenue) * 100) : 0

  const metrics: DashboardMetrics = {
    totalCapital,
    startupCosts,
    operatingReserve,
    monthlyRevenue,
    monthlyOperatingCosts,
    monthlyNetProfit,
    costOfSales,
    breakEvenWeeks: inferBreakEven(combined),
    startupPercent,
    reservePercent,
    profitMarginPercent,
    costsPercentOfRevenue,
    revenueSources: buildRevenueSources(study.marketingAndSalesPlan ?? '', monthlyRevenue),
    operatingBreakdown: buildOperatingBreakdown(operating, monthlyOperatingCosts),
    sixMonthForecast: buildSixMonthForecast(monthlyRevenue, costOfSales, monthlyNetProfit),
    alerts: [],
    sectorLabel: inferSectorLabel(study),
    teamSizeLabel: inferTeamSize(study),
  }

  metrics.alerts = buildAlerts(study, metrics)
  return metrics
}

export function formatEgp(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M ج.م`
  }
  if (compact && amount >= 1_000) {
    return `${Math.round(amount / 1_000)}K ج.م`
  }
  return `${amount.toLocaleString('ar-EG')} ج.م`
}
