"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import UploadPanel from "../components/UploadPanel"
import ResultPanel, { DiagnosisResult } from "../components/ResultPanel"
import PatientForm from "../components/PatientForm"
import ModelSelector from "../components/ModelSelector"
import HeatmapViewer from "../components/HeatmapViewer"

export default function UploadPage() {
  const [analysisResult, setAnalysisResult] = useState<DiagnosisResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleReset = () => {
    setAnalysisResult(null)
    setUploadedImage(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 pb-32">
      {/* Page Header */}
      <header className="space-y-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
          Clinical <span className="text-pastel-violet underline decoration-black/10">Diagnosis</span> Tool
        </h1>
        <p className="text-xl text-black font-bold max-w-3xl">
          Complete the patient profile and upload imagery for a comprehensive AI-assisted evaluation.
        </p>
      </header>

      {/* Main Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col: Patient Info & Model Selector */}
        <div className="lg:col-span-7 space-y-10">
          <section>
            <PatientForm />
          </section>
          
          <section>
            <ModelSelector />
          </section>
        </div>

        {/* Right Col: Upload & Results */}
        <div className="lg:col-span-5 space-y-10">
          <section className="sticky top-12">
            <UploadPanel 
              onAnalysisComplete={(res) => setAnalysisResult(res)}
              onImageUpload={(img) => setUploadedImage(img)}
            />
          </section>
        </div>
      </div>

      {/* Result Section (Full Width when analysis is done) */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12 pt-12 border-t border-slate-100"
          >
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-black">Final Assessment</h2>
               <p className="text-black font-bold">Detailed findings and AI-generated heatmap visualizations.</p>
            </div>
            
            <ResultPanel result={analysisResult} onReset={handleReset} />
            
            {uploadedImage && (
              <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <HeatmapViewer originalImage={uploadedImage} />
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
