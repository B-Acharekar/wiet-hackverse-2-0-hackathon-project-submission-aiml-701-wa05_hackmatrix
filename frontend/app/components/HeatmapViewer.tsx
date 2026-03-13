"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  EyeOff,
  SlidersHorizontal,
  Image as ImageIcon,
  Activity
} from "lucide-react"

interface HeatmapViewerProps {
  originalImage: string
  heatmapImage?: string
  severity?: string
  affectedArea?: number
}

export default function HeatmapViewer({
  originalImage,
  heatmapImage,
  severity,
  affectedArea
}: HeatmapViewerProps) {

  const [opacity, setOpacity] = useState(70)
  const [isVisible, setIsVisible] = useState(true)

  const severityColor =
    severity === "high"
      ? "bg-red-500"
      : severity === "medium"
      ? "bg-orange-400"
      : severity === "low"
      ? "bg-yellow-400"
      : "bg-slate-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto bg-slate-900 rounded-2xl p-8 shadow-2xl border border-white/10"
    >

      {/* Header */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-[#7DD3FC]" />
            AI Explainability
          </h3>

          <p className="text-sm text-slate-400">
            Heatmap showing areas the AI focused on
          </p>
        </div>

        {/* Controls */}

        <div className="flex items-center gap-6 bg-slate-800 p-3 rounded-xl border border-slate-700">

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-[#7DD3FC]" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-500" />
            )}

            {isVisible ? "Hide Map" : "Show Map"}
          </button>

          <div className="w-px h-8 bg-slate-600"></div>

          <div className="flex items-center gap-3 w-48">

            <SlidersHorizontal className="w-4 h-4 text-[#6EE7B7]" />

            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              disabled={!isVisible}
              className="w-full"
            />

            <span className="text-xs text-slate-400 w-8 text-right">
              {opacity}%
            </span>

          </div>

        </div>

      </div>

      {/* Images */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Original Image */}

        <div className="bg-slate-900 rounded-2xl p-2 border border-slate-700">

          <div className="relative rounded-xl overflow-hidden aspect-square">

            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
              <span className="text-xs text-white uppercase">
                Original
              </span>
            </div>

          </div>

        </div>

        {/* Heatmap Overlay */}

        <div className="bg-slate-900 rounded-2xl p-2 border border-[#7DD3FC]/40">

          <div className="relative rounded-xl overflow-hidden aspect-square">

            {/* Base X-ray */}

            <img
              src={originalImage}
              alt="Base"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Heatmap */}

            {heatmapImage && (
              <motion.img
                src={heatmapImage}
                alt="Heatmap"
                animate={{
                  opacity: isVisible ? opacity / 100 : 0
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
              />
            )}

            <div className="absolute top-3 right-3 bg-[#7DD3FC]/20 px-3 py-1 rounded-full">
              <span className="text-xs text-[#7DD3FC] uppercase">
                AI Focus
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Severity Section */}

      {(severity || affectedArea !== undefined) && (

        <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">

          <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#6EE7B7]" />
            Infection Severity Analysis
          </h4>

          {severity && (
            <p className="text-slate-300 mb-2">
              Severity Level:
              <span className="ml-2 font-bold text-white">
                {severity}
              </span>
            </p>
          )}

          {affectedArea !== undefined && (

            <>
              <p className="text-slate-300 mb-2">
                Affected Lung Area: {(affectedArea * 100).toFixed(1)}%
              </p>

              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

                <div
                  className={`${severityColor} h-3`}
                  style={{ width: `${affectedArea * 100}%` }}
                />

              </div>

            </>

          )}

        </div>

      )}

    </motion.div>
  )
}
