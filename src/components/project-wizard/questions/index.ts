import type { ReactElement } from 'react'
import Question01Idea from './Question01Idea'
import Question02Sector from './Question02Sector'
import Question03Audience from './Question03Audience'
import Question04Location from './Question04Location'
import Question05Budget from './Question05Budget'
import Question06Timeline from './Question06Timeline'
import Question07Experience from './Question07Experience'
import Question08TeamSize from './Question08TeamSize'
import Question09Differentiation from './Question09Differentiation'
import Question10PricingModel from './Question10PricingModel'
import Question11SalesTarget from './Question11SalesTarget'
import Question12Risks from './Question12Risks'
import type { ProjectAnswerKey } from './types'

export const QUESTION_ITEMS: Array<{
  key: ProjectAnswerKey
  Component: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => ReactElement
}> = [
  { key: 'idea', Component: Question01Idea },
  { key: 'sector', Component: Question02Sector },
  { key: 'audience', Component: Question03Audience },
  { key: 'location', Component: Question04Location },
  { key: 'budget', Component: Question05Budget },
  { key: 'timeline', Component: Question06Timeline },
  { key: 'experience', Component: Question07Experience },
  { key: 'teamSize', Component: Question08TeamSize },
  { key: 'differentiation', Component: Question09Differentiation },
  { key: 'pricingModel', Component: Question10PricingModel },
  { key: 'monthlySalesTarget', Component: Question11SalesTarget },
  { key: 'risks', Component: Question12Risks },
]

export type { ProjectAnswers, ProjectAnswerKey } from './types'
