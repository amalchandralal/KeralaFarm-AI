import React, { useState, useRef } from 'react'
import { detectDisease } from '../services/api'

interface DiseaseResult {
  disease_name?: string
  possible_causes?: string
  suggested_treatment?: string
  fertilizer_guidance?: string
  confidence_level?: number | string
  [key: string]: unknown
}

const DiseaseScanner = () => {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setImage(file)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const handleScan = async () => {
    if (!image) return
    setLoading(true)
    setError('')
    try {
      const data = await detectDisease(image)
      setResult(data)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const confidence = result?.confidence_level
  const confNum = typeof confidence === 'number' ? confidence : parseFloat(String(confidence)) || 0

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-3 border-dashed border-forest-300 rounded-2xl p-8 text-center cursor-pointer hover:border-forest-500 hover:bg-forest-50 transition-all"
      >
        {preview ? (
          <img src={preview} alt="Crop preview" className="max-h-64 mx-auto rounded-xl object-contain" />
        ) : (
          <div>
            <p className="text-5xl mb-3">🌿</p>
            <p className="text-lg font-medium text-forest-700">Upload crop photo</p>
            <p className="text-gray-500 text-sm mt-1">Click or drag & drop</p>
            <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
              വിളയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യൂ
            </p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleChange} className="hidden" />
      </div>

      {/* Actions */}
      {image && (
        <div className="flex gap-3">
          <button onClick={() => { setImage(null); setPreview(''); setResult(null) }} className="btn-outline flex-1">
            ✕ Clear
          </button>
          <button onClick={handleScan} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>📊 Scan for Disease</>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 fade-in-up">
          <h3 className="text-xl font-bold text-forest-800 flex items-center gap-2">
            📋 Analysis Results
          </h3>

          {/* Confidence */}
          {confidence !== undefined && (
            <div className="card">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Confidence Level</span>
                <span className={`font-bold ${confNum > 70 ? 'text-forest-600' : confNum > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {typeof confidence === 'number' ? `${confidence}%` : confidence}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${confNum > 70 ? 'bg-forest-500' : confNum > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(confNum, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Disease Name */}
          {result.disease_name && (
            <div className="card border-l-4 border-red-400">
              <p className="text-xs font-medium text-red-500 uppercase mb-1">🦠 Disease Detected</p>
              <p className="text-xl font-bold text-gray-800">{result.disease_name}</p>
            </div>
          )}

          {/* Causes */}
          {result.possible_causes && (
            <div className="card border-l-4 border-yellow-400">
              <p className="text-xs font-medium text-yellow-600 uppercase mb-1">🔍 Possible Causes</p>
              <p className="text-gray-700">{result.possible_causes}</p>
            </div>
          )}

          {/* Treatment */}
          {result.suggested_treatment && (
            <div className="card border-l-4 border-forest-400">
              <p className="text-xs font-medium text-forest-600 uppercase mb-1">💊 Suggested Treatment</p>
              <p className="text-gray-700">{result.suggested_treatment}</p>
            </div>
          )}

          {/* Fertilizer */}
          {result.fertilizer_guidance && (
            <div className="card border-l-4 border-earth-400">
              <p className="text-xs font-medium text-earth-600 uppercase mb-1">🌱 Fertilizer Guidance</p>
              <p className="text-gray-700">{result.fertilizer_guidance}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DiseaseScanner
