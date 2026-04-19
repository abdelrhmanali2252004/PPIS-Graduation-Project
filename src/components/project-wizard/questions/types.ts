export type ProjectAnswerKey =
  | 'idea'
  | 'sector'
  | 'legalStatus'
  | 'audience'
  | 'geoScope'
  | 'customerReason'
  | 'marketState'
  | 'competitors'
  | 'deliveryChannel'
  | 'revenueModel'
  | 'acquisitionChannel'
  | 'techNeed'
  | 'location'
  | 'budget'
  | 'fundingSource'
  | 'topExpense'
  | 'experience'
  | 'teamSize'
  | 'differentiation'
  | 'pricingModel'
  | 'monthlySalesTarget'
  | 'demandOutlook'
  | 'seasonality'
  | 'risks'
  | 'twoYearGoal'

export type ProjectAnswers = Record<ProjectAnswerKey, string>

export type QuestionInputType = 'text' | 'textarea' | 'options'

export type QuestionItem = {
  key: ProjectAnswerKey
  stage: string
  title: string
  helpText?: string
  inputType: QuestionInputType
  placeholder?: string
  maxLength?: number
  options?: string[]
}

export type QuestionComponentProps = {
  value: string
  onChange: (value: string) => void
}
