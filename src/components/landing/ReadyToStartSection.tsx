import { Link } from 'react-router-dom'

export default function ReadyToStartSection() {
  return (
    <section className="bg-gradient-to-b from-nile to-nile-dark px-4 py-14 text-white md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-3 text-2xl font-extrabold md:text-3xl">جاهز لبدء مشروعك؟</h2>
        <p className="mx-auto mb-6 max-w-2xl text-sm text-white/80 md:text-base">
          انضم إلى رواد الأعمال في أسيوط وابدأ التخطيط الذكي خطوة بخطوة مع NextVenture OS.
        </p>
        <Link
          to="/app/step1"
          className="inline-flex rounded-xl bg-gold px-7 py-3 text-sm font-bold text-nile-dark shadow-lg transition-transform hover:scale-[1.02]"
        >
          ابدأ مشروعك الآن ←
        </Link>
      </div>
    </section>
  )
}
