import { useState } from 'react'
import { Download, ImageOff } from 'lucide-react'
import { downloadLogoFile, resolveLogoUrl } from '../../api/branding'
import FeasibilityContent, { type TabId } from '../feasibility/FeasibilityContent'
import type { FeasibilityStep3Response } from '../../store/slices/feasibilitySlice'

export type ExecutiveDashboardContentProps = {
  projectId: string | null
  projectName: string
  loading: boolean
  error: string | null
  study: FeasibilityStep3Response | null
  logoUrl?: string | null
  logoPrompt?: string | null
  onRetry: () => void
}

export function AlertsPanel() {
  return (
    <aside
      className="hidden w-[260px] shrink-0 overflow-y-auto border-r border-divider bg-white lg:block"
      dir="rtl"
    >
      <div className="border-b border-divider p-4">
        <h2 className="text-sm font-bold text-nile">منظومة التنبيه الذكي</h2>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="h-2 w-2 animate-blink rounded-full bg-danger" />
          <span className="font-semibold text-body">٣ تنبيهات جديدة</span>
        </div>
      </div>
      <div className="space-y-3 p-3">
        <div className="rounded-xl border-s-4 border-danger bg-offwhite p-3 shadow-sm">
          <div className="mb-1 text-xs font-bold text-danger">حرج</div>
          <p className="mb-2 text-xs leading-relaxed text-body">تجاوز التكاليف التشغيلية ١٢٪</p>
          <button type="button" className="text-xs font-bold text-nile">
            اتخذ إجراءً ←
          </button>
        </div>
        <div className="rounded-xl border-s-4 border-gold bg-offwhite p-3 shadow-sm">
          <div className="mb-1 text-xs font-bold text-warning">فرصة</div>
          <p className="mb-2 text-xs leading-relaxed text-body">حركة مرور مرتفعة في أسيوط الجديدة</p>
          <button type="button" className="text-xs font-bold text-nile">
            استغل الفرصة ←
          </button>
        </div>
        <div className="rounded-xl border-s-4 border-nile bg-offwhite p-3 shadow-sm">
          <div className="mb-1 text-xs font-bold text-nile">إجراء</div>
          <p className="mb-2 text-xs leading-relaxed text-body">تحديث وثائق الترخيص</p>
          <button type="button" className="text-xs font-bold text-nile">
            رفع المستندات ←
          </button>
        </div>
      </div>
    </aside>
  )
}

function LogoBrandCard({
  projectName,
  logoUrl,
  logoPrompt,
}: {
  projectName: string
  logoUrl: string | null | undefined
  logoPrompt?: string | null
}) {
  const displayUrl = logoUrl ? resolveLogoUrl(logoUrl) : null

  if (!displayUrl) {
    return (
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-divider bg-white p-8 text-center shadow-sm">
        <ImageOff className="h-10 w-10 text-slateMuted" />
        <p className="text-sm font-semibold text-slateMuted">لا يوجد شعار محفوظ لهذا المشروع</p>
      </div>
    )
  }

  return (
    <div className="mb-8 rounded-2xl border border-divider bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-nile">الهوية البصرية</h2>
          <p className="mt-1 text-xs text-slateMuted">شعار مشروع {projectName}</p>
        </div>
        <button
          type="button"
          onClick={() => void downloadLogoFile(displayUrl, `${projectName || 'logo'}-logo.png`)}
          className="inline-flex items-center gap-2 rounded-lg bg-nile px-4 py-2 text-xs font-bold text-white"
        >
          <Download className="h-4 w-4" />
          تحميل اللوجو
        </button>
      </div>
      <img
        src={displayUrl}
        alt={`شعار ${projectName}`}
        className="mx-auto max-h-48 w-full max-w-xs rounded-xl object-contain"
      />
      {logoPrompt ? (
        <p className="mt-4 rounded-lg bg-offwhite px-3 py-2 text-center text-[10px] leading-relaxed text-slateMuted" dir="ltr">
          {logoPrompt}
        </p>
      ) : null}
    </div>
  )
}

export default function ExecutiveDashboardContent({
  projectId,
  projectName,
  loading,
  error,
  study,
  logoUrl,
  logoPrompt,
  onRetry,
}: ExecutiveDashboardContentProps) {
  const [tab, setTab] = useState<TabId>('summary')

  return (
    <div className="relative pb-14">
      <div className="overflow-y-auto font-cairo" dir="rtl">
        <div className="border-b border-divider bg-white px-6 py-5 lg:px-10">
          <div className="text-xs text-slateMuted">لوحة التحكم الاستراتيجية</div>
          <h1 className="mt-1 text-xl font-bold text-body md:text-2xl">{projectName}</h1>
        </div>

        <div className="px-6 py-6 lg:px-10">
          <LogoBrandCard
            projectName={projectName}
            logoUrl={logoUrl}
            logoPrompt={logoPrompt}
          />

          <FeasibilityContent
            tab={tab}
            onTabChange={setTab}
            projectMissing={!projectId}
            loading={loading}
            error={error}
            study={study}
            onRetry={onRetry}
            showHeader={false}
            loadingTitle="جاري تحميل دراسة الجدوى..."
          />
        </div>
      </div>
    </div>
  )
}
