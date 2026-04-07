import type { QuestionComponentProps } from './types'

export default function Question12Risks({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">12{")"} ما أكبر المخاطر أو التحديات المتوقعة؟</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 250))}
        rows={4}
        placeholder="مثل: التمويل، التوظيف، التوريد، المنافسة..."
        className="w-full rounded-xl border border-divider bg-offwhite px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
      />
      <p className="mt-2 text-left text-xs text-slateMuted">{value.length}/250</p>
    </>
  )
}
