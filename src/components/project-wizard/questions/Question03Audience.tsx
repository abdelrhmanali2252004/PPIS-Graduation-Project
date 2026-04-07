import type { QuestionComponentProps } from './types'

export default function Question03Audience({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">3) من هو العميل المستهدف؟</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 220))}
        rows={4}
        placeholder="مثل: طلاب الجامعة، العائلات، الموظفون..."
        className="w-full rounded-xl border border-divider bg-offwhite px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
      />
      <p className="mt-2 text-left text-xs text-slateMuted">{value.length}/220</p>
    </>
  )
}
