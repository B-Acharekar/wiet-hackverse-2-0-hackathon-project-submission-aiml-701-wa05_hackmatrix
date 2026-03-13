"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import HeatmapViewer from "./HeatmapViewer"
import {
AlertCircle,
CheckCircle2,
Stethoscope,
RotateCcw,
Zap,
ShieldCheck,
ArrowRight,
ChevronRight
} from "lucide-react"

export interface DiagnosisResult {
diseaseId: string
prediction: string
confidence: number
explanation: string
nextSteps: string[]
severity: "low" | "medium" | "high"
heatmap?: string
affectedArea?: number
originalImage?: string
}

interface ResultPanelProps {
result: DiagnosisResult | null
onReset?: () => void
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {

if (!result) return null

const getSeverityStyles = (severity: string) => {
switch (severity) {
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
  <div>

    <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm space-y-6"
>

  {/* Prediction */}
  <div className="flex items-center justify-between">

    <div>
      <p className="text-sm uppercase tracking-wider text-gray-500">
        Diagnosis
      </p>

      <h3 className="text-3xl font-black text-black">
        {result.prediction}
      </h3>
    </div>

    <div
      className={`px-5 py-2 rounded-lg border font-bold text-sm ${badge}`}
    >
      {icon}
    </div>

  </div>

  {/* Confidence */}

  <div className="space-y-2">
    <p className="text-sm text-gray-500 uppercase tracking-wider">
      AI Confidence
    </p>

    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

      <div
        className="bg-black h-3"
        style={{ width: `${confidencePercent}%` }}
      />

    </div>

    <p className="text-sm font-bold">
      {confidencePercent}% certainty
    </p>

  </div>

  {/* Explanation */}

  <div>
    <p className="text-sm uppercase text-gray-500 tracking-wider mb-2">
      AI Explanation
    </p>

    <p className="text-black font-medium leading-relaxed">
      {result.explanation}
    </p>
  </div>

  {/* Clinical Steps */}

  <div>

    <p className="text-sm uppercase text-gray-500 tracking-wider mb-3">
      Recommended Clinical Actions
    </p>

    <div className="space-y-2">

      {result.nextSteps.map((step, i) => (
        <div
          key={i}
          className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3"
        >
          <ArrowRight className="w-4 h-4 mt-1" />

          <span className="text-sm font-medium">
            {step}
          </span>

        </div>
      ))}

    </div>

  </div>

</motion.div>


    {result.heatmap && result.originalImage && (
  <HeatmapViewer
    originalImage={result.originalImage}
    heatmapImage={result.heatmap}
    severity={result.severity}
    affectedArea={result.affectedArea}
  />
)}


  </div>
)
}

