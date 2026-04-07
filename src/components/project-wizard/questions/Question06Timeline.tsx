import type { QuestionComponentProps } from './types'

const OPTIONS = ['خلال شهر', '1-3 أشهر', '3-6 أشهر', 'أكثر من 6 أشهر']

export default function Question06Timeline({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">6) متى تخطط لإطلاق المشروع؟</h2>
      <div className="space-y-2">
        {OPTIONS.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-divider bg-offwhite px-3 py-2 text-sm">
            <input
              type="radio"
              name="timeline"
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-nile"
            />
            {option}
          </label>
        ))}
      </div>
    </>
  )
}
