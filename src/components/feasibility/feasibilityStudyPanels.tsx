import type { ReactNode } from 'react'
import type { FeasibilityStudyResponse } from '../../store/slices/feasibilitySlice'

export const FEASIBILITY_STUDY_TABS = [
  { id: 'summary', label: 'الملخص التنفيذي' },
  { id: 'market', label: 'تحليل السوق' },
  { id: 'financial', label: 'نصوص مالية' },
  { id: 'tech', label: 'التشغيل والتسويق' },
  { id: 'risks', label: 'المخاطر والتوصيات' },
] as const

export type FeasibilityStudyTabId = (typeof FEASIBILITY_STUDY_TABS)[number]['id']

function toDisplayString(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export function FeasibilityProse({ text }: { text?: unknown }) {
  const s = toDisplayString(text)
  if (!s.trim()) {
    return <p className="text-sm text-slateMuted">لا يوجد نص لهذا القسم.</p>
  }
  return (
    <p className="whitespace-pre-wrap text-sm leading-7 text-body/90">{s}</p>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-nile">{title}</h3>
      {children}
    </div>
  )
}

export function FeasibilityStudyTabPanel({
  tab,
  res,
}: {
  tab: FeasibilityStudyTabId
  res: FeasibilityStudyResponse
}) {
  if (tab === 'summary') {
    return (
      <div className="space-y-4">
        <FeasibilityProse text={res.executiveSummary} />
      </div>
    )
  }

  if (tab === 'market') {
    return (
      <div className="space-y-8">
        <Section title="تحليل السوق والعملاء">
          <FeasibilityProse text={res.marketAndCustomersAnalysis} />
        </Section>
        <Section title="تحليل المنافسين">
          <FeasibilityProse text={res.competitorsAnalysis} />
        </Section>
      </div>
    )
  }

  if (tab === 'financial') {
    return (
      <div className="space-y-8">
        <Section title="تكاليف التأسيس">
          <FeasibilityProse text={res.costs?.establishment} />
        </Section>
        <Section title="تكاليف التشغيل">
          <FeasibilityProse text={res.costs?.operating} />
        </Section>
        <Section title="توقعات الإيرادات والأرباح">
          <FeasibilityProse text={res.revenueAndProfitOutlook} />
        </Section>
      </div>
    )
  }

  if (tab === 'tech') {
    return (
      <div className="space-y-8">
        <Section title="نموذج التشغيل والتنفيذ">
          <FeasibilityProse text={res.operationsModel} />
        </Section>
        <Section title="خطة التسويق والمبيعات">
          <FeasibilityProse text={res.marketingAndSalesPlan} />
        </Section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Section title="تحليل المخاطر وخطط التخفيف">
        <FeasibilityProse text={res.risksAndMitigation} />
      </Section>
      <Section title="التوصيات">
        <FeasibilityProse text={res.recommendations} />
      </Section>
      <Section title="خطة عمل 90 يومًا">
        <FeasibilityProse text={res.ninetyDayActionPlan} />
      </Section>
    </div>
  )
}
