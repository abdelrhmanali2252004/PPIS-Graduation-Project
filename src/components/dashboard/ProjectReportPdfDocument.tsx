import { forwardRef } from 'react'
import type { FeasibilityStudyResponse } from '../../store/slices/feasibilitySlice'
import type { ProjectDetails } from '../../store/slices/projectDetailsSlice'
import {
  formatEgp,
  type DashboardMetrics,
} from '../../utils/parseFeasibilityMetrics'

type ProjectReportPdfDocumentProps = {
  projectName: string
  project: ProjectDetails
  study: FeasibilityStudyResponse
  metrics: DashboardMetrics | null
  marketResearchUsed: boolean
}

function PdfSection({ title, text }: { title: string; text?: string | null }) {
  const content = text?.trim()
  if (!content) {
    return null
  }

  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="mb-2 border-b border-[#1B4C8C] pb-1 text-base font-bold text-[#1B4C8C]">
        {title}
      </h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-[#1a1a1a]">{content}</p>
    </section>
  )
}

function PdfBreakdownBar({
  label,
  percent,
  amount,
}: {
  label: string
  percent: number
  amount: number
}) {
  const width = `${Math.min(100, Math.max(0, percent))}%`

  return (
    <div className="mb-3 break-inside-avoid">
      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[#1a1a1a]">{label}</span>
        <span className="shrink-0 font-bold text-[#1B4C8C]">{formatEgp(amount)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
        <div className="h-full rounded-full bg-[#1B4C8C]" style={{ width }} />
      </div>
      <p className="mt-0.5 text-xs font-semibold text-[#6b7280]">{percent}%</p>
    </div>
  )
}
function PdfMetricRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-[#e5e7eb]">
      <td className="py-2 pe-4 text-sm font-semibold text-[#4b5563]">{label}</td>
      <td className="py-2 text-sm font-bold text-[#1B4C8C]">{value}</td>
    </tr>
  )
}

const ProjectReportPdfDocument = forwardRef<HTMLDivElement, ProjectReportPdfDocumentProps>(
  function ProjectReportPdfDocument(
    { projectName, project, study, metrics, marketResearchUsed },
    ref,
  ) {
    const generatedAt = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return (
      <div
        ref={ref}
        dir="rtl"
        className="w-[794px] bg-white p-10 font-cairo text-[#1a1a1a]"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        <header className="mb-8 border-b-2 border-[#C9A05D] pb-6">
          <p className="text-xs font-bold text-[#C9A05D]">فكرة Tech — تقرير مشروع</p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#1B4C8C]">{projectName}</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            دراسة الجدوى ولوحة التحكم الاستراتيجية — {generatedAt}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-[#f3f4f6] px-2 py-1">الخطوة {project.step} من ٥</span>
            {marketResearchUsed ? (
              <span className="rounded bg-[#ecfdf5] px-2 py-1 text-[#059669]">
                موثّق بدراسة السوق
              </span>
            ) : null}
            {metrics ? (
              <span className="rounded bg-[#eff6ff] px-2 py-1 text-[#1B4C8C]">
                {metrics.sectorLabel}
              </span>
            ) : null}
          </div>
        </header>

        {metrics ? (
          <section className="mb-8 break-inside-avoid">
            <h2 className="mb-3 text-lg font-bold text-[#1B4C8C]">اللوحة المالية</h2>
            <table className="mb-4 w-full border-collapse">
              <tbody>
                <PdfMetricRow
                  label="رأس المال المبدئي"
                  value={formatEgp(metrics.totalCapital)}
                />
                <PdfMetricRow
                  label="الإيرادات الشهرية المتوقعة"
                  value={formatEgp(metrics.monthlyRevenue)}
                />
                <PdfMetricRow
                  label="صافي الربح الشهري"
                  value={formatEgp(metrics.monthlyNetProfit)}
                />
                <PdfMetricRow
                  label="التكاليف التشغيلية الشهرية"
                  value={formatEgp(metrics.monthlyOperatingCosts)}
                />
                <PdfMetricRow label="هامش الربح" value={`${metrics.profitMarginPercent}%`} />
                <PdfMetricRow label="نقطة التعادل" value={metrics.breakEvenWeeks} />
              </tbody>
            </table>

            {metrics.capitalBreakdown.length > 0 ? (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-bold text-[#1B4C8C]">توزيع رأس المال</h3>
                {metrics.capitalBreakdown.map((row) => (
                  <PdfBreakdownBar
                    key={row.label}
                    label={row.label}
                    percent={row.percent}
                    amount={row.amount}
                  />
                ))}
              </div>
            ) : null}

            {metrics.revenueSources.length > 0 ? (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-bold text-[#1B4C8C]">مصادر الإيرادات</h3>
                {metrics.revenueSources.map((row) => (
                  <PdfBreakdownBar
                    key={row.label}
                    label={row.label}
                    percent={row.percent}
                    amount={row.amount}
                  />
                ))}
              </div>
            ) : null}

            {metrics.operatingBreakdown.length > 0 ? (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-bold text-[#1B4C8C]">
                  تفصيل التكاليف التشغيلية
                </h3>
                {metrics.operatingBreakdown.map((row) => (
                  <PdfBreakdownBar
                    key={row.label}
                    label={row.label}
                    percent={row.percent}
                    amount={row.amount}
                  />
                ))}
              </div>
            ) : null}

            {metrics.sixMonthForecast.length > 0 ? (
              <div>
                <h3 className="mb-2 text-sm font-bold text-[#1B4C8C]">
                  توقعات الإيرادات والأرباح — ٦ أشهر
                </h3>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f9fafb] text-[#4b5563]">
                      <th className="border border-[#e5e7eb] px-3 py-2 text-right">الشهر</th>
                      <th className="border border-[#e5e7eb] px-3 py-2 text-right">الإيرادات</th>
                      <th className="border border-[#e5e7eb] px-3 py-2 text-right">التكاليف</th>
                      <th className="border border-[#e5e7eb] px-3 py-2 text-right">الربح</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.sixMonthForecast.map((row) => (
                      <tr key={row.month}>
                        <td className="border border-[#e5e7eb] px-3 py-2">{row.month}</td>
                        <td className="border border-[#e5e7eb] px-3 py-2">
                          {formatEgp(row.revenue)}
                        </td>
                        <td className="border border-[#e5e7eb] px-3 py-2">
                          {formatEgp(row.costs)}
                        </td>
                        <td className="border border-[#e5e7eb] px-3 py-2 font-semibold text-[#059669]">
                          {formatEgp(row.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mb-2">
          <h2 className="mb-4 text-lg font-bold text-[#1B4C8C]">دراسة الجدوى — النصوص الكاملة</h2>
        </section>

        <PdfSection title="الملخص التنفيذي" text={study.executiveSummary} />
        <PdfSection title="تحليل السوق والعملاء" text={study.marketAndCustomersAnalysis} />
        <PdfSection title="تحليل المنافسين" text={study.competitorsAnalysis} />
        <PdfSection title="تكاليف التأسيس" text={study.costs?.establishment} />
        <PdfSection title="تكاليف التشغيل" text={study.costs?.operating} />
        <PdfSection title="توقعات الإيرادات والأرباح" text={study.revenueAndProfitOutlook} />
        <PdfSection title="نموذج التشغيل والتنفيذ" text={study.operationsModel} />
        <PdfSection title="خطة التسويق والمبيعات" text={study.marketingAndSalesPlan} />
        <PdfSection title="تحليل المخاطر وخطط التخفيف" text={study.risksAndMitigation} />
        <PdfSection title="التوصيات" text={study.recommendations} />
        <PdfSection title="خطة عمل 90 يومًا" text={study.ninetyDayActionPlan} />

        {project.logoUrl ? (
          <section className="mt-6 break-inside-avoid">
            <h2 className="mb-2 text-base font-bold text-[#1B4C8C]">شعار المشروع</h2>
            <img
              src={project.logoUrl}
              alt={`شعار ${projectName}`}
              crossOrigin="anonymous"
              className="max-h-40 object-contain"
            />
          </section>
        ) : null}

        <footer className="mt-10 border-t border-[#e5e7eb] pt-4 text-center text-xs text-[#9ca3af]">
          تم إنشاء هذا التقرير تلقائياً من منصة فكرة Tech — {generatedAt}
        </footer>
      </div>
    )
  },
)

export default ProjectReportPdfDocument
