import type { QuestionComponentProps } from './types'

const ZONES = ['حي شرق', 'حي غرب', 'أسيوط الجديدة', 'وسط البلد', 'ديروط', 'منفلوط']

export default function Question04Location({ value, onChange }: QuestionComponentProps) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-nile">4) أين سيكون موقع المشروع؟</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ZONES.map((zone) => (
          <button
            key={zone}
            type="button"
            onClick={() => onChange(zone)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              value === zone
                ? 'bg-nile text-white'
                : 'border border-divider bg-offwhite text-body hover:border-nile/40'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>
    </>
  )
}
