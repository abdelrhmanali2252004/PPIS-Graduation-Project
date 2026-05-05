import { Building2, MapPin, Target, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createServiceRequest } from "../../store/slices/serviceRequestSlice";
import { createStep1Project } from "../../store/slices/projectStepsSlice";

type RequestMarketComponentProps = {
  setSelectedOption: (value: "upload" | "request" | null) => void;
  selectedOption: "upload" | "request" | null;
};

export default function RequestMarketComponent({
  setSelectedOption,
  selectedOption,
}: RequestMarketComponentProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { projectId, creatingStep1, error: step1Error } = useAppSelector(
    (state) => state.projectSteps,
  );
  const { creating, error } = useAppSelector((state) => state.serviceRequest);

  const handleRequestStudy = async () => {
    setSelectedOption("request");
    if (!projectId) {
      const action = await dispatch(createStep1Project());
      if (!createStep1Project.fulfilled.match(action)) {
        return;
      }
    }
    setShowConfirmModal(true);
  };

  const handleConfirmRequest = async () => {
    if (!projectId) {
      return;
    }

    const action = await dispatch(
      createServiceRequest({
        projectId,
        type: "MARKET_RESEARCH",
      }),
    );

    if (createServiceRequest.fulfilled.match(action)) {
      setShowConfirmModal(false);
      navigate("/dashboard/user/projects");
    }
  };

  const handleCloseModal = () => {
    if (!creating) {
      setShowConfirmModal(false);
    }
  };

    return (
      <>
      <div
        className="flex-1 rounded-2xl border border-divider bg-white p-6 shadow-sm"
        style={{ borderTop: "4px solid #C9A05D" }}
      >
        <span className="mb-3 inline-block rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-nile-dark">
          Team
        </span>
        <h2 className="mb-4 text-lg font-bold text-body">
          أو، اطلب إعداد دراسة السوق
        </h2>
        <div className="mb-6 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2 text-body/90">
            <Zap className="h-4 w-4 text-gold" /> سريع
          </span>
          <span className="flex items-center gap-2 text-body/90">
            <Target className="h-4 w-4 text-gold" /> دقيق
          </span>
          <span className="flex items-center gap-2 text-body/90">
            <MapPin className="h-4 w-4 text-gold" /> محلي
          </span>
        </div>
        <button
          type="button"
          onClick={() => void handleRequestStudy()}
          disabled={creating || creatingStep1}
          className={`mb-4 w-full rounded-xl py-3 text-sm font-bold shadow-md transition-opacity hover:opacity-95 ${selectedOption === "request" ? "bg-gradient-to-l from-gold to-gold/80 text-nile-dark ring-2 ring-gold/50" : "bg-gradient-to-l from-gold to-gold/80 text-nile-dark"}`}
        >
          {creatingStep1 ? "جاري تجهيز المشروع..." : "اطلب دراسة السوق الآن"}
        </button>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slateMuted">
          <Building2 className="h-4 w-4" />
          <span>تقدير التسليم: ٣–٥ أيام عمل</span>
          <span className="rounded-md bg-nile/10 px-2 py-0.5 font-medium text-nile">
            أسيوط
          </span>
        </div>
      </div>

      {showConfirmModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-right shadow-xl">
            <h3 className="text-lg font-bold text-body">تأكيد إرسال الطلب</h3>
            <p className="mt-2 text-sm text-slateMuted">
              هل تريد إرسال طلب دراسة السوق الآن؟
            </p>

            {!projectId && step1Error ? (
              <p className="mt-3 text-xs font-semibold text-red-600">{step1Error}</p>
            ) : null}

            {error ? (
              <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={creating}
                className="rounded-lg border border-divider px-4 py-2 text-sm font-semibold text-body"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmRequest()}
                disabled={!projectId || creating}
                className="rounded-lg bg-nile px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "جاري الإرسال..." : "تأكيد الإرسال"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </>
    );
}
