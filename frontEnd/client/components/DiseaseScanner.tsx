import React, { useState, useRef } from "react";
import { detectDisease } from "../services/api";

interface DiseaseResult {
  disease_name?: string;
  possible_causes?: string;
  suggested_treatment?: string;
  fertilizer_guidance?: string;
  confidence_level?: number | string;
  [key: string]: unknown;
}
const translateToMalayalam = async (result: DiseaseResult): Promise<DiseaseResult> => {
  const fields = ['disease_name', 'possible_causes', 'suggested_treatment', 'fertilizer_guidance'] as const

  const translated: Partial<DiseaseResult> = {}

  await Promise.all(fields.map(async (field) => {
    if (!result[field]) return
    const res = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: result[field], field }),
    })
    const data = await res.json()
    translated[field] = data.translated
  }))

  return { ...result, ...translated }
}


const DiseaseScanner = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [mlResult, setMlResult] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "ml">("en");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setImage(file);
    setResult(null);
    setMlResult(null);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setLang("en");
    try {
      const data = await detectDisease(image);
      setResult(data);
      setMlResult(null);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLangSwitch = async (selected: "en" | "ml") => {
    setLang(selected);
    if (selected === "ml" && result && !mlResult) {
      setTranslating(true);
      try {
        const translated = await translateToMalayalam(result);
        setMlResult(translated);
      } catch {
        setError("Translation failed. Please try again.");
        setLang("en");
      } finally {
        setTranslating(false);
      }
    }
  };

  const displayed = lang === "ml" && mlResult ? mlResult : result;
  const confidence = displayed?.confidence_level;
  const confNum =
    typeof confidence === "number"
      ? confidence
      : parseFloat(String(confidence)) || 0;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="p-8 text-center transition-all border-dashed cursor-pointer border-3 border-forest-300 rounded-2xl hover:border-forest-500 hover:bg-forest-50"
      >
        {preview ? (
          <img
            src={preview}
            alt="Crop preview"
            className="object-contain mx-auto max-h-64 rounded-xl"
          />
        ) : (
          <div>
            <p className="mb-3 text-5xl"></p>
            <p className="text-lg font-medium text-forest-700">
              Upload crop photo
            </p>
            <p className="mt-1 text-sm text-gray-500">Click or drag & drop</p>
            <p
              className="mt-1 text-xs text-gray-400"
              style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}
            >
              വിളയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യൂ
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Actions */}
      {image && (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setImage(null);
              setPreview("");
              setResult(null);
              setMlResult(null);
            }}
            className="flex-1 btn-outline"
          >
            ✕ Clear
          </button>
          <button
            onClick={handleScan}
            disabled={loading}
            className="flex items-center justify-center flex-1 gap-2 btn-primary"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                Analyzing...
              </>
            ) : (
              <> Scan for Disease</>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
           {error}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 fade-in-up">
          {/* Header + Language Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-bold text-forest-800">
               Analysis Results
            </h3>
            <div className="flex gap-2">
              {(["en", "ml"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangSwitch(l)}
                  disabled={translating}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    lang === l
                      ? "bg-forest-600 text-white shadow-md"
                      : "bg-forest-100 text-forest-700 hover:bg-forest-200"
                  } disabled:opacity-50`}
                >
                  {l === "en" ? "English" : "മലയാളം"}
                </button>
              ))}
            </div>
          </div>

          {/* Translating spinner */}
          {translating && (
            <div className="flex items-center gap-3 p-3 border border-forest-200 bg-forest-50 rounded-xl">
              <div className="w-5 h-5 border-4 rounded-full border-forest-500 border-t-transparent animate-spin" />
              <p className="text-sm text-forest-700">
                Translating to Malayalam…
              </p>
            </div>
          )}

          {/* Confidence */}
          {confidence !== undefined && (
            <div className="card">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {lang === "ml" ? "വിശ്വാസ്യത നില" : "Confidence Level"}
                </span>
                <span
                  className={`font-bold ${confNum > 70 ? "text-forest-600" : confNum > 40 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {typeof confidence === "number"
                    ? `${confidence}%`
                    : confidence}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className={`h-3 rounded-full transition-all ${confNum > 70 ? "bg-forest-500" : confNum > 40 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(confNum, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Disease Name */}
          {displayed?.disease_name && (
            <div className="border-l-4 border-red-400 card">
              <p className="mb-1 text-xs font-medium text-red-500 uppercase">
                {lang === "ml" ? "കണ്ടെത്തിയ രോഗം" : "Disease Detected"}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {displayed.disease_name}
              </p>
            </div>
          )}

          {/* Causes */}
          {displayed?.possible_causes && (
            <div className="border-l-4 border-yellow-400 card">
              <p className="mb-1 text-xs font-medium text-yellow-600 uppercase">
                {lang === "ml" ? "സാധ്യമായ കാരണങ്ങൾ" : "Possible Causes"}
              </p>
              <p
                className="text-gray-700"
                style={
                  lang === "ml"
                    ? { fontFamily: "Noto Sans Malayalam, sans-serif" }
                    : {}
                }
              >
                {displayed.possible_causes}
              </p>
            </div>
          )}

          {/* Treatment */}
          {displayed?.suggested_treatment && (
            <div className="border-l-4 card border-forest-400">
              <p className="mb-1 text-xs font-medium uppercase text-forest-600">
                {lang === "ml"
                  ? " നിർദ്ദേശിച്ച ചികിത്സ"
                  : " Suggested Treatment"}
              </p>
              <p
                className="text-gray-700"
                style={
                  lang === "ml"
                    ? { fontFamily: "Noto Sans Malayalam, sans-serif" }
                    : {}
                }
              >
                {displayed.suggested_treatment}
              </p>
            </div>
          )}

          {/* Fertilizer */}
          {displayed?.fertilizer_guidance && (
            <div className="border-l-4 card border-earth-400">
              <p className="mb-1 text-xs font-medium uppercase text-earth-600">
                {lang === "ml" ? " വളം നിർദ്ദേശം" : " Fertilizer Guidance"}
              </p>
              <p
                className="text-gray-700"
                style={
                  lang === "ml"
                    ? { fontFamily: "Noto Sans Malayalam, sans-serif" }
                    : {}
                }
              >
                {displayed.fertilizer_guidance}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseScanner;
