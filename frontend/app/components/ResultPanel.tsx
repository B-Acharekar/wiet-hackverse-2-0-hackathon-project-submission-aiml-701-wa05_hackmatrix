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
  ArrowRight
} from "lucide-react"

export interface DiagnosisResult {
  diseaseId: string;
  prediction: string;
  confidence: number;
  explanation: string;
  nextSteps: string[];
  severity: "low" | "medium" | "high";
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-black/[0.02] border border-slate-100 relative overflow-hidden"
    >
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pastel-pink to-pastel-violet"></div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Score Column */}
        <div className="md:w-1/3 flex flex-col items-center justify-center space-y-8 border-b md:border-b-0 md:border-r border-slate-50 pb-8 md:pb-0 md:pr-12">
          <div className="space-y-2 text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Analysis Output</span>
            <h2 className="text-4xl font-black text-black">{result.prediction}</h2>
          </div>

          <div className="relative w-48 h-48">
             <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="84" fill="transparent" stroke="#F8FAFC" strokeWidth="10" />
                <motion.circle 
                  cx="96" cy="96" r="84" 
                  fill="transparent" 
                  stroke="url(#conf-grad)" 
                  strokeWidth="10" 
                  strokeDasharray={2 * Math.PI * 84}
                  initial={{ strokeDashoffset: 2 * Math.PI * 84 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 84 * (1 - result.confidence) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                   <linearGradient id="conf-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD1DC" />
                      <stop offset="100%" stopColor="#E0BBE4" />
                   </linearGradient>
                </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-black">{confidencePercent}%</span>
                <span className="text-xs font-bold text-black uppercase tracking-widest mt-1">Match Quality</span>
             </div>
          </div>

          <div className={`px-6 py-2.5 rounded-full border ${badge} flex items-center gap-2 font-black text-sm shadow-sm`}>
            {icon}
            <span className="capitalize">{result.severity} Priority</span>
          </div>
        </div>

        {/* Right: Details Column */}
        <div className="md:w-2/3 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-pastel-violet">
              <Zap className="w-5 h-5" />
              <h3 className="text-lg font-black uppercase tracking-tight">AI Insights</h3>
            </div>
            <p className="text-black text-lg leading-relaxed font-medium bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-50">
              {result.explanation}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-pastel-green">
              <Stethoscope className="w-5 h-5" />
              <h3 className="text-lg font-black uppercase tracking-tight">Clinical Pathways</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.nextSteps.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <ArrowRight className="w-4 h-4 text-pastel-pink mt-1 flex-shrink-0" />
                  <span className="text-black font-bold text-sm leading-snug">{step}</span>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="pt-8 flex flex-wrap gap-4 items-center border-t border-slate-50">
            <Link 
              href={`/disease-info?id=${result.diseaseId}`}
              className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-pastel-pink to-pastel-violet text-black font-black rounded-full shadow-lg shadow-pastel-pink/20 hover:scale-105 transition-all"
            >
              Learn More About {result.prediction}
              <ChevronRight className="w-5 h-5" />
            </Link>
            
            {onReset && (
              <button 
                onClick={onReset}
                className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-black font-black rounded-full hover:bg-slate-50 transition-all shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                New Case
              </button>
            )}
            
            <div className="flex items-center gap-2 text-black/40 ml-auto">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Model</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
