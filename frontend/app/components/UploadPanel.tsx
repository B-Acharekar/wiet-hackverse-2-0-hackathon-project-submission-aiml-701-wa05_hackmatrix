"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  X,
  CheckCircle2
} from "lucide-react"

import { DiagnosisResult } from "./ResultPanel"

interface UploadPanelProps {
  onAnalysisComplete?: (result: DiagnosisResult) => void
  onImageUpload?: (imageUrl: string) => void
}

export default function UploadPanel({
  onAnalysisComplete,
  onImageUpload
}: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      setResult(null)

      const reader = new FileReader()

      reader.onloadend = () => {
        const resultUrl = reader.result as string
        setPreview(resultUrl)

        if (onImageUpload) onImageUpload(resultUrl)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) handleFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]

    if (droppedFile) handleFile(droppedFile)
  }

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()

    setFile(null)
    setPreview(null)
    setResult(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const runAnalysis = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "http://127.0.0.1:8000/predict/pneumonia",
        {
          method: "POST",
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error("Backend error")
      }

      const data = await response.json()

      const prediction = data.prediction

      const confidence =
        typeof data.confidence === "string"
          ? parseFloat(data.confidence.replace("%", "")) / 100
          : data.confidence

      const heatmapImage = data.heatmap
        ? `data:image/jpeg;base64,${data.heatmap}`
        : undefined

      const aiResult: DiagnosisResult = {
        diseaseId: "pneumonia",

        prediction: prediction,

        confidence: confidence,

        severity: prediction === "PNEUMONIA" ? "high" : "low",

        explanation:
          prediction === "PNEUMONIA"
            ? "AI detected lung opacity patterns commonly associated with pneumonia infection."
            : "No abnormal lung opacity patterns were detected in the scan.",

        nextSteps:
          prediction === "PNEUMONIA"
            ? [
                "Consult pulmonologist immediately",
                "Prescribe antibiotics if bacterial pneumonia confirmed",
                "Schedule follow-up chest X-ray",
                "Monitor oxygen saturation levels"
              ]
            : [
                "Maintain routine monitoring",
                "Consult physician if symptoms persist"
              ],

        heatmap: heatmapImage,

        affectedArea: data.affected_area,

        originalImage: preview ?? undefined
      }

      setIsAnalyzing(false)

      setResult(`Analysis complete. Prediction: ${prediction}`)

      if (onAnalysisComplete) onAnalysisComplete(aiResult)
    } catch (error) {
      console.error(error)

      setIsAnalyzing(false)

      alert("AI analysis failed. Please check backend server.")
    }
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 md:p-12 shadow-xl shadow-black/[0.05] border border-black/5 relative overflow-hidden"
      >
        <div className="relative z-10">

          {/* Header */}

          <div className="mb-10 flex items-center gap-3 border-b border-black/5 pb-6">
            <div className="w-12 h-12 rounded-xl bg-pastel-pink/10 flex items-center justify-center text-pastel-pink shadow-sm">
              <ImageIcon className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-black">
                Image Analysis
              </h2>

              <p className="text-black font-bold opacity-80">
                Upload medical imagery for AI evaluation.
              </p>
            </div>
          </div>

          {/* Upload Area */}

          <div
            onClick={() => !file && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full rounded-xl border-2 border-dashed transition-all duration-500
            ${
              isDragging
                ? "border-pastel-pink bg-pastel-pink/10"
                : preview
                ? "border-black/5 bg-white"
                : "border-black/10 bg-white hover:border-pastel-violet cursor-pointer"
            }
            p-12 flex flex-col items-center justify-center min-h-[350px]`}
          >
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <UploadCloud className="w-10 h-10 text-pastel-violet mb-4" />

                  <span className="text-xl font-black text-black">
                    Drag and drop file
                  </span>

                  <span className="text-black opacity-60">
                    or click to browse
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <button
                    onClick={clearFile}
                    className="absolute -top-10 right-0 bg-black text-white p-2 rounded-lg"
                  >
                    <X size={18} />
                  </button>

                  <img
                    src={preview}
                    alt="preview"
                    className="max-h-[300px] rounded-lg"
                  />

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin w-10 h-10 text-pastel-violet" />

                      <span className="mt-3 font-bold">
                        Running AI Analysis...
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Analyze Button */}

          <div className="mt-12">
            <button
              onClick={runAnalysis}
              disabled={!preview || isAnalyzing}
              className={`w-full py-6 rounded-xl font-black text-xl transition-all
              ${
                preview
                  ? "bg-black text-white hover:bg-slate-900"
                  : "bg-slate-100 text-black/20"
              }`}
            >
              {isAnalyzing ? "Analyzing..." : "Run Clinical Analysis"}
            </button>
          </div>

          {/* Result */}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 bg-green-50 rounded-xl p-6 text-center"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />

                <p className="font-bold">{result}</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  )
}
