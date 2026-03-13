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
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false)
      const mockResult: DiagnosisResult = {
        diseaseId: "pneumonia",
        prediction: "Pneumonia",
        confidence: 0.94,
        explanation: "The AI detected high-density opacities in the lower lobe of the right lung, suggesting active bacterial pneumonia. The pattern is consistent with clinical presentations of lobar pneumonia.",
        nextSteps: [
          "Prescribe amoxicillin or appropriate antibiotic",
          "Schedule follow-up X-ray in 14 days",
          "Advise increased fluid intake and rest"
        ],
        severity: "medium"
      }
      
      setResult("Analysis complete. Potential indicators of Pneumonia identified.")
      if (onAnalysisComplete) onAnalysisComplete(mockResult)
    }, 3000)
  }

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-black/[0.02] border border-slate-100 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-black mb-2">Medical Image Upload</h2>
            <p className="text-black font-bold">Upload X-rays or clinical images for AI-assisted assessment.</p>
          </div>

          <div 
            onClick={() => !file && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative w-full rounded-[2rem] border-2 border-dashed transition-all duration-500 ease-out
              ${isDragging 
                ? 'border-pastel-pink bg-pastel-pink/5 scale-[1.01]' 
                : preview 
                  ? 'border-slate-100 bg-slate-50/50' 
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-pastel-violet hover:shadow-lg cursor-pointer'
              }
              p-12 flex flex-col items-center justify-center min-h-[350px]
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
                  <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                    <UploadCloud className="w-10 h-10 text-pastel-violet" />
                  </div>
                  <span className="text-xl font-black text-black mb-2">
                    Drag and drop your file here
                  </span>
                  <span className="text-black font-bold mb-6">or click to browse from files</span>
                  <div className="px-6 py-2.5 rounded-full bg-white border border-slate-100 text-black text-xs font-bold uppercase tracking-widest shadow-sm">
                    JPEG, PNG, HEIC up to 15MB
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
                    className="absolute -top-6 -right-6 p-3 bg-white border border-slate-100 rounded-full text-black hover:text-pastel-pink hover:shadow-lg transition-all z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-full inline-block border-4 border-white">
                    <img src={preview} alt="Upload preview" className="max-h-[300px] object-contain" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-pastel-violet animate-spin mb-4" />
                        <span className="text-black font-black animate-pulse">Running AI Analysis...</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-black bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
                    <ImageIcon className="w-4 h-4 text-pastel-blue" />
                    <span className="text-sm font-bold truncate max-w-[250px]">{file?.name}</span>
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

          <div className="mt-12 flex justify-center">
            <motion.button
              whileHover={{ scale: preview && !isAnalyzing ? 1.05 : 1 }}
              whileTap={{ scale: preview && !isAnalyzing ? 0.95 : 1 }}
              onClick={runAnalysis}
              disabled={!preview || isAnalyzing}
              className={`
                relative group overflow-hidden px-12 py-5 rounded-[2rem] font-black text-xl transition-all duration-500 shadow-lg flex items-center space-x-3
                ${preview 
                  ? "bg-gradient-to-r from-pastel-pink to-pastel-violet text-white shadow-pastel-pink/20 hover:shadow-pastel-violet/40" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
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
                  <Sparkles className="w-6 h-6" />
                  <span>Run Analysis</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Success Indicator */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                className="mt-12 bg-pastel-green/10 rounded-[2rem] p-8 border border-pastel-green/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-pastel-green" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-2">Analysis Ready</h3>
                <p className="text-black font-bold leading-relaxed">
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
