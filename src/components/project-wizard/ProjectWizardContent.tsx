import {
  BarChart3,
  Lightbulb,
  Loader2,
  Settings2,
  ShieldAlert,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  getPhaseQuestions,
  isPhaseComplete,
  QUESTION_PHASES,
  type ProjectAnswerKey,
  type ProjectAnswers,
  type QuestionItem,
} from "./questions";

const PHASE_ICONS = [Lightbulb, BarChart3, Settings2, Wallet, ShieldAlert] as const;

type ProjectWizardContentProps = {
  phaseIdx: number;
  answers: ProjectAnswers;
  suggestedProjectNames?: string[];
  loadingSuggestedNames?: boolean;
  onAnswerChange: (key: ProjectAnswerKey, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isLastPhase: boolean;
  isSubmitting?: boolean;
  submitError?: string | null;
};

function SuggestedProjectNames({
  names,
  loading,
  selectedName,
  onSelect,
}: {
  names: string[];
  loading: boolean;
  selectedName: string;
  onSelect: (name: string) => void;
}) {
  if (!loading && names.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-gold/30 bg-gradient-to-l from-gold/5 to-nile/5 p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        <p className="text-sm font-bold text-heading">
          أسماء مقترحة من دراسة السوق
        </p>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-nile" aria-hidden />
        ) : null}
      </div>

      {loading && names.length === 0 ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-9 w-28 animate-pulse rounded-lg bg-offwhite"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {names.map((name) => {
            const selected = selectedName.trim() === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelect(name)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  selected
                    ? "bg-nile text-white shadow-sm"
                    : "border border-divider bg-surface text-body hover:border-nile/50 hover:bg-nile/5"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-2 text-xs text-slateMuted">
        اضغط على اسم لاستخدامه، أو اكتب اسماً مختلفاً في الحقل أعلاه.
      </p>
    </div>
  );
}

function QuestionField({
  question,
  index,
  answers,
  onAnswerChange,
  suggestedProjectNames = [],
  loadingSuggestedNames = false,
}: {
  question: QuestionItem;
  index: number;
  answers: ProjectAnswers;
  onAnswerChange: (key: ProjectAnswerKey, value: string) => void;
  suggestedProjectNames?: string[];
  loadingSuggestedNames?: boolean;
}) {
  const answered = Boolean(answers[question.key]?.trim());

  return (
    <article
      className={`rounded-2xl border bg-surface p-4 transition-colors sm:p-5 ${
        answered ? "border-nile/30 shadow-sm" : "border-divider"
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            answered ? "bg-gold text-nile-dark" : "bg-offwhite text-slateMuted"
          }`}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-heading">{question.title}</h3>
          {question.helpText && (
            <p className="mt-1 text-sm text-slateMuted">{question.helpText}</p>
          )}
        </div>
      </div>

      {question.inputType === "options" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAnswerChange(question.key, option)}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                answers[question.key] === option
                  ? "bg-nile text-white shadow-sm"
                  : "border border-divider bg-offwhite text-body hover:border-nile/40"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.inputType === "text" && (
        <input
          value={answers[question.key]}
          onChange={(e) => onAnswerChange(question.key, e.target.value)}
          placeholder={question.placeholder ?? "اكتب إجابتك هنا"}
          className="w-full rounded-xl border border-divider bg-offwhite px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
        />
      )}

      {question.inputType === "textarea" && (
        <>
          <textarea
            value={answers[question.key]}
            onChange={(e) =>
              onAnswerChange(
                question.key,
                e.target.value.slice(0, question.maxLength ?? 300),
              )
            }
            rows={4}
            placeholder={question.placeholder ?? "اكتب إجابتك هنا"}
            className="w-full rounded-xl border border-divider bg-offwhite px-4 py-3 text-sm outline-none focus:border-nile focus:ring-2 focus:ring-nile/20"
          />
          <p className="mt-2 text-left text-xs text-slateMuted">
            {answers[question.key].length}/{question.maxLength ?? 300}
          </p>
          {question.key === "idea_name" ? (
            <SuggestedProjectNames
              names={suggestedProjectNames}
              loading={loadingSuggestedNames}
              selectedName={answers.idea_name}
              onSelect={(name) => onAnswerChange("idea_name", name)}
            />
          ) : null}
        </>
      )}
    </article>
  );
}

