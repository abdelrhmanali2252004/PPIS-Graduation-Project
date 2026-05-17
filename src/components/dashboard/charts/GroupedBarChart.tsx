import type { MonthForecast } from '../../../utils/parseFeasibilityMetrics'
import { formatEgp } from '../../../utils/parseFeasibilityMetrics'

type GroupedBarChartProps = {
  data: MonthForecast[]
  revenueTarget: number
  costsTarget: number
  profitTarget: number
}

const COLORS = {
  revenue: '#1B4C8C',
  costs: '#DC2626',
  profit: '#059669',
}

export function GroupedBarChart({
  data,
  revenueTarget,
  costsTarget,
  profitTarget,
}: GroupedBarChartProps) {
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.revenue, d.costs, d.profit]),
    revenueTarget,
    1,
  )

  const chartH = 180
  const barW = 14

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-1 px-2" style={{ height: chartH }}>
        {data.map((month) => {
          const bars = [
            { key: 'revenue', value: month.revenue, color: COLORS.revenue },
            { key: 'costs', value: month.costs, color: COLORS.costs },
            { key: 'profit', value: month.profit, color: COLORS.profit },
          ] as const

          return (
            <div
              key={month.month}
              className="flex flex-1 flex-col items-center justify-end"
            >
              <div className="flex items-end justify-center gap-0.5">
                {bars.map((bar) => {
                  const h = Math.max(4, (bar.value / maxVal) * (chartH - 24))
                  return (
                    <div
                      key={bar.key}
                      title={`${bar.key}: ${formatEgp(bar.value)}`}
                      className="rounded-t-sm transition-all duration-500"
                      style={{
                        width: barW,
                        height: h,
                        backgroundColor: bar.color,
                      }}
                    />
                  )
                })}
              </div>
              <span className="mt-2 text-[9px] font-semibold text-slateMuted">
                {month.month.replace('الشهر ', '')}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4 border-t border-divider pt-3 text-[10px]">
        <Legend color={COLORS.revenue} label="الإيرادات المتوقعة" value={formatEgp(revenueTarget, true)} />
        <Legend color={COLORS.costs} label="تكلفة المبيعات" value={formatEgp(costsTarget, true)} />
        <Legend color={COLORS.profit} label="صافي الربح" value={formatEgp(profitTarget, true)} />
      </div>
    </div>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-slateMuted">{label}</span>
      <span className="font-bold text-body">{value}</span>
    </div>
  )
}
