import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { uploadMarketResearchPdf } from "../../store/slices/projectStepsSlice";
import UploadFileComponent from "./UploadFileComponent";
import RequestMarketComponent from "./RequestMarketComponent";

export default function MarketResearchContent() {
  const dispatch = useAppDispatch();
  const { uploadingMarketResearch, marketResearchError } = useAppSelector(
    (state) => state.projectSteps,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    "upload" | "request" | null
  >(null);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!selectedFile) {
      return;
    }

    const action = await dispatch(uploadMarketResearchPdf(selectedFile));
    if (uploadMarketResearchPdf.fulfilled.match(action)) {
      navigate("/app/step2");
    }
  };

  return (
    <div className="px-8 py-8 pb-14 font-cairo md:px-10" dir="rtl">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-body md:text-2xl">
          الخطوة الأولى: مركز أبحاث السوق
        </h1>
        <p className="mt-1 text-sm font-medium text-nile">
          Step 1: Market Research Hub
        </p>
      </header>
      <p className="mb-8 max-w-3xl text-sm leading-7 text-body/80">
        ابدأ من وقائع موثقة: إما رفع مستنداتك الحالية ليقرأها الذكاء الاصطناعي
        ويستشهد بها، أو اطلب دراسة سوق يعدّها فريقنا مدعوماً بالذكاء الاصطناعي
        وبيانات محلية من أسيوط.
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">

        <UploadFileComponent
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onFileSelected={setSelectedFile}
        />
        <div
          className="flex shrink-0 items-center justify-center px-2 lg:flex-col lg:py-0"
          aria-hidden
        >
          <div className="hidden h-px flex-1 bg-divider lg:block lg:h-auto lg:w-px lg:flex-none" />
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gold">
            أو
          </span>
          <div className="hidden h-px flex-1 bg-divider lg:block lg:h-auto lg:w-px lg:flex-none" />
        </div>

       
        <RequestMarketComponent selectedOption={selectedOption} setSelectedOption={setSelectedOption} />


      </div>

      {selectedOption && selectedOption === "upload" && (
        <div className="mt-8 flex justify-center">
          <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleNext}
            disabled={!selectedFile || uploadingMarketResearch}
            className="rounded-xl bg-nile px-8 py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingMarketResearch ? "جاري الرفع..." : "التالي"}
          </button>
          {marketResearchError ? (
            <p className="text-sm font-semibold text-red-600">{marketResearchError}</p>
          ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