export default function ProjectWizardContent({
  phaseIdx,
  answers,
  suggestedProjectNames = [],
  loadingSuggestedNames = false,
  onAnswerChange,
  onPrev,
  onNext,
  isLastPhase,
  isSubmitting = false,
  submitError = null,
}: ProjectWizardContentProps) {
  const currentPhase = QUESTION_PHASES[phaseIdx];
  const phaseQuestions = getPhaseQuestions(currentPhase);
  const phaseComplete = isPhaseComplete(currentPhase, answers);
  const answeredInPhase = phaseQuestions.filter((q) =>
    answers[q.key]?.trim(),
  ).length;
  const totalAnswered = QUESTION_PHASES.reduce(
    (sum, phase) =>
      sum + getPhaseQuestions(phase).filter((q) => answers[q.key]?.trim()).length,
    0,
  );
  const totalQuestions = QUESTION_PHASES.reduce(
    (n, p) => n + p.questionKeys.length,
    0,
  );
  const progressPercent =
    totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  const PhaseIcon = PHASE_ICONS[phaseIdx];

  return (
    <div
      className="flex min-h-0 flex-col items-center overflow-y-auto px-4 py-8 pb-16 font-cairo sm:px-6"
      dir="rtl"
    >
      <div className="w-full max-w-[820px]">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold text-body sm:text-2xl">
            الخطوة الثانية: تفاصيل المشروع
          </h1>
          <p className="mt-2 text-sm text-slateMuted">
            أجب عن الأسئلة في كل مرحلة لمساعدة الذكاء الاصطناعي على فهم فكرتك
            وسياق أسيوط.
          </p>
        </header>

        {/* Phase stepper */}
        <div className="mb-6 rounded-2xl border border-divider bg-surface p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 text-xs text-slateMuted">
            <span>التقدم الكلي</span>
            <span className="font-semibold text-heading">{progressPercent}%</span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-offwhite">
            <div
              className="h-full rounded-full bg-gradient-to-l from-nile to-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-1 overflow-x-auto pb-1 sm:gap-2">
            {QUESTION_PHASES.map((phase, i) => {
              const done = i < phaseIdx || isPhaseComplete(phase, answers);
              const active = i === phaseIdx;
              const Icon = PHASE_ICONS[i];

              return (
                <div key={phase.id} className="flex items-center">
                  <div
                    title={phase.titleAr}
                    className={`flex flex-col items-center gap-1.5 px-1 sm:px-2 ${
                      active ? "opacity-100" : done ? "opacity-90" : "opacity-60"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all sm:h-11 sm:w-11 ${
                        active
                          ? "bg-nile text-white shadow-[0_0_0_4px_rgba(27,76,140,0.25)] animate-pulse-glow"
                          : done
                            ? "bg-gold text-nile-dark"
                            : "border border-divider bg-offwhite text-slateMuted"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <span
                      className={`hidden max-w-[72px] text-center text-[10px] font-bold leading-tight sm:block ${
                        active ? "text-heading" : "text-slateMuted"
                      }`}
                    >
                      {phase.titleAr}
                    </span>
                  </div>
                  {i < QUESTION_PHASES.length - 1 && (
                    <div
                      className={`mx-0.5 h-0.5 w-4 sm:mx-1 sm:w-8 ${
                        i < phaseIdx ? "bg-gold" : "bg-divider"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current phase header */}
        <div className="mb-5 rounded-2xl border border-nile/20 bg-gradient-to-l from-nile/5 to-gold/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nile text-white shadow-md">
              <PhaseIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-nile">
                المرحلة {phaseIdx + 1} من {QUESTION_PHASES.length} — {currentPhase.titleEn}
              </p>
              <h2 className="mt-1 text-lg font-bold text-heading sm:text-xl">
                {currentPhase.titleAr}
              </h2>
              <p className="mt-1 text-sm text-slateMuted">{currentPhase.description}</p>
              <p className="mt-2 text-xs font-semibold text-heading">
                {answeredInPhase} من {phaseQuestions.length} أسئلة مكتملة في هذه المرحلة
              </p>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {phaseQuestions.map((question, i) => (
            <QuestionField
              key={question.key}
              question={question}
              index={i}
              answers={answers}
              onAnswerChange={onAnswerChange}
              suggestedProjectNames={suggestedProjectNames}
              loadingSuggestedNames={loadingSuggestedNames}
            />
          ))}
        </div>

        {submitError ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {submitError}
          </div>
        ) : null}

        {!phaseComplete && (
          <p className="mt-4 text-center text-xs text-slateMuted">
            أكمل جميع أسئلة هذه المرحلة للمتابعة
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            disabled={phaseIdx === 0 || isSubmitting}
            onClick={onPrev}
            className="rounded-xl border border-divider px-5 py-2.5 text-sm font-semibold text-body transition-colors hover:bg-offwhite disabled:opacity-40"
          >
            المرحلة السابقة
          </button>
          {!isLastPhase ? (
            <button
              type="button"
              disabled={!phaseComplete || isSubmitting}
              onClick={onNext}
              className="rounded-xl bg-nile px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-nile/25 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              المرحلة التالية ←
            </button>
          ) : (
            <button
              type="button"
              disabled={!phaseComplete || isSubmitting}
              onClick={onNext}
              className="rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-nile-dark shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "جاري الحفظ..." : "توليد دراسة الجدوى ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
