import type { QuestionComponentProps } from './types'

export default function Question11SalesTarget({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">11) ما هدف المبيعات الشهري في أول سنة؟</h2>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="مثال: 120000"
        className="w-full rounded-xl border border-divider px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
      />
    </>
  )
}
