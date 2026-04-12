import { Brain, MapPin, Users } from 'lucide-react'



const highlights = [
  {
    icon: Brain,
    title: 'ذكاء مربوط بمصادر رسمية',
    desc: 'نعتمد على تقنيات RAG المرتبطة بوثائق رسمية من الجهات المعتمدة في مصر، لتقليل التخمين وزيادة دقة النتائج.',
  },
  {
    icon: Users,
    title: 'جسر للخبراء المحليين',
    desc: 'نوفر لك مراجعة بشرية متخصصة، لا نتركك وحدك أمام الأرقام.',
  },
  {
    icon: MapPin,
    title: 'فهم عميق للسوق المحلي',
    desc: 'حلولنا مبنية على واقع السوق في أسيوط والصعيد — ليست قوالب عامة أو نماذج مستوردة.',
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-white via-offwhite to-white px-4 py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-2xl font-bold text-nile md:text-3xl">رؤيتنا</h2>
          <p className="mt-2 text-base font-medium text-gold md:text-lg">
            شريكك في رحلة ريادة الأعمال
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <p className="text-lg font-semibold leading-relaxed text-nile md:text-xl">
                نقدّم منظومة متكاملة لدراسات الجدوى، أبحاث السوق، والتخطيط المالي —
                 مدعومة بالذكاء الاصطناعي المرتبط ببيانات ومصادر رسمية من الغرف التجارية 
                 والجهات المعتمدة في مصر، مع إمكانية الرجوع لخبراء متخصصين عند الحاجة.
            </p>
            <p className="text-base leading-8 text-body/85">
               مصممة خصيصاً لتناسب طبيعة السوق في أسيوط والصعيد، علشان تكون قراراتك مبنية 
               على معلومات حقيقية تقدر تعتمد عليها وتعرضها بثقة قدام أي جهة تمويل أو شريك.
            </p>

            <ul className="space-y-4 pt-2">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl border border-divider bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-nile/8 text-nile">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-nile">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-body/80">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold/25 via-nile/15 to-nile-dark/25 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/25 bg-nile-dark shadow-2xl ring-1 ring-white/10">
              <img
                src="https://cdn.completeaitraining.com/news_images/rga-forecasts-agi-will-replace-fragmented-insurance-ai-systems-by-2033_2026-04-08.jpg"
                alt="لوحة بصرية تمثل النمو والتخطيط وذكاء المنصة"
                className="h-auto w-full object-cover"
                width={800}
                height={560}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nile-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5 text-right">
                <p className="text-sm font-bold text-white drop-shadow md:text-base">
                  من الفكرة إلى خطة قابلة للتنفيذ
                </p>
                <p className="mt-1 text-xs text-white/85 md:text-sm">
                  بيانات موثقة • متابعة ذكية • خبراء بجانبك
                </p>
              </div>
            </div>
            <div
              className="absolute -left-2 top-8 hidden h-14 w-14 rotate-12 rounded-xl border border-gold/40 bg-gold/15 md:block"
              aria-hidden
            />
            <div
              className="absolute -right-1 bottom-24 hidden h-10 w-10 rounded-full border border-white/25 bg-white/10 md:block"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  )
}
