const ANALYSES_DATA = [
  { project: 'مطعم أسيوط النموذجي', owner: 'أحمد علي', score: '85/100', risk: 'متوسط', createdAt: '2026-04-07' },
  { project: 'استوديو تصوير', owner: 'سارة محمد', score: '78/100', risk: 'منخفض', createdAt: '2026-04-06' },
  { project: 'متجر إلكتروني', owner: 'محمود حسن', score: '82/100', risk: 'متوسط', createdAt: '2026-04-05' },
]

export default function AdminAnalysesSection() {
  return (
    <section className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-nile">كل تحليلات المشاريع المنشأة</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead>
            <tr className="border-b border-divider text-slateMuted">
              <th className="px-2 py-2">المشروع</th>
              <th className="px-2 py-2">المالك</th>
              <th className="px-2 py-2">نتيجة التحليل</th>
              <th className="px-2 py-2">المخاطرة</th>
              <th className="px-2 py-2">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {ANALYSES_DATA.map((analysis) => (
              <tr key={`${analysis.project}-${analysis.createdAt}`} className="border-b border-divider/70">
                <td className="px-2 py-3 font-semibold text-body">{analysis.project}</td>
                <td className="px-2 py-3 text-body/80">{analysis.owner}</td>
                <td className="px-2 py-3 text-nile">{analysis.score}</td>
                <td className="px-2 py-3">{analysis.risk}</td>
                <td className="px-2 py-3">{analysis.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
