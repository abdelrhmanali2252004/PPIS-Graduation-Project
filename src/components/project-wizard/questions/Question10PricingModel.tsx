import type { QuestionComponentProps } from './types'

const OPTIONS = ['اقتصادي', 'متوسط', 'مرتفع', 'متدرج حسب الخدمة']

export default function Question10PricingModel({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">10) ما نموذج التسعير المتوقع؟</h2>
      <div className="space-y-2">
        {OPTIONS.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-divider bg-offwhite px-3 py-2 text-sm">
            <input
              type="radio"
              name="pricingModel"
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
