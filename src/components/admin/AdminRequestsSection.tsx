const REQUESTS_DATA = [
  { user: 'أحمد علي', project: 'مطعم أسيوط النموذجي', type: 'استشارة مالية', date: '2026-04-07', status: 'جديد' },
  { user: 'سارة محمد', project: 'استوديو تصوير', type: 'استشارة تسويقية', date: '2026-04-06', status: 'قيد المراجعة' },
  { user: 'محمود حسن', project: 'متجر إلكتروني', type: 'استشارة تشغيلية', date: '2026-04-05', status: 'مغلق' },
]

export default function AdminRequestsSection() {
  return (
    <section className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-nile">طلبات المستخدمين للتواصل مع المختص</h2>
      <div className="space-y-3">
        {REQUESTS_DATA.map((request) => (
          <article
            key={`${request.user}-${request.project}`}
            className="rounded-xl border border-divider bg-offwhite/70 p-4"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-body">{request.project}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-slateMuted">{request.date}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm text-body/90 md:grid-cols-3">
              <p>
                <span className="font-semibold text-nile">المستخدم:</span> {request.user}
              </p>
              <p>
                <span className="font-semibold text-nile">نوع الطلب:</span> {request.type}
              </p>
              <p>
                <span className="font-semibold text-nile">الحالة:</span> {request.status}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
