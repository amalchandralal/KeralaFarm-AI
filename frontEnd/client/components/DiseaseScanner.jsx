import React, { useState, useRef } from "react";
import { detectDisease } from "../services/api";
import { UploadCloud, Camera, X, Loader2, CheckCircle2 } from "lucide-react";

const DiseaseScanner = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setResult(null);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    try {
      const data = await detectDisease(image);
      setResult(data);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confidence = result?.confidence_level;
  const confNum = typeof confidence === "number" ? confidence : parseFloat(String(confidence)) || 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Upload Area */}
      {!preview && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center p-10 text-center transition-colors border-2 border-dashed rounded-xl cursor-pointer ${
            isDragging 
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" 
              : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <div className="p-3 mb-4 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <UploadCloud size={24} />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">SVG, PNG, JPG or GIF (max. 10MB)</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {/* Preview Area */}
      {preview && !result && !loading && (
        <div className="relative overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <img
            src={preview}
            alt="Crop preview"
            className="object-contain w-full h-64"
          />
          <button
            onClick={() => {
              setImage(null);
              setPreview("");
              setResult(null);
            }}
            className="absolute p-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm top-3 right-3 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Actions */}
      {preview && !result && !loading && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleScan}
            disabled={loading}
            className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors bg-emerald-600 dark:bg-emerald-500 rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50"
          >
            Analyze Image
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <Loader2 size={32} className="text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Analyzing crop...</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our AI is processing the image</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg bg-rose-50 dark:bg-rose-950/40">
           {error}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex flex-col md:flex-row">
            {/* Image Preview Side */}
            <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800/40 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
              <img src={preview} alt="Analyzed" className="object-cover w-full h-full max-h-48 md:max-h-full" />
            </div>
            
            {/* Analysis Side */}
            <div className="p-6 md:w-2/3 bg-white dark:bg-slate-900">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Diagnosis</h3>
                  <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{result.disease_name || "Unknown Condition"}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {confNum.toFixed(1)}% Match
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${Math.min(confNum, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 text-sm">
                {result.suggested_treatment && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Treatment Plan</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{result.suggested_treatment}</p>
                  </div>
                )}
                
                {result.possible_causes && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Possible Causes</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{result.possible_causes}</p>
                  </div>
                )}

                {result.fertilizer_guidance && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Fertilizer Guidance</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{result.fertilizer_guidance}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const guide = {
                      id: `custom-scan-${Date.now()}`,
                      title: `Scan: ${result.disease_name || "Unknown Condition"}`,
                      category: 'Scan Result',
                      iconName: 'Camera',
                      size: 'Custom',
                      content: [
                        `Confidence: ${(confNum).toFixed(1)}%`,
                        result.suggested_treatment ? `Treatment: ${result.suggested_treatment}` : '',
                        result.possible_causes ? `Causes: ${result.possible_causes}` : '',
                        result.fertilizer_guidance ? `Fertilizer: ${result.fertilizer_guidance}` : ''
                      ].filter(Boolean)
                    };
                    const custom = JSON.parse(localStorage.getItem('custom_offline_guides') || '[]');
                    localStorage.setItem('custom_offline_guides', JSON.stringify([guide, ...custom]));
                    
                    const downloaded = new Set(JSON.parse(localStorage.getItem('downloaded_guides') || '[]'));
                    downloaded.add(guide.id);
                    localStorage.setItem('downloaded_guides', JSON.stringify([...downloaded]));
                  }}
                  className="flex-1 inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-emerald-700 dark:text-emerald-300 transition-colors bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                >
                  Save for Offline
                </button>
                <button
                  onClick={() => {
                    setImage(null);
                    setPreview("");
                    setResult(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Scan Another Plant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseScanner;