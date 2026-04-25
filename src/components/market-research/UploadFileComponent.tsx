import { CloudUpload } from "lucide-react";
import { useRef, useState } from "react";

type UploadFileComponentProps = {
  selectedOption: "upload" | "request" | null;
  setSelectedOption: (value: "upload" | "request" | null) => void;
  onFileSelected: (file: File | null) => void;
};

export default function UploadFileComponent({
  selectedOption,
  setSelectedOption,
  onFileSelected,
}: UploadFileComponentProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
      };
    
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
          setSelectedFile(file);
          setSelectedOption("upload");
          onFileSelected(file);
        }
      };
    return (
        <div
        className="flex-1 rounded-2xl border border-divider bg-white p-6 shadow-sm"
        style={{ borderTop: "4px solid #1B4C8C" }}
      >
        <span className="mb-3 inline-block rounded-full bg-nile/10 px-2 py-0.5 text-xs font-bold text-nile">
          RAG Technology
        </span>
        <h2 className="mb-4 text-lg font-bold text-nile">
          لديك ملفات بالفعل؟
        </h2>
        <div
          className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${selectedOption === "upload" ? "border-nile bg-nile/5" : "border-nile/30 bg-offwhite/50 hover:border-nile/50"}`}
          onClick={handleFileUpload}
        >
          <CloudUpload className="mb-3 h-10 w-10 text-nile/60" />
          <p className="mb-2 text-center text-sm font-medium text-body">
            {selectedFile
              ? `تم اختيار: ${selectedFile.name}`
              : "اسحب ملفات PDF هنا أو انقر للتحميل"}
          </p>
          <span className="rounded-md bg-nile/10 px-2 py-1 text-xs text-nile">
            PDF فقط
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-4 text-xs leading-relaxed text-slateMuted">
          يقرأ النظام تقارير الغرفة التجارية والعقود الممسوحة ضوئياً ويستخرج
          الجداول والشروح للاستخدام في دراستك.
        </p>
      </div>
    )
}
