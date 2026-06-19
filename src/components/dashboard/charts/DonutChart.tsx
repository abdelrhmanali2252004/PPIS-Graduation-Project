type DonutSegment = {
  label: string
  value: number
  color: string
}

type DonutChartProps = {
  segments: DonutSegment[]
  centerLabel: string
  centerSub?: string
  size?: number
}

export function DonutChart({
  segments,
  centerLabel,
  centerSub,
  size = 140,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  const stroke = 22
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <svg
      className="relative shrink-0"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-divider"
        strokeWidth={stroke}
      />
      {segments.map((seg) => {
        const length = (seg.value / total) * circumference
        const dasharray = `${length} ${circumference - length}`
        const dashoffset = -offset
        offset += length
        return (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="transition-all duration-500"
          />
        )
      })}
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        className="fill-body"
        fontSize="11"
        fontWeight="700"
      >
        {centerLabel}
      </text>
      {centerSub ? (
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          className="fill-slateMuted"
          fontSize="9"
        >
          {centerSub}
        </text>
      ) : null}
    </svg>
  )
}
