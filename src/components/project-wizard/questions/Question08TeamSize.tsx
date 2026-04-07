import type { QuestionComponentProps } from './types'

const OPTIONS = ['أنا فقط', '2-3 أفراد', '4-6 أفراد', 'أكثر من 6']

export default function Question08TeamSize({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">8) كم عدد فريق العمل المتوقع؟</h2>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              value === option
                ? 'bg-nile text-white'
                : 'border border-divider bg-offwhite text-body hover:border-nile/40'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  )
}
