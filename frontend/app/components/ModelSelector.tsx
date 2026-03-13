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
    <section className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-black/5 shadow-sm space-y-8 h-full">
      <div className="flex items-center gap-3 border-b border-black/5 pb-4">
        <div className="w-10 h-10 rounded-lg bg-pastel-violet/20 flex items-center justify-center text-pastel-violet shadow-sm">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-black">Diagnostic Intelligence</h3>
          <p className="text-[10px] text-black font-bold uppercase tracking-widest opacity-60">Select AI Architecture</p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-5 rounded-xl border border-black/5 bg-white shadow-sm transition-all duration-300 flex items-center justify-between text-left ${
            selectedModel ? `${selectedModel.border} ${selectedModel.bg}` : "border-slate-50 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${selectedModel?.color}`}>
              {selectedModel?.icon}
            </div>
            <div>
              <p className="text-sm font-black text-black">{selectedModel?.name}</p>
              <p className="text-[10px] font-bold text-black uppercase tracking-widest opacity-60">{selectedModel?.tag}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 p-2 bg-white rounded-xl border border-black/5 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelected(model.id)
                  setIsOpen(false)
                }}
                className={`w-full p-4 rounded-lg transition-all flex items-center gap-4 hover:bg-slate-50 text-left ${
                  selected === model.id ? "bg-slate-50" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${model.color}`}>
                  {model.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-black text-sm">{model.name}</p>
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest opacity-60">{model.tag}</p>
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
