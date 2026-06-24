import type { ProjectAnswerKey, ProjectAnswers, QuestionItem } from './types'

export type QuestionPhaseId =
  | 'businessConcept'
  | 'marketAnalysis'
  | 'operationalPlanning'
  | 'financialProjections'
  | 'riskAssessment'

export type QuestionPhase = {
  id: QuestionPhaseId
  titleAr: string
  titleEn: string
  description: string
  questionKeys: ProjectAnswerKey[]
}

export const QUESTION_PHASES: QuestionPhase[] = [
  {
    id: 'businessConcept',
    titleAr: 'مفهوم العمل',
    titleEn: 'Business Concept',
    description: 'عرّف فكرتك وهوية مشروعك والوضع القانوني الحالي.',
    questionKeys: ['idea_name', 'idea', 'sector', 'legalStatus'],
  },
  {
    id: 'marketAnalysis',
    titleAr: 'تحليل السوق',
    titleEn: 'Market Analysis',
    description: 'افهم عملاءك ومنافسيك وفرص السوق.',
    questionKeys: [
      'audience',
      'geoScope',
      'customerReason',
      'marketState',
      'competitors',
    ],
  },
  {
    id: 'operationalPlanning',
    titleAr: 'التخطيط التشغيلي',
    titleEn: 'Operational Planning',
    description: 'خطط للتنفيذ والفريق والقنوات والتكنولوجيا.',
    questionKeys: [
      'deliveryChannel',
      'revenueModel',
      'acquisitionChannel',
      'teamSize',
      'techNeed',
      'experience',
      'location',
    ],
  },
  {
    id: 'financialProjections',
    titleAr: 'التوقعات المالية',
    titleEn: 'Financial Projections',
    description: 'حدد الميزانية والتمويل والتسعير والأهداف.',
    questionKeys: [
      'budget',
      'fundingSource',
      'topExpense',
      'pricingModel',
      'monthlySalesTarget',
    ],
  },
  {
    id: 'riskAssessment',
    titleAr: 'تقييم المخاطر',
    titleEn: 'Risk Assessment',
    description: 'قيّم الطلب والموسمية والمخاطر وطموحك المستقبلي.',
    questionKeys: ['demandOutlook', 'seasonality', 'risks', 'twoYearGoal'],
  },
]

const QUESTION_BY_KEY = new Map<ProjectAnswerKey, QuestionItem>()

export function getPhaseQuestions(phase: QuestionPhase): QuestionItem[] {
  return phase.questionKeys.map((key) => QUESTION_BY_KEY.get(key)!)
}

export function isPhaseComplete(
  phase: QuestionPhase,
  answers: ProjectAnswers,
): boolean {
  return getPhaseQuestions(phase).every((q) => answers[q.key]?.trim())
}

