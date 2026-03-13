"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, SlidersHorizontal, Image as ImageIcon } from "lucide-react"

interface HeatmapViewerProps {
  originalImage: string;
  heatmapImage?: string; // Optional, if not provided we'll use a CSS gradient overlay for mock purposes
}

export default function HeatmapViewer({ originalImage, heatmapImage }: HeatmapViewerProps) {
  const [opacity, setOpacity] = useState(60)
  const [isVisible, setIsVisible] = useState(true)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-10 shadow-2xl border border-white/10 transition-shadow duration-300"
    >
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-[#7DD3FC]" />
            AI Explainability
          </h3>
          <p className="text-sm text-slate-400">
            Heatmap showing areas the AI focused on for its prediction
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-6 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 w-full sm:w-auto">
          {/* Toggle Button */}
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-[#7DD3FC]" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-500" />
            )}
            {isVisible ? "Hide Map" : "Show Map"}
          </button>

          <div className="w-px h-8 bg-slate-700"></div>

          {/* Opacity Slider */}
          <div className="flex items-center gap-3 flex-1 sm:w-48">
            <SlidersHorizontal className="w-4 h-4 text-[#6EE7B7]" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={opacity} 
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              disabled={!isVisible}
              className={`w-full h-1.5 rounded-full appearance-none cursor-pointer transition-opacity ${
                isVisible ? "opacity-100" : "opacity-30"
              }`}
              style={{
                background: `linear-gradient(to right, #6EE7B7 ${opacity}%, #334155 ${opacity}%)`
              }}
            />
            <span className="text-xs font-bold text-slate-400 w-8 text-right">
              {isVisible ? opacity : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Viewing Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="hidden md:flex absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 bg-[#7DD3FC]/20 rounded-full items-center justify-center z-20 backdrop-blur-md border border-[#7DD3FC]/40 shadow-[0_0_15px_rgba(125,211,252,0.3)]">
          <div className="w-3 h-3 bg-[#7DD3FC] rounded-full animate-pulse"></div>
        </div>

        {/* Original Image */}
        <div className="bg-slate-900 rounded-2xl p-2 border border-slate-700 shadow-inner group">
          <div className="relative rounded-xl overflow-hidden aspect-square bg-black/40 flex items-center justify-center">
            <img 
              src={originalImage} 
              alt="Original Clinical Scan" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-xs font-semibold text-white tracking-widest uppercase">Original</span>
            </div>
          </div>
        </div>

        {/* Heatmap Image */}
        <div className="bg-slate-900 rounded-2xl p-2 border border-[#7DD3FC]/40 shadow-[0_0_30px_rgba(125,211,252,0.1)] group transition-all duration-300">
          <div className="relative rounded-xl overflow-hidden aspect-square bg-black/40 flex items-center justify-center">
            
            {/* The base original image */}
            <img 
              src={originalImage} 
              alt="Base for heatmap" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* The heatmap overlay layer */}
            <motion.div 
              initial={false}
              animate={{ opacity: isVisible ? opacity / 100 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-10 w-full h-full mix-blend-screen"
            >
              {heatmapImage ? (
                <img src={heatmapImage} alt="AI Heatmap" className="w-full h-full object-cover filter contrast-125 saturate-150 rounded-xl" />
              ) : (
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/80 via-amber-500/40 to-transparent"></div>
              )}
            </motion.div>

            <div className="absolute top-3 right-3 bg-[#7DD3FC]/20 backdrop-blur-md px-3 py-1 rounded-full border border-[#7DD3FC]/30 z-20">
              <span className="text-xs font-semibold text-[#7DD3FC] tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-pulse"></span>
                AI Focus
              </span>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  )
}
