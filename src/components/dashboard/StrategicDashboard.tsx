import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Download, TrendingUp } from 'lucide-react'
import type { FeasibilityStep3Response } from '../../store/slices/feasibilitySlice'
import {
  formatEgp,
  parseFeasibilityMetrics,
} from '../../utils/parseFeasibilityMetrics'
import { SmartNotificationsBell } from './SmartNotificationsBell'
import { DonutChart } from './charts/DonutChart'
import { GroupedBarChart } from './charts/GroupedBarChart'
import { MetricBar } from './charts/MetricBar'
import FeasibilityLoading from '../feasibility/FeasibilityLoading'

type StrategicDashboardProps = {
  projectName: string
  study: FeasibilityStep3Response | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

export default function StrategicDashboard({
  projectName,
  study,
  loading,
  error,
  onRetry,
}: StrategicDashboardProps) {
  const metrics = useMemo(
    () => (study?.res ? parseFeasibilityMetrics(study.res) : null),
    [study],
  )

  if (loading && !study) {
    return <FeasibilityLoading title="جاري تحميل لوحة التحكم الاستراتيجية..." />
  }

  if (error && !study) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8" dir="rtl">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-nile px-4 py-2.5 text-sm font-bold text-white"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  if (!study || !metrics) {
    return (
      <div className="p-8 text-center text-sm text-slateMuted" dir="rtl">
        أكمل دراسة الجدوى (الخطوة ٣) لعرض المؤشرات والرسوم البيانية.
      </div>
    )
  }

  return (
    <div className="min-h-full" dir="rtl">
        <header className="border-b border-divider bg-white px-6 py-5 lg:px-8">
          <div className="mb-3 flex items-start justify-between gap-4">
            <p className="text-xs text-slateMuted">لوحة التحكم الاستراتيجية</p>
            <SmartNotificationsBell metrics={metrics} />
          </div>
          <h1 className="text-xl font-bold text-body md:text-2xl">{projectName}</h1>
          <p className="mt-2 text-sm text-slateMuted">
            مستخرجة من مخرجات دراسة الجدوى — رأس مال مبدئي:{' '}
            <span className="font-bold text-nile">{formatEgp(metrics.totalCapital)}</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-nile-dark">
              {metrics.sectorLabel}
            </span>
            {study.marketResearchUsed ? (
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                موثّق بالذكاء الاصطناعي
              </span>
            ) : null}
            <span className="rounded-full border border-divider bg-offwhite px-3 py-1 text-xs text-slateMuted">
              {metrics.teamSizeLabel}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-divider bg-white px-4 py-2 text-xs font-semibold text-body hover:bg-offwhite"
            >
              <Download className="h-4 w-4" />
              تحميل PDF
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-nile px-4 py-2 text-xs font-bold text-white"
            >
              <Calendar className="h-4 w-4" />
              حجز مراجعة خبير
            </button>
          </div>
        </header>

        <div className="px-6 py-6 lg:px-8">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="الإيرادات الشهرية"
              value={formatEgp(metrics.monthlyRevenue)}
              badge="هدف المشروع"
              badgeIcon={<TrendingUp className="h-3.5 w-3.5 text-success" />}
              accent="text-nile"
            />
            <KpiCard
              title="صافي الربح الشهري"
              value={formatEgp(metrics.monthlyNetProfit)}
              badge={`هامش ربح ${metrics.profitMarginPercent}%`}
              progress={metrics.profitMarginPercent}
              progressColor="#059669"
            />
            <KpiCard
              title="التكاليف التشغيلية"
              value={`${formatEgp(metrics.monthlyOperatingCosts)}/شهر`}
              badge={`${metrics.costsPercentOfRevenue}% من الإيراد`}
              progress={metrics.costsPercentOfRevenue}
              progressColor="#1B4C8C"
            />
            <KpiCard
              title="نقطة التعادل"
              value={metrics.breakEvenWeeks}
              badge="جدول زمني مباشر"
              accent="text-body text-lg"
            />
          </div>

          <h2 className="mb-4 text-sm font-bold text-nile">التوقعات المالية</h2>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartCard
                title={`توزيع رأس المال — ${formatEgp(metrics.totalCapital)}`}
                footer="تشمل تكاليف التأسيس: تأمين الإيجار، المعدات، التراخيص، والتسويق الافتتاحي."
              >
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="w-full flex-1 space-y-4">
                    <MetricBar
                      label="تكاليف التأسيس"
                      percent={metrics.startupPercent}
                      amountLabel={formatEgp(metrics.startupCosts)}
                      color="#1B4C8C"
                    />
                    <MetricBar
                      label="احتياطي تشغيل"
                      percent={metrics.reservePercent}
                      amountLabel={formatEgp(metrics.operatingReserve)}
                      color="#C9A05D"
                    />
                  </div>
                  <DonutChart
                    segments={[
                      { label: 'startup', value: metrics.startupCosts, color: '#1B4C8C' },
                      { label: 'reserve', value: metrics.operatingReserve, color: '#C9A05D' },
                    ]}
                    centerLabel={formatEgp(metrics.totalCapital, true)}
                    centerSub="إجمالي"
                  />
                </div>
              </ChartCard>

              <ChartCard title="توقعات الإيرادات والأرباح — ٦ أشهر">
                <GroupedBarChart
                  data={metrics.sixMonthForecast}
                  revenueTarget={metrics.monthlyRevenue}
                  costsTarget={metrics.costOfSales}
                  profitTarget={metrics.monthlyNetProfit}
                />
              </ChartCard>

              <ChartCard
                title={`تفصيل التكاليف التشغيلية الشهرية — ${formatEgp(metrics.monthlyOperatingCosts)}`}
                footerAction={
                  <Link
                    to="/app/step3"
                    className="mt-4 inline-block text-xs font-bold text-nile hover:underline"
                  >
                    ← العودة لدراسة الجدوى
                  </Link>
                }
              >
                <div className="space-y-3">
                  {metrics.operatingBreakdown.map((row) => (
                    <MetricBar
                      key={row.label}
                      label={row.label}
                      percent={row.percent}
                      amountLabel={formatEgp(row.amount)}
                      color={row.color}
                    />
                  ))}
                </div>
              </ChartCard>

              <ChartCard
                title={`مصادر الإيرادات — ${formatEgp(metrics.monthlyRevenue)}/شهر`}
              >
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="w-full flex-1 space-y-3">
                    {metrics.revenueSources.map((src) => (
                      <MetricBar
                        key={src.label}
                        label={src.label}
                        percent={src.percent}
                        amountLabel={formatEgp(src.amount)}
                        color={src.color}
                      />
                    ))}
                  </div>
                  <DonutChart
                    segments={metrics.revenueSources.map((s) => ({
                      label: s.label,
                      value: s.amount,
                      color: s.color,
                    }))}
                    centerLabel={formatEgp(metrics.monthlyRevenue, true)}
                    centerSub="شهرياً"
                  />
                </div>
              </ChartCard>
            </div>

        </div>
    </div>
  )
}

function KpiCard({
  title,
  value,
  badge,
  badgeIcon,
  progress,
  progressColor,
  accent,
}: {
  title: string
  value: string
  badge: string
  badgeIcon?: ReactNode
  progress?: number
  progressColor?: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-slateMuted">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${accent ?? 'text-nile'}`}>{value}</p>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-slateMuted">
        {badgeIcon}
        {badge}
      </div>
      {progress != null && progressColor ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-offwhite">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: progressColor }}
          />
        </div>
      ) : null}
    </div>
  )
}

function ChartCard({
  title,
  children,
  footer,
  footerAction,
}: {
  title: string
  children: ReactNode
  footer?: string
  footerAction?: ReactNode
}) {
  return (
    <article className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-nile">{title}</h3>
      {children}
      {footer ? (
        <p className="mt-4 rounded-lg bg-offwhite px-3 py-2 text-[10px] leading-relaxed text-slateMuted">
          {footer}
        </p>
      ) : null}
      {footerAction}
    </article>
  )
}
