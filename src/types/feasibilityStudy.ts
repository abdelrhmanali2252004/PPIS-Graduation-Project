/** Matches backend `feasibilityJsonOutputContract()` in `prompt.service.js`. */

export interface FeasibilityStudyCosts {
  establishment: string
  operating: string
}

export interface FinancialBreakdownItem {
  key: string
  labelAr: string
  amount: number
  /** Omitted on revenue/cost items — computed from amount ÷ group total */
  percentage?: number
  details?: string
}

export interface MonthlyFinancialProjection {
  month: number
  labelAr: string
  revenue: number
  totalCost: number
  netProfit: number
}

export interface FinancialKpis {
  breakEvenPoint: string
  monthlyRevenue: number
  monthlyNetProfit: number
  monthlyOperatingCosts: number
  profitMarginPercent?: number
}

export interface FinancialDashboard {
  currency: 'EGP'
  kpis: FinancialKpis
  monthlyProjections: MonthlyFinancialProjection[]
  capitalDistribution: {
    total: number
    items: FinancialBreakdownItem[]
  }
  revenueSources: {
    totalMonthly: number
    items: FinancialBreakdownItem[]
  }
  operatingCostsBreakdown: {
    totalMonthly: number
    items: FinancialBreakdownItem[]
  }
}

export interface FeasibilityStudyResponse {
  executiveSummary: string
  marketAndCustomersAnalysis: string
  competitorsAnalysis: string
  operationsModel: string
  marketingAndSalesPlan: string
  costs: FeasibilityStudyCosts
  revenueAndProfitOutlook: string
  risksAndMitigation: string
  recommendations: string
  ninetyDayActionPlan: string
  financialDashboard?: FinancialDashboard
}
