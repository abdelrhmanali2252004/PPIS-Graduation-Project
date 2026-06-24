import { Briefcase, CheckCircle2, Star, X } from 'lucide-react'
import { useState } from 'react'

type Expert = {
  id: string
  name: string
  title: string
  specialty: string
  rating: number
  sessions: number
}

const STATIC_EXPERTS: Expert[] = [
  {
    id: '1',
    name: 'د. أحمد محمود',
    title: 'خبير دراسات الجدوى',
    specialty: 'مطاعم وتجارة التجزئة',
    rating: 4.9,
    sessions: 120,
  },
  {
    id: '2',
    name: 'م. سارة حسن',
    title: 'مستشارة تمويل المشاريع',
    specialty: 'تمويل وخطط مالية',
    rating: 4.8,
    sessions: 95,
  },
  {
    id: '3',
    name: 'د. ياسر علي',
    title: 'خبير تحليل السوق',
    specialty: 'سوق أسيوط والصعيد',
    rating: 4.7,
    sessions: 80,
  },
  {
    id: '4',
    name: 'م. نورهان صلاح',
    title: 'مستشارة ريادة الأعمال',
    specialty: 'مشاريع ناشئة وتشغيل',
    rating: 4.9,
    sessions: 110,
  },
]

type ExpertBookingModalProps = {
  projectName: string
  onClose: () => void
}

export default function ExpertBookingModal({
  projectName,
  onClose,
}: ExpertBookingModalProps) {
  const [bookedExpert, setBookedExpert] = useState<Expert | null>(null)

  const handleBook = (expert: Expert) => {
    setBookedExpert(expert)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-surface p-6 text-right shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expert-booking-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 id="expert-booking-title" className="text-lg font-bold text-heading">
              {bookedExpert ? 'تم الحجز' : 'اختر خبيراً للمراجعة'}
            </h3>
            <p className="mt-1 text-sm text-slateMuted">
              {bookedExpert
                ? `تم تأكيد حجز مراجعة مشروع «${projectName}»`
                : `مراجعة مشروع «${projectName}» مع أحد المتخصصين`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-divider p-1.5 text-slateMuted transition hover:text-gold"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {bookedExpert ? (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="mt-4 text-base font-bold text-heading">تم الحجز بنجاح</p>
            <p className="mt-2 text-sm text-slateMuted">
              مع {bookedExpert.name} — {bookedExpert.title}
            </p>
            <p className="mt-3 text-xs text-slateMuted">
              سيتواصل معك المتخصص خلال ٢٤–٤٨ ساعة لتأكيد موعد المراجعة.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-nile px-6 py-2.5 text-sm font-bold text-white"
            >
              حسناً
            </button>
          </div>
        ) : (
          <ul className="max-h-[60vh] space-y-3 overflow-y-auto">
            {STATIC_EXPERTS.map((expert) => (
              <li key={expert.id}>
                <div className="flex items-center gap-3 rounded-xl border border-divider bg-offwhite/50 p-4 transition-colors hover:border-nile/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-nile/10 text-nile">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-heading">{expert.name}</p>
                    <p className="text-xs text-slateMuted">{expert.title}</p>
                    <p className="mt-1 text-[11px] text-body/80">{expert.specialty}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slateMuted">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-gold">
                        <Star className="h-3 w-3 fill-gold" />
                        {expert.rating}
                      </span>
                      <span>•</span>
                      <span>{expert.sessions}+ جلسة</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBook(expert)}
                    className="shrink-0 rounded-lg bg-nile px-4 py-2 text-xs font-bold text-white hover:bg-nile/90"
                  >
                    احجز
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
