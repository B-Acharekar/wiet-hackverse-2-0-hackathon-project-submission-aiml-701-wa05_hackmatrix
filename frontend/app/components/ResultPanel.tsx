"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Activity, 
  Info, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Stethoscope,
  RotateCcw,
  Zap,
  ShieldCheck,
  ArrowRight,
  Image as ImageIcon
} from "lucide-react"

export interface DiagnosisResult {
  diseaseId: string;
  prediction: string;
  confidence: number;
  explanation: string;
  nextSteps: string[];
  severity: "low" | "medium" | "high";
  heatmapUrl?: string;
}

interface ResultPanelProps {
  result: DiagnosisResult | null;
  onReset?: () => void;
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  if (!result) return null;

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case "high":
        return {
          badge: "bg-rose-50 text-rose-500 border-rose-100",
          icon: <AlertCircle className="w-5 h-5" />
        }
      case "medium":
        return {
          badge: "bg-amber-50 text-amber-500 border-amber-100",
          icon: <AlertCircle className="w-5 h-5" />
        }
      default:
        return {
          badge: "bg-emerald-50 text-emerald-500 border-emerald-100",
          icon: <CheckCircle2 className="w-5 h-5" />
        }
    }
  }

  const { badge, icon } = getSeverityStyles(result.severity)
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 md:p-12 shadow-xl shadow-black/[0.05] border border-black/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pastel-pink to-pastel-violet"></div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Score Column */}
        <div className="md:w-1/3 flex flex-col items-center justify-center space-y-8 border-b md:border-b-0 md:border-r border-black/5 pb-8 md:pb-0 md:pr-12">
          <div className="space-y-2 text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-black opacity-60">Analysis Output</span>
            <h2 className="text-4xl font-black text-black uppercase tracking-tight">{result.prediction}</h2>
          </div>

          <div className="relative w-48 h-48">
             <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="84" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                <motion.circle 
                  cx="96" cy="96" r="84" 
                  fill="transparent" 
                  stroke="url(#conf-grad)" 
                  strokeWidth="12" 
                  strokeDasharray={2 * Math.PI * 84}
                  initial={{ strokeDashoffset: 2 * Math.PI * 84 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 84 * (1 - result.confidence) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="butt"
                />
                <defs>
                   <linearGradient id="conf-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FCA5B0" />
                      <stop offset="100%" stopColor="#C084FC" />
                   </linearGradient>
                </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-black">{confidencePercent}%</span>
                <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1 opacity-60">Match Quality</span>
             </div>
          </div>

          <div className={`px-6 py-3 rounded-lg border ${badge} flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-sm`}>
            {icon}
            <span>{result.severity} Priority</span>
          </div>
        </div>

        {/* Right: Details Column */}
        <div className="md:w-2/3 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-pastel-violet">
              <Zap className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">AI Insights</h3>
            </div>
            <p className="text-black text-lg leading-relaxed font-bold bg-white p-8 rounded-xl border border-black/5 shadow-inner">
              {result.explanation}
            </p>
          </section>

          {result.heatmapUrl && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-pastel-pink">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Medical Visualization (Grad-CAM)</h3>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-black/5 shadow-xl bg-white p-4 inline-block">
                <img 
                  src={result.heatmapUrl} 
                  alt="Grad-CAM Heatmap" 
                  className="max-h-[400px] rounded-lg object-contain w-full"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <p className="mt-4 text-[11px] font-bold text-black/50 italic px-2">
                  * Colored regions indicate areas of high interest identified by the neural network.
                </p>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-pastel-green">
              <Stethoscope className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Clinical Pathways</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.nextSteps.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white rounded-xl p-5 border border-black/5 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <ArrowRight className="w-5 h-5 text-pastel-pink mt-0.5 flex-shrink-0" />
                  <span className="text-black font-bold text-sm leading-snug">{step}</span>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="pt-8 flex flex-wrap gap-4 items-center border-t border-black/5">
            <Link 
              href={`/disease-info?id=${result.diseaseId}`}
              className="flex-1 min-w-[240px] flex items-center justify-between px-10 py-5 bg-black text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl"
            >
              <span>Explore Clinical Data</span>
              <ChevronRight className="w-5 h-5 text-pastel-pink" />
            </Link>
            
            {onReset && (
              <button 
                onClick={onReset}
                className="px-10 py-5 bg-white border border-black/10 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            )}
            
            <div className="flex items-center gap-3 text-black/40 ml-auto bg-slate-50 px-6 py-3 rounded-lg border border-black/5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Ver. 4.0</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
