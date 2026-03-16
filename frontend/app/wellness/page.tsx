"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  HeartPulse, 
  Sun, 
  Activity, 
  Shield, 
  Smile,
  Zap,
  Leaf,
  Wind
} from "lucide-react"

export const conditions = [
  { id: "pneumonia", name: "Pneumonia", icon: <Activity className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
  { id: "eczema", name: "Eczema", icon: <Smile className="w-6 h-6" />, color: "bg-pink-100 text-pink-600" },
  { id: "psoriasis", name: "Psoriasis", icon: <Shield className="w-6 h-6" />, color: "bg-purple-100 text-purple-600" },
  { id: "melanoma", name: "Melanoma", icon: <Sun className="w-6 h-6" />, color: "bg-amber-100 text-amber-600" },
  { id: "ringworm", name: "Ringworm", icon: <HeartPulse className="w-6 h-6" />, color: "bg-emerald-100 text-emerald-600" },
  { id: "warts", name: "Warts", icon: <Shield className="w-6 h-6" />, color: "bg-cyan-100 text-cyan-600" },
  { id: "molluscum-contagiosum", name: "Molluscum", icon: <Smile className="w-6 h-6" />, color: "bg-rose-100 text-rose-600" },
  { id: "acne", name: "Acne", icon: <Zap className="w-6 h-6" />, color: "bg-indigo-100 text-indigo-600" },
  { id: "rosacea", name: "Rosacea", icon: <Leaf className="w-6 h-6" />, color: "bg-orange-100 text-orange-600" },
  { id: "vitiligo", name: "Vitiligo", icon: <Sun className="w-6 h-6" />, color: "bg-teal-100 text-teal-600" },
  { id: "impetigo", name: "Impetigo", icon: <Wind className="w-6 h-6" />, color: "bg-sky-100 text-sky-600" },
  { id: "contact-dermatitis", name: "Dermatitis", icon: <Smile className="w-6 h-6" />, color: "bg-fuchsia-100 text-fuchsia-600" },
]

export default function WellnessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-12">
        {/* Page Header */}
        <header className="space-y-4 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-xs font-black uppercase tracking-widest"
          >
            Wellness Module
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Wellness <span className="text-blue-600 underline decoration-blue-600/20">Directory</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
            Personalized recovery guides and AI-driven nutrition plans for better health management.
          </p>
        </header>

        {/* Conditions Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {conditions.map((condition, i) => (
            <Link key={condition.id} href={`/wellness/${condition.id}`} className="group block h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 h-full rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-6 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-600/10 group-hover:-translate-y-2 group-hover:border-blue-600/30"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${condition.color}`}>
                  {condition.icon}
                </div>
                <div className="text-center space-y-1">
                  <span className="block font-black text-sm uppercase tracking-widest text-slate-900">{condition.name}</span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">View Recovery Guide</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
