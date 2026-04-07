import type { QuestionComponentProps } from './types'

export default function Question05Budget({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">5) ما رأس المال المبدئي المتوقع؟</h2>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mb-4 w-full rounded-xl border border-divider px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
        placeholder="مثال: 50000"
      />
      <div className="flex flex-wrap gap-2">
        {['20000', '50000', '100000', '250000', '500000'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className="rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-body hover:border-gold"
          >
            {r}
          </button>
        ))}
      </div>
    </>
  )
}
