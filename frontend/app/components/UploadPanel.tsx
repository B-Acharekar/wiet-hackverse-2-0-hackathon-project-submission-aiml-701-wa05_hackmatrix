"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, Image as ImageIcon, Loader2, Sparkles, X, CheckCircle2 } from "lucide-react"
import { DiagnosisResult } from "./ResultPanel"

interface UploadPanelProps {
  onAnalysisComplete?: (result: DiagnosisResult) => void;
  onImageUpload?: (imageUrl: string) => void;
}

export default function UploadPanel({ onAnalysisComplete, onImageUpload }: UploadPanelProps) {
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

    const response = await fetch("http://localhost:8000/predict/pneumonia", {
      method: "POST",
      body: formData
    })

    const data = await response.json()

    const prediction = data.prediction

    const confidence =
      typeof data.confidence === "string"
        ? parseFloat(data.confidence.replace("%", "")) / 100
        : data.confidence

    const aiResult: DiagnosisResult = {
      diseaseId: "pneumonia",
      prediction: prediction,
      confidence: confidence,
      severity: prediction === "PNEUMONIA" ? "high" : "low",
      explanation:
        prediction === "PNEUMONIA"
          ? "The AI detected abnormal lung opacities consistent with pneumonia infection patterns."
          : "No abnormal lung opacity patterns were detected in the scan.",
      nextSteps:
        prediction === "PNEUMONIA"
          ? [
              "Consult pulmonologist immediately",
              "Prescribe antibiotics if bacterial pneumonia confirmed",
              "Schedule follow-up chest X-ray"
            ]
          : [
              "Maintain routine monitoring",
              "Consult physician if symptoms persist"
            ]
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
          <div className="mb-10 flex items-center gap-3 border-b border-black/5 pb-6">
            <div className="w-12 h-12 rounded-xl bg-pastel-pink/10 flex items-center justify-center text-pastel-pink shadow-sm">
                <ImageIcon className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-black">Image Analysis</h2>
                <p className="text-black font-bold opacity-80">Upload medical imagery for AI evaluation.</p>
            </div>
          </div>

          <div 
            onClick={() => !file && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative w-full rounded-xl border-2 border-dashed transition-all duration-500 ease-out
              ${isDragging 
                ? 'border-pastel-pink bg-pastel-pink/10 scale-[1.01]' 
                : preview 
                  ? 'border-black/5 bg-white' 
                  : 'border-black/10 bg-white hover:border-pastel-violet hover:shadow-lg cursor-pointer'
              }
              p-12 flex flex-col items-center justify-center min-h-[350px] shadow-sm
            `}
          >
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div 
                  key="upload-prompt"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center pointer-events-none"
                >
                  <div className="w-20 h-20 rounded-xl bg-pastel-violet/10 shadow-sm flex items-center justify-center mb-6">
                    <UploadCloud className="w-10 h-10 text-pastel-violet" />
                  </div>
                  <span className="text-xl font-black text-black mb-2">
                    Drag and drop file
                  </span>
                  <span className="text-black font-bold opacity-60 mb-6">or click to browse files</span>
                  <div className="px-6 py-3 rounded-lg bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    JPEG, PNG, HEIC (Max 15MB)
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="image-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full flex justify-center items-center flex-col relative"
                >
                  <button 
                    onClick={clearFile}
                    className="absolute -top-14 right-0 p-3 bg-black text-white rounded-xl hover:scale-110 transition-all z-20 shadow-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-full inline-block border-8 border-white">
                    <img src={preview} alt="Upload preview" className="max-h-[300px] object-contain" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-pastel-violet animate-spin mb-4" />
                        <span className="text-black font-black animate-pulse">Running AI Analysis...</span>
                      </div>
                    )}
                  </div>
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

          <div className="mt-12">
            <motion.button
              whileHover={{ scale: preview && !isAnalyzing ? 1.02 : 1 }}
              whileTap={{ scale: preview && !isAnalyzing ? 0.98 : 1 }}
              onClick={runAnalysis}
              disabled={!preview || isAnalyzing}
              className={`
                w-full relative group overflow-hidden py-6 rounded-xl font-black text-xl transition-all duration-500 shadow-xl flex items-center justify-center space-x-3 uppercase tracking-widest
                ${preview 
                  ? "bg-black text-white hover:bg-slate-900" 
                  : "bg-slate-100 text-black/20 cursor-not-allowed"
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-pastel-pink" />
                  <span>Run Clinical Analysis</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Success Indicator */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-pastel-green/10 rounded-xl p-8 border border-pastel-green/30 text-center shadow-inner"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-pastel-green" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">Analysis Ready</h3>
                <p className="text-black font-bold leading-relaxed opacity-80">
                  {result}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  )
}
