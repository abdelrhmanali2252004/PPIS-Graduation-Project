type MetricBarProps = {
  label: string
  percent: number
  amountLabel: string
  color: string
}

export function MetricBar({ label, percent, amountLabel, color }: MetricBarProps) {
  const width = `${Math.min(100, Math.max(0, percent))}%`

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-body">{label}</span>
        <span className="shrink-0 text-slateMuted">{amountLabel}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-offwhite">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width, backgroundColor: color }}
        />
      </div>
      <div className="text-[10px] font-bold text-slateMuted">{percent}%</div>
    </div>
  )
}
