"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  MessageCircle, 
  Sparkles, 
  ChevronRight,
  Heart,
  Calendar,
  ShieldCheck
} from "lucide-react"
import { LungsIllustration, SkinRashArmIllustration, MedicalAssistanceIllustration } from "./components/Illustrations"

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-24 pb-32">
      
      {/* 1. Welcoming Header Section */}
      <section className="relative overflow-hidden rounded-2xl p-12 md:p-20 bg-gradient-to-br from-pastel-pink to-pastel-violet min-h-[400px] flex flex-col justify-center shadow-2xl shadow-pastel-pink/20 border border-white/20">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/30 rounded-full mix-blend-overlay filter blur-3xl -mr-20 -mt-20 scale-150 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full mix-blend-overlay filter blur-2xl -ml-16 -mb-16 scale-125"></div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/40 border border-white/50 text-[10px] font-black uppercase tracking-widest text-black shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            Empowering Your Clinical Decisions
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-black leading-[1.0] uppercase tracking-tighter"
          >
            Welcome Back
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-black font-bold leading-relaxed max-w-xl opacity-90"
          >
            The MediSeen AI assistant is ready to help you analyze medical imagery and manage patient cases with ease.
          </motion.p>
        </div>
        
        {/* Abstract Illustration placement */}
        <div className="absolute right-20 bottom-0 hidden md:flex items-center justify-center translate-y-8">
           <MedicalAssistanceIllustration className="w-80 h-80 opacity-60" bgColor="rgba(255,255,255,0.4)" />
        </div>
      </section>

      {/* 2. Interactive Quick Actions Grid */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-black">Quick Actions</h2>
            <p className="text-black font-bold">Tools to streamline your clinical workflow</p>
          </div>
          <Link href="/diagnose" className="text-black font-black flex items-center gap-3 hover:gap-4 transition-all uppercase text-[10px] tracking-[0.2em] bg-white px-8 py-4 rounded-xl border border-black/10 shadow-sm hover:shadow-md">
            Clinical Tools <ChevronRight className="w-4 h-4 text-pastel-violet" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "New Diagnosis", 
              desc: "Upload imagery for AI-assisted analysis and grading", 
              icon: <Plus />, 
              color: "bg-pastel-pink", 
              link: "/diagnose" 
            },
            { 
              title: "Patient Files", 
              desc: "Securely review clinical history and case logs", 
              icon: <Search />, 
              color: "bg-pastel-blue", 
              link: "/diagnose" 
            },
            { 
              title: "Clinical Chat", 
              desc: "Real-time AI consultation for complex diagnostics", 
              icon: <MessageCircle />, 
              color: "bg-pastel-violet", 
              link: "/communication" 
            },
          ].map((item, i) => (
            <Link key={item.title} href={item.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flo-card p-12 h-full flex flex-col justify-between hover:shadow-2xl transition-all border-b-4 border-black/5"
              >
                <div className={`w-16 h-16 rounded-xl ${item.color} flex items-center justify-center text-black shadow-lg border border-white/20 mb-8`}>
                  <div className="scale-125">{item.icon}</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-black">{item.title}</h3>
                  <p className="text-black font-bold leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Educational Highlights Section */}
      <section className="space-y-12">
        <div className="flex items-end justify-between px-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-black">Knowledge Hub</h2>
            <p className="text-black font-bold">Latest clinical guides and skin problem research</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Lungs Knowledge Card */}
          <Link href="/disease-info?id=pneumonia" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-black/10 p-10 flex items-center gap-10 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-green/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 w-44 h-44 flex-shrink-0">
                <LungsIllustration className="w-full h-full" bgColor="#D4F4E2" />
              </div>
              <div className="relative z-10 space-y-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF] opacity-80">Respiratory Health</span>
                <h3 className="text-3xl font-black text-black">Pneumonia Insights</h3>
                <p className="text-black font-bold leading-relaxed">Advanced diagnostic patterns for automated lobar classification.</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-black text-white font-black text-[10px] uppercase tracking-widest group-hover:scale-105 transition-all shadow-xl">
                    Read Guide <ChevronRight className="w-4 h-4 text-pastel-green" />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Skin Knowledge Card */}
          <Link href="/disease-info?id=skin-rash" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-black/10 p-10 flex items-center gap-10 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-pink/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 w-44 h-44 flex-shrink-0">
                <SkinRashArmIllustration className="w-full h-full" bgColor="#FFD1DC" />
              </div>
              <div className="relative z-10 space-y-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FB7185] opacity-80">Dermatology</span>
                <h3 className="text-3xl font-black text-black">Skin Problems</h3>
                <p className="text-black font-bold leading-relaxed">Visual benchmarking for inflammatory skin conditions.</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-black text-white font-black text-[10px] uppercase tracking-widest group-hover:scale-105 transition-all shadow-xl">
                    Read Guide <ChevronRight className="w-4 h-4 text-pastel-pink" />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* 4. Daily Health Insights / Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: <Heart className="text-pastel-pink" />, label: "Clinician Pulse", value: "Optimal", bg: "bg-pastel-pink/5" },
          { icon: <Calendar className="text-pastel-blue" />, label: "Case Load", value: "+12 Today", bg: "bg-pastel-blue/5" },
          { icon: <ShieldCheck className="text-pastel-green" />, label: "AI Safety", value: "Verified", bg: "bg-pastel-green/5" },
          { icon: <Sparkles className="text-pastel-violet" />, label: "System Uptime", value: "99.9%", bg: "bg-pastel-violet/5" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-10 rounded-2xl border border-black/5 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow ${item.bg}`}
          >
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md border border-black/5">
              {item.icon}
            </div>
            <div>
              <p className="text-black text-xs font-black uppercase tracking-[0.2em]">{item.label}</p>
              <p className="text-black text-3xl font-black">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

    </div>
  )
}
