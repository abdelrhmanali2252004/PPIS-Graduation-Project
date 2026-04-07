const stats = [
  { v: '500+', l: 'مشروع' },
  { v: '95%', l: 'نسبة نجاح' },
  { v: '50+', l: 'شريك' },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-white px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-2 text-2xl font-bold text-nile md:text-3xl">من نحن</h2>
        <p className="mb-8 text-gold">شريكك في رحلة ريادة الأعمال</p>
        <div className="rounded-2xl border border-divider bg-offwhite/80 p-6 shadow-sm md:p-10">
          <p className="text-base leading-8 text-body/90">
            نقدّم منظومة متكاملة لدراسات الجدوى، أبحاث السوق، والتخطيط المالي — مدعومة
            بـ RAG على وثائق الغرف التجارية والمصادر الرسمية في مصر، مع جسر بشري
            للخبراء عند الحاجة. مصممة خصيصاً لسياق أسيوط والصعيد.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className="animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${0.2 + i * 0.15}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="text-3xl font-black text-nile">{s.v}</div>
              <div className="text-sm text-slateMuted">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
