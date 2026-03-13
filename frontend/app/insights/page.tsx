"use client"

import { motion } from "framer-motion"
import { 
  BarChart3, 
  Target, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  ChevronRight
} from "lucide-react"

const metrics = [
  { 
    name: "System Accuracy", 
    value: "98.4%", 
    change: "+1.2%", 
    icon: <Target className="text-pastel-pink" />, 
    bg: "bg-pastel-pink/10" 
  },
  { 
    name: "Average Inference", 
    value: "250ms", 
    change: "-40ms", 
    icon: <Zap className="text-pastel-blue" />, 
    bg: "bg-pastel-blue/10" 
  },
  { 
    name: "True Recall", 
    value: "97.1%", 
    change: "+0.5%", 
    icon: <Activity className="text-pastel-green" />, 
    bg: "bg-pastel-green/10" 
  },
]

const models = [
  {
    name: "DenseNet121 v4",
    type: "Highest Accuracy",
    accuracy: 99.2,
    sensitivity: 98.4,
    specificity: 97.9,
    color: "from-pastel-pink to-[#FFB7C5]",
    icon: <BrainCircuit />
  },
  {
    name: "ResNet50 v2",
    type: "Best Recall",
    accuracy: 97.8,
    sensitivity: 99.1,
    specificity: 96.5,
    color: "from-pastel-blue to-[#A5B4FC]",
    icon: <Target />
  },
  {
    name: "EfficientNet-B7",
    type: "Fast Inference",
    accuracy: 96.5,
    sensitivity: 95.8,
    specificity: 98.2,
    color: "from-pastel-green to-[#B2E2D2]",
    icon: <Zap />
  }
]

export default function InsightsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-24 pb-32">
      
      {/* Header */}
      <header className="space-y-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
          AI Model <span className="text-pastel-pink underline decoration-black/10">Insights</span>
        </h1>
        <p className="text-xl text-black font-bold max-w-2xl">
          Detailed performance metrics and architectural benchmarks across our clinical diagnostic engines.
        </p>
      </header>

      {/* Global Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-xl ${metric.bg} flex items-center justify-center mb-10 shadow-inner`}>
              <div className="scale-110">{metric.icon}</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-black font-black uppercase tracking-widest text-[10px] opacity-60">{metric.name}</span>
                <span className="text-emerald-500 font-black text-xs flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {metric.change}
                </span>
              </div>
              <p className="text-4xl font-black text-black">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Model Performance Cards */}
      <section className="space-y-12">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-black">Architecture Performance</h2>
          <p className="text-black font-bold">Comparative benchmarking for clinical decision support.</p>
        </div>

        <div className="space-y-8">
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-black/5 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:p-6">
                {/* Visual Circle - Made Boxy */}
                <div className={`w-40 h-40 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center text-black relative overflow-hidden flex-shrink-0 shadow-lg`}>
                  <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 scale-[2.5]">{model.icon}</div>
                </div>
 
                {/* Info & Stats */}
                <div className="flex-1 space-y-6 w-full px-4 lg:px-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-black uppercase tracking-tight">{model.name}</h3>
                      <p className="text-black font-bold text-xs tracking-widest uppercase opacity-60">{model.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-6 py-2 rounded-lg bg-black text-white font-black text-[10px] uppercase border border-black/10 italic shadow-lg">Production Ready</span>
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: "Accuracy", value: model.accuracy },
                      { label: "Sensitivity", value: model.sensitivity },
                      { label: "Specificity", value: model.specificity },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-black">
                          <span>{stat.label}</span>
                          <span className="text-black">{stat.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stat.value}%` }}
                            className={`h-full bg-gradient-to-r ${model.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center px-8 border-l border-black/5">
                  <button className="w-14 h-14 rounded-xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  )
}
