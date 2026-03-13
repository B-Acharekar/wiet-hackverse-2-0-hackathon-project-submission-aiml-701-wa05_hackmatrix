"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import UploadPanel from "../components/UploadPanel"
import ResultPanel, { DiagnosisResult } from "../components/ResultPanel"
import PatientForm from "../components/PatientForm"
import ModelSelector from "../components/ModelSelector"
import HeatmapViewer from "../components/HeatmapViewer"
import { FileText, Eye, MessageSquare, ClipboardCheck, ChevronDown, Download, Printer } from "lucide-react"

export default function DiagnosePage() {
  const [analysisResult, setAnalysisResult] = useState<DiagnosisResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [doctorNotes, setDoctorNotes] = useState("")

  const handleReset = () => {
    setAnalysisResult(null)
    setUploadedImage(null)
    setShowHeatmap(false)
    setShowReport(false)
    setDoctorNotes("")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 pb-32 pt-12">
      {/* Page Header */}
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight uppercase">
          Clinical <span className="text-pastel-violet underline decoration-black/10">Diagnosis</span> Core
        </h1>
        <p className="text-xl text-black font-bold max-w-3xl opacity-80">
          Capture patient records and leverage advanced clinical AI for multi-modal medical evaluation.
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
          <section className="sticky top-28">
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
            className="space-y-16 pt-16 border-t-4 border-black/5"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Clinical Verification Active
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">Final Assessment</h2>
                  <p className="text-black font-bold opacity-70">Model insights, explainability visualizations, and clinical reporting.</p>
               </div>

               {/* Action Buttons for Heatmap and Report */}
               <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 ${
                      showHeatmap ? 'bg-pastel-blue text-black border-2 border-black/10' : 'bg-black text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {showHeatmap ? 'Hide Heatmap' : 'Visual Heatmap'}
                  </button>

                  <button 
                    onClick={() => setShowReport(!showReport)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 ${
                      showReport ? 'bg-pastel-pink text-black border-2 border-black/10' : 'bg-black text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    {showReport ? 'Hide Report' : 'Clinical Report'}
                  </button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2">
                  <ResultPanel result={analysisResult} onReset={handleReset} />
               </div>

               {/* DOCTOR FEEDBACK SECTION */}
               <div className="space-y-8">
                  <section className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-black/5 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-pastel-violet/10 flex items-center justify-center text-pastel-violet">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-black">Doctor's Feedback</h3>
                        <p className="text-[10px] font-black text-black uppercase opacity-60 tracking-widest">Clinical Observations</p>
                      </div>
                    </div>
                    
                    <textarea 
                      className="w-full h-48 p-5 rounded-xl bg-white border border-black/10 text-black font-bold text-sm focus:ring-4 focus:ring-pastel-violet/10 focus:border-pastel-violet transition-all resize-none shadow-inner"
                      placeholder="Enter specific clinical observations, diagnosis confirmation, or medication adjustments..."
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                    ></textarea>
                    
                    <button className="w-full mt-6 py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95">
                      Save Clinical Notes
                    </button>
                  </section>
               </div>
            </div>
            
            {/* HEATMAP VIEWER */}
            <AnimatePresence>
              {showHeatmap && uploadedImage && (
                <motion.section 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl border border-white/5 shadow-2xl overflow-hidden p-2">
                    <HeatmapViewer originalImage={uploadedImage} />
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* CLINICAL REPORT PREVIEW */}
            <AnimatePresence>
              {showReport && (
                <motion.section
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl border-4 border-black p-12 shadow-2xl space-y-12"
                >
                  <div className="flex justify-between items-start border-b-2 border-black pb-8">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black text-black italic">MediSeen Clinical Report</h3>
                       <p className="text-xs font-black uppercase tracking-[0.3em] text-black/40">Generated by MediSeen Intelligence • v.4.0.2</p>
                    </div>
                    <div className="flex gap-4">
                       <button className="p-3 rounded-lg border border-black shadow-sm bg-white hover:bg-slate-50 transition-all">
                          <Printer className="w-5 h-5" />
                       </button>
                       <button className="p-3 rounded-lg border border-black shadow-sm bg-black text-white hover:scale-110 transition-all">
                          <Download className="w-5 h-5" />
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-black/40">Patient Name</p>
                        <p className="font-bold text-black uppercase">John Doe</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-black/40">Report Date</p>
                        <p className="font-bold text-black uppercase">March 13, 2026</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-black/40">Case Reference</p>
                        <p className="font-bold text-black uppercase">#MS-99421-B</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-black/40">Clinical Engine</p>
                        <p className="font-bold text-black uppercase">DenseNet-121 (Acc. Opt)</p>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="p-10 rounded-xl bg-slate-50 border-2 border-black/5">
                        <h4 className="text-xl font-black text-black mb-4 uppercase tracking-tight">Executive AI Summary</h4>
                        <p className="text-black leading-relaxed font-bold">
                          The comprehensive image analysis has identified key clinical markers associated with {analysisResult.prediction}. 
                          Confidence interval stands at {(analysisResult.confidence * 100).toFixed(1)}%, with specific focus in the 
                          morphological disruptions observed in the uploaded scan. The severity is categorized as {analysisResult.severity.toUpperCase()} PRIORITY, 
                          requiring immediate clinical correlation.
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <h4 className="text-sm font-black text-black uppercase tracking-widest border-b border-black/10 pb-2">Technical Observations</h4>
                           <ul className="space-y-3">
                              {analysisResult.explanation.split('.').filter(s => s.trim().length > 0).map((s, i) => (
                                <li key={i} className="text-sm font-bold text-black flex items-start gap-3">
                                   <div className="w-2 h-2 rounded-full bg-pastel-violet mt-1.5 flex-shrink-0" />
                                   {s.trim()}.
                                </li>
                              ))}
                           </ul>
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-sm font-black text-black uppercase tracking-widest border-b border-black/10 pb-2">Pathways & Protocol</h4>
                           <ul className="space-y-3">
                              {analysisResult.nextSteps.map((s, i) => (
                                <li key={i} className="text-sm font-bold text-black flex items-start gap-3">
                                   <div className="w-2 h-2 rounded bg-pastel-green mt-1.5 flex-shrink-0" />
                                   {s}
                                </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-black/10 flex justify-between items-end">
                     <div className="w-48 h-12 border-b border-black flex items-end pb-2">
                        <span className="text-[10px] font-black uppercase text-black/20">Digital Signature</span>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-black">MediSeen AI Assurance 4.8</p>
                        <p className="text-[10px] font-bold text-black/40">Secure Hash: 92F-A00-X12-K99</p>
                     </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
