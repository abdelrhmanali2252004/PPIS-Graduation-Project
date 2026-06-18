import { useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Download, Loader2, TrendingUp } from 'lucide-react'
import type { FeasibilityStep3Response } from '../../store/slices/feasibilitySlice'
import type { ProjectDetails } from '../../store/slices/projectDetailsSlice'
import { formatEgp, parseFeasibilityMetrics } from '../../utils/parseFeasibilityMetrics'
import {
  FEASIBILITY_STUDY_TABS,
  FeasibilityStudyTabPanel,
  type FeasibilityStudyTabId,
} from '../feasibility/feasibilityStudyPanels'
import { SmartNotificationsBell } from './SmartNotificationsBell'
import { DonutChart } from './charts/DonutChart'
import { GroupedBarChart } from './charts/GroupedBarChart'
import { MetricBar } from './charts/MetricBar'
import FeasibilityLoading from '../feasibility/FeasibilityLoading'
import DashboardTabBar from './DashboardTabBar'
import ProjectReportPdfDocument from './ProjectReportPdfDocument'

type DashboardTabId = 'dashboard' | 'project' | FeasibilityStudyTabId

const DASHBOARD_TABS: readonly { id: DashboardTabId; label: string }[] = [
  { id: 'dashboard', label: 'اللوحة المالية' },
  ...FEASIBILITY_STUDY_TABS,
  { id: 'project', label: 'بيانات المشروع' },
]

