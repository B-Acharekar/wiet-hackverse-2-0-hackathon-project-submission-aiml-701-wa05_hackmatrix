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

    <motion.div>
      RESULT PANEL UI
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

