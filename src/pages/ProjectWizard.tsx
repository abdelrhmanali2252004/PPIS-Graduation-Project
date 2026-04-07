import { useState } from 'react'
import ProjectWizardContent from '../components/project-wizard/ProjectWizardContent'
import { type ProjectAnswers } from '../components/project-wizard/questions'
import { AppShell } from '../layouts/AppShell'

const TOTAL_QUESTIONS = 12

const TIPS: Record<number, string> = {
  1: 'ابدأ بوصف واضح للفكرة الأساسية حتى يبني الذكاء الاصطناعي تحليلا أدق.',
  2: 'اختيار القطاع الصحيح يساعد على جلب افتراضات سوق مناسبة.',
  3: 'تحديد العميل المستهدف هو المفتاح لصياغة التسعير والتسويق.',
  4: 'قارن موقع المشروع بحركة المرور والكثافة السكانية قبل الحسم.',
  5: 'ضع ميزانية واقعية تشمل التشطيب والتشغيل لأول 3 أشهر.',
  6: 'موعد الإطلاق يؤثر على خطة التوظيف والتسويق المسبق.',
  7: 'خبرتك تحدد مستوى المخاطرة والحاجة إلى شريك خبير.',
  8: 'حجم الفريق ينعكس مباشرة على مصروفات التشغيل الشهرية.',
  9: 'ميزة تنافسية واحدة قوية أفضل من عدة مزايا غير واضحة.',
  10: 'نموذج التسعير يجب أن يوازن بين القدرة الشرائية والربحية.',
  11: 'حدد هدف مبيعات يمكن قياسه ومراجعته شهريا.',
  12: 'توقع المخاطر مبكرا يسهّل بناء خطط بديلة فعالة.',
}

export default function ProjectWizard() {
  const [idx, setIdx] = useState(0)
  const step = idx + 1
  const [answers, setAnswers] = useState<ProjectAnswers>({
    idea: '',
    sector: '',
    audience: '',
    location: 'حي شرق',
    budget: '50000',
    timeline: '',
    experience: '',
    teamSize: '',
    differentiation: '',
    pricingModel: '',
    monthlySalesTarget: '',
    risks: '',
  })

  const aiTip = TIPS[step] ?? TIPS[1]

  return (
    <AppShell
      activeStep={2}
      progressPercent={40}
      bottomStepLabel="الخطوة ٢ من ٥ — تفاصيل المشروع"
      aiTip={aiTip}
      aiPulseKey={step}
    >
      <ProjectWizardContent
        idx={idx}
        step={step}
        answers={answers}
        onAnswerChange={(key, value) => setAnswers((prev) => ({ ...prev, [key]: value }))}
        onPrev={() => setIdx((i) => Math.max(0, i - 1))}
        onNext={() => setIdx((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1))}
        isLast={idx >= TOTAL_QUESTIONS - 1}
      />
    </AppShell>
  )
}
