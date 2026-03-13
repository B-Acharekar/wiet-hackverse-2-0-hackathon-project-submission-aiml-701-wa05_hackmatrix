"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Cpu, Zap, Target, BarChart3 } from "lucide-react"

const models = [
  { id: "densenet", name: "DenseNet121", tag: "Highest Accuracy", icon: <Target className="w-5 h-5" />, color: "text-pastel-pink", border: "border-pastel-pink", bg: "bg-pastel-pink/5" },
  { id: "resnet", name: "ResNet50", tag: "Best Recall", icon: <BarChart3 className="w-5 h-5" />, color: "text-pastel-blue", border: "border-pastel-blue", bg: "bg-pastel-blue/5" },
  { id: "efficientnet", name: "EfficientNet", tag: "Fast Inference", icon: <Zap className="w-5 h-5" />, color: "text-pastel-green", border: "border-pastel-green", bg: "bg-pastel-green/5" },
]

export default function ModelSelector() {
  const [selected, setSelected] = useState("densenet")

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/[0.02] border border-slate-100 h-full">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Diagnostic Engine</h2>
        <p className="text-slate-400 font-medium">Select the AI model architecture for analysis.</p>
      </div>

      <div className="space-y-4">
        {models.map((model) => (
          <motion.div
            key={model.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(model.id)}
            className={`cursor-pointer relative overflow-hidden p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center justify-between ${
              selected === model.id 
                ? `${model.border} ${model.bg}` 
                : "border-slate-50 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-100"
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${selected === model.id ? model.color : 'text-slate-300'}`}>
                {model.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-slate-700">{model.name}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${selected === model.id ? model.border : 'border-slate-200 text-slate-400'}`}>
                  {model.tag}
                </span>
              </div>
            </div>
            
            {selected === model.id && (
              <motion.div 
                layoutId="model-check"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
              >
                <div className={`w-3 h-3 rounded-full ${model.id === 'densenet' ? 'bg-pastel-pink' : model.id === 'resnet' ? 'bg-pastel-blue' : 'bg-pastel-green'}`}></div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-10 p-5 bg-pastel-blue/5 rounded-2xl border border-pastel-blue/10 flex items-start gap-4">
        <Cpu className="w-5 h-5 text-pastel-blue mt-1 flex-shrink-0" />
        <p className="text-slate-500 font-bold text-xs leading-relaxed">
          Proprietary HackMatrix engines are optimized for high-resolution medical imagery and compliant with global clinical data standards.
        </p>
      </div>
    </div>
  )
}