export const QUESTION_ITEMS: QuestionItem[] = [
  {
    key: 'idea_name',
    stage: 'مفهوم العمل',
    title: 'ما هو اسم مشروعك ؟',
    helpText: 'اكتب اسم مشروعك بطريقة واضحة ومباشرة.',
    inputType: 'textarea',
    placeholder: 'اكتب اسم مشروعك بطريقة واضحة ومباشرة...',
    maxLength: 100,
  },
  {
    key: 'idea',
    stage: 'مفهوم العمل',
    title: 'إيه هي فكرة مشروعك؟',
    helpText: 'اشرح حلمك ببساطة.',
    inputType: 'textarea',
    placeholder: 'اكتب وصف مختصر لفكرة المشروع...',
    maxLength: 350,
  },
  {
    key: 'sector',
    stage: 'مفهوم العمل',
    title: 'تصنيف نشاط المشروع الرئيسي؟',
    inputType: 'options',
    options: ['مطعم', 'تجارة', 'خدمات', 'تعليم', 'تقنية', 'صناعة'],
  },
  {
    key: 'legalStatus',
    stage: 'مفهوم العمل',
    title: 'الوضع القانوني الحالي؟',
    inputType: 'options',
    options: ['مجرد فكرة', 'بدأت في التراخيص', 'مشروع شغال فعلا'],
  },
  {
    key: 'audience',
    stage: 'تحليل السوق',
    title: 'من هو العميل المستهدف؟',
    inputType: 'options',
    options: ['أفراد', 'شركات', 'ناس بتدور على التوفير', 'ناس بتدور على الرفاهية'],
  },
  {
    key: 'geoScope',
    stage: 'تحليل السوق',
    title: 'النطاق الجغرافي للنشاط؟',
    inputType: 'options',
    options: ['حي أو منطقة', 'محافظة', 'مصر كلها', 'خارج مصر'],
  },
  {
    key: 'customerReason',
    stage: 'تحليل السوق',
    title: 'ليه العميل هيختارك أنت بالذات؟',
    inputType: 'options',
    options: ['سعري أرخص', 'جودتي أعلى', 'خدمتي أسهل', 'معاملتي أحسن'],
  },
  {
    key: 'marketState',
    stage: 'تحليل السوق',
    title: 'حالة السوق اللي هتدخله؟',
    inputType: 'options',
    options: ['فكرة جديدة محدش عملها', 'سوق عليه طلب عالي', 'المنافسة فيه صعبة'],
  },
  {
    key: 'competitors',
    stage: 'تحليل السوق',
    title: 'مين منافسينك الأساسيين؟',
    inputType: 'options',
    options: ['شركات كبيرة', 'محلات مشابهة في المنطقة', 'مواقع أونلاين'],
  },
  {
    key: 'deliveryChannel',
    stage: 'التخطيط التشغيلي',
    title: 'هتقدم منتجك للناس إزاي؟',
    inputType: 'options',
    options: ['محل أو مكتب', 'أونلاين', 'توصيل فقط', 'ميكس بين أكثر من قناة'],
  },
  {
    key: 'revenueModel',
    stage: 'التخطيط التشغيلي',
    title: 'هتكسب فلوسك إزاي؟',
    inputType: 'options',
    options: ['بيع مباشر', 'اشتراكات', 'عمولة وسيط'],
  },
  {
    key: 'acquisitionChannel',
    stage: 'التخطيط التشغيلي',
    title: 'هتوصل للناس إزاي؟',
    inputType: 'options',
    options: ['سوشيال ميديا', 'مندوبين مبيعات', 'إعلانات في الشارع', 'أكثر من طريقة'],
  },
  {
    key: 'teamSize',
    stage: 'التخطيط التشغيلي',
    title: 'ناوي تبدأ بمشروع حجمه قد إيه؟',
    helpText: 'اختر أقرب حجم للفريق عند البداية.',
    inputType: 'options',
    options: [
      'لوحدي',
      'فريق صغير جدا (2-5)',
      'شركة صغيرة (6-20)',
      'كيان كبير (أكثر من 20)',
    ],
  },
  {
    key: 'techNeed',
    stage: 'التخطيط التشغيلي',
    title: 'الاحتياج التكنولوجي؟',
    inputType: 'options',
    options: [
      'بسيط (إكسيل + واتساب)',
      'متوسط (موقع أو نظام تشغيل)',
      'متقدم (تطبيق + ذكاء اصطناعي)',
    ],
  },
  {
    key: 'experience',
    stage: 'التخطيط التشغيلي',
    title: 'مستوى خبرة فريقك؟',
    inputType: 'options',
    options: ['مبتدئين', 'عندنا خبرة عملية', 'خبراء متخصصين'],
  },
  {
    key: 'location',
    stage: 'التخطيط التشغيلي',
    title: 'سهولة تلاقي موظفين شاطرين؟',
    inputType: 'options',
    options: ['متوفرين', 'متوفرين لكن غاليين', 'نادرين وصعب نلاقيهم'],
  },
  {
    key: 'budget',
    stage: 'التوقعات المالية',
    title: 'رأس المال اللي هتبدأ بيه؟',
    inputType: 'options',
    options: ['أقل من 100 ألف', 'حتى 500 ألف', 'حتى 2 مليون', 'أكثر من 2 مليون'],
  },
  {
    key: 'fundingSource',
    stage: 'التوقعات المالية',
    title: 'هتجيب الفلوس منين؟',
    inputType: 'options',
    options: ['تحويشة شخصية', 'شركاء', 'قرض', 'مستثمرين'],
  },
  {
    key: 'topExpense',
    stage: 'التوقعات المالية',
    title: 'أكتر حاجة هتصرف فيها فلوس؟',
    inputType: 'options',
    options: ['إيجار', 'مرتبات', 'خامات', 'تسويق'],
  },
  {
    key: 'pricingModel',
    stage: 'التوقعات المالية',
    title: 'هتسعر منتجك بناء على إيه؟',
    inputType: 'options',
    options: ['التكلفة + هامش ربح', 'قريب من المنافسين', 'سعر أقل للدخول للسوق'],
  },
  {
    key: 'monthlySalesTarget',
    stage: 'التوقعات المالية',
    title: 'توقعك للأرباح الشهرية؟',
    inputType: 'options',
    options: ['أقل من 20 ألف', 'حتى 50 ألف', 'حتى 100 ألف', 'أكثر من 100 ألف'],
  },
  {
    key: 'demandOutlook',
    stage: 'تقييم المخاطر',
    title: 'شايف الطلب على فكرتك هيكون إزاي؟',
    inputType: 'options',
    options: ['ضعيف', 'متوسط', 'عالي جدا'],
  },
  {
    key: 'seasonality',
    stage: 'تقييم المخاطر',
    title: 'هل مشروعك مرتبط بمواسم معينة؟',
    inputType: 'options',
    options: ['شغال طول السنة', 'يرتبط بالمواسم والأعياد'],
  },
  {
    key: 'risks',
    stage: 'تقييم المخاطر',
    title: 'أكبر خطر ممكن يواجهك؟',
    inputType: 'options',
    options: ['تغير الأسعار', 'منافس قوي', 'مشاكل قانونية', 'نقص خامات'],
  },
  {
    key: 'twoYearGoal',
    stage: 'تقييم المخاطر',
    title: 'طموحك إيه بعد سنتين؟',
    inputType: 'options',
    options: ['فتح فروع جديدة', 'التوسع بنظام فرنشايز', 'السيطرة على السوق'],
  },
]

for (const item of QUESTION_ITEMS) {
  QUESTION_BY_KEY.set(item.key, item)
}

/** Ordered strings for `POST /project/step2` (one entry per `QUESTION_ITEMS` row). */
export function projectAnswersToStep2List(answers: ProjectAnswers): string[] {
  return QUESTION_ITEMS.map((item) => (answers[item.key] ?? '').trim())
}

export type { ProjectAnswers, ProjectAnswerKey, QuestionItem } from './types'
