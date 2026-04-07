export type ProjectAnswerKey =
  | 'idea'
  | 'sector'
  | 'audience'
  | 'location'
  | 'budget'
  | 'timeline'
  | 'experience'
  | 'teamSize'
  | 'differentiation'
  | 'pricingModel'
  | 'monthlySalesTarget'
  | 'risks'

export type ProjectAnswers = Record<ProjectAnswerKey, string>

export type QuestionComponentProps = {
  value: string
  onChange: (value: string) => void
}