type StrategicDashboardProps = {
  project: ProjectDetails | null
  study: FeasibilityStep3Response | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

export default function StrategicDashboard({
  project,
  study,
  loading,
  error,
  onRetry,
}: StrategicDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('dashboard')
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const projectName = project?.name ?? 'مشروع'
  const projectStep = project?.step
  const logoUrl = project?.logoUrl ?? null
  const logoPrompt = project?.logoPrompt ?? null

  const metrics = useMemo(
    () => (study?.res ? parseFeasibilityMetrics(study.res) : null),
    [study],
  )

  if (loading && !project) {
    return <FeasibilityLoading title="جاري تحميل لوحة التحكم الاستراتيجية..." />
  }

  if (error && !project) {
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

  if (!project) {
    return (
      <div className="p-8 text-center text-sm text-slateMuted" dir="rtl">
        اختر مشروعاً لعرض لوحة التحكم.
      </div>
    )
  }

  const studyRes = study?.res ?? project.feasibility
  const isStudyTab = (id: DashboardTabId): id is FeasibilityStudyTabId =>
    id !== 'dashboard' && id !== 'project'

  const handleDownloadPdf = async () => {
    if (!studyRes || !reportRef.current) {
      return
    }

    setPdfGenerating(true)
    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const { downloadProjectReportPdf } = await import('../../utils/generateProjectReportPdf')
      const safeName =
        projectName.replace(/[<>:"/\\|?*]/g, '').trim() || 'project'
      await downloadProjectReportPdf(
        reportRef.current,
        `${safeName}-feasibility-dashboard.pdf`,
      )
    } catch {
      window.alert('تعذر إنشاء ملف PDF. حاول مرة أخرى.')
    } finally {
      setPdfGenerating(false)
    }
  }

  return (
    <div className="min-h-full" dir="rtl">
      {studyRes ? (
        <div className="pointer-events-none fixed -left-[10000px] top-0 z-[-1]" aria-hidden>
          <ProjectReportPdfDocument
            ref={reportRef}
            projectName={projectName}
            project={project}
            study={studyRes}
            metrics={metrics}
            marketResearchUsed={Boolean(study?.marketResearchUsed || project.marketResearchUsed)}
          />
        </div>
      ) : null}
      <header className="border-b border-divider bg-white px-6 py-5 lg:px-8">
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="text-xs text-slateMuted">لوحة التحكم الاستراتيجية</p>
          {metrics ? <SmartNotificationsBell metrics={metrics} /> : null}
        </div>
        <h1 className="text-xl font-bold text-body md:text-2xl">{projectName}</h1>
        {metrics ? (
          <p className="mt-2 text-sm text-slateMuted">
            مستخرجة من مخرجات دراسة الجدوى — رأس مال مبدئي:{' '}
            <span className="font-bold text-nile">{formatEgp(metrics.totalCapital)}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-slateMuted">
            بيانات المشروع محمّلة — أكمل دراسة الجدوى لعرض المؤشرات المالية.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {projectStep != null ? (
            <span className="rounded-full border border-divider bg-offwhite px-3 py-1 text-xs font-semibold text-slateMuted">
              الخطوة {projectStep} من ٥
            </span>
          ) : null}
          {logoUrl ? (
            <span className="rounded-full bg-nile/10 px-3 py-1 text-xs font-semibold text-nile">
              شعار المشروع متوفر
            </span>
          ) : null}
          {metrics ? (
            <>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-nile-dark">
                {metrics.sectorLabel}
              </span>
              <span className="rounded-full border border-divider bg-offwhite px-3 py-1 text-xs text-slateMuted">
                {metrics.teamSizeLabel}
              </span>
            </>
          ) : null}
          {study?.marketResearchUsed || project.marketResearchUsed ? (
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
              موثّق بالذكاء الاصطناعي
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleDownloadPdf()}
            disabled={!studyRes || pdfGenerating}
            className="inline-flex items-center gap-2 rounded-lg border border-divider bg-white px-4 py-2 text-xs font-semibold text-body hover:bg-offwhite disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pdfGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {pdfGenerating ? 'جاري التحميل...' : 'تحميل PDF'}
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
        <DashboardTabBar<DashboardTabId>
          tabs={DASHBOARD_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'dashboard' ? (
            metrics ? (
              <FinancialDashboardPanel metrics={metrics} />
            ) : (
              <TabEmptyState message="أكمل دراسة الجدوى (الخطوة ٣) لعرض المؤشرات والرسوم البيانية." />
            )
          ) : null}

          {activeTab === 'project' ? (
            <ProjectInfoPanel
              project={project}
              logoUrl={logoUrl}
              logoPrompt={logoPrompt}
            />
          ) : null}

          {isStudyTab(activeTab) ? (
            studyRes ? (
              <article className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
                <FeasibilityStudyTabPanel tab={activeTab} res={studyRes} />
              </article>
            ) : (
              <TabEmptyState message="لا تتوفر نصوص دراسة الجدوى لهذا المشروع بعد." />
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}

function TabEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-divider bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-slateMuted">{message}</p>
      <Link
        to="/app/step3"
        className="mt-4 inline-block text-xs font-bold text-nile hover:underline"
      >
        الانتقال إلى دراسة الجدوى
      </Link>
    </div>
  )
}

function ProjectInfoPanel({
  project,
  logoUrl,
  logoPrompt,
}: {
  project: ProjectDetails
  logoUrl: string | null
  logoPrompt: string | null
}) {
  return (
    <article className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
      <dl className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="اسم المشروع" value={project.name} />
        <InfoRow label="الخطوة الحالية" value={`${project.step} من ٥`} />
        <InfoRow
          label="دراسة السوق بالذكاء الاصطناعي"
          value={project.marketResearchUsed ? 'نعم' : 'لا'}
        />
        <InfoRow
          label="دراسة الجدوى"
          value={project.feasibility ? 'متوفرة' : 'غير متوفرة'}
        />
      </dl>

      {logoUrl ? (
        <div className="mt-6 border-t border-divider pt-6">
          <h3 className="mb-3 text-sm font-bold text-nile">شعار المشروع</h3>
          <img
            src={logoUrl}
            alt={`شعار ${project.name}`}
            className="mx-auto max-h-48 rounded-xl border border-divider bg-offwhite object-contain p-4"
          />
        </div>
      ) : (
        <p className="mt-6 border-t border-divider pt-6 text-sm text-slateMuted">
          لم يُرفع شعار للمشروع بعد.
        </p>
      )}

      {logoPrompt?.trim() ? (
        <div className="mt-6 border-t border-divider pt-6">
          <h3 className="mb-2 text-sm font-bold text-nile">وصف الشعار (Prompt)</h3>
          <p className="whitespace-pre-wrap text-sm leading-7 text-body/90">{logoPrompt}</p>
        </div>
      ) : null}
    </article>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-offwhite/80 px-4 py-3">
      <dt className="text-xs font-semibold text-slateMuted">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-body">{value}</dd>
    </div>
  )
}

type FeasibilityMetrics = NonNullable<ReturnType<typeof parseFeasibilityMetrics>>

function FinancialDashboardPanel({ metrics }: { metrics: FeasibilityMetrics }) {
  return (
    <>
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

        <ChartCard title={`مصادر الإيرادات — ${formatEgp(metrics.monthlyRevenue)}/شهر`}>
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
    </>
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
