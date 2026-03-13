"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Cpu, Zap, Target, BarChart3 } from "lucide-react"

const models = [
  { id: "densenet", name: "Highest Accuracy", tag: "DenseNet121", icon: <Target className="w-5 h-5" />, color: "text-pastel-pink", border: "border-pastel-pink", bg: "bg-pastel-pink/5" },
  { id: "resnet", name: "Best Recall", tag: "ResNet50", icon: <BarChart3 className="w-5 h-5" />, color: "text-pastel-blue", border: "border-pastel-blue", bg: "bg-pastel-blue/5" },
  { id: "efficientnet", name: "Fast Inference", tag: "EfficientNet", icon: <Zap className="w-5 h-5" />, color: "text-pastel-green", border: "border-pastel-green", bg: "bg-pastel-green/5" },
]

export default function ModelSelector() {
  const [selected, setSelected] = useState("densenet")
  const [isOpen, setIsOpen] = useState(false)

  const selectedModel = models.find(m => m.id === selected)

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/[0.02] border border-slate-100 h-full">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-black mb-2">Diagnostic Engine</h2>
        <p className="text-black font-bold">Select the AI clinical engine for image processing.</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center justify-between text-left ${
            selectedModel ? `${selectedModel.border} ${selectedModel.bg}` : "border-slate-50 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${selectedModel?.color}`}>
              {selectedModel?.icon}
            </div>
            <div>
              <p className="text-lg font-black text-black">{selectedModel?.name}</p>
              <p className="text-xs font-bold text-black uppercase tracking-widest">{selectedModel?.tag}</p>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-3 p-3 bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelected(model.id)
                  setIsOpen(false)
                }}
                className={`w-full p-5 rounded-2xl transition-all flex items-center gap-4 hover:bg-slate-50 text-left ${
                  selected === model.id ? "bg-slate-50" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${model.color}`}>
                  {model.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-black text-sm">{model.name}</p>
                  <p className="text-[10px] font-bold text-black uppercase tracking-[0.1em]">{model.tag}</p>
                </div>
                {selected === model.id && (
                   <div className={`w-2.5 h-2.5 rounded-full ${model.color.replace('text', 'bg')}`} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-10 p-6 bg-pastel-blue/5 rounded-3xl border border-pastel-blue/10 flex items-start gap-4">
        <Cpu className="w-5 h-5 text-pastel-blue mt-1 flex-shrink-0" />
        <p className="text-black font-bold text-xs leading-relaxed">
          Proprietary <span className="text-pastel-blue underline decoration-dotted">MediSeen</span> clinical engines are optimized for high-resolution imagery and HIPAA-compliant data routing.
        </p>
      </div>
    </div>
  )
}
