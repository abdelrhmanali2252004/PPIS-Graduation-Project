import type { QuestionComponentProps } from './types'

const SECTORS = ['مطاعم ومقاهي', 'تجزئة', 'خدمات', 'تعليم', 'تكنولوجيا', 'صحة وجمال']

export default function Question02Sector({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">2) ما القطاع الذي ينتمي إليه المشروع؟</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SECTORS.map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => onChange(sector)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              value === sector
                ? 'bg-nile text-white'
                : 'border border-divider bg-offwhite text-body hover:border-nile/40'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
    </>
  )
}
