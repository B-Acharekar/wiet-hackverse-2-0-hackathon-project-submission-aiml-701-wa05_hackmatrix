"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Sparkles, 
  ChevronRight,
  Heart,
  Calendar,
  ShieldCheck
} from "lucide-react"
import { LungsIllustration, SkinRashArmIllustration, MedicalAssistanceIllustration } from "../components/Illustrations"
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-24 pb-32">
      
      {/* 1. Welcoming Header Section */}
      <section className="relative overflow-hidden rounded-[3rem] p-12 md:p-20 bg-gradient-to-br from-pastel-pink to-pastel-violet min-h-[450px] flex flex-col justify-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl -mr-20 -mt-20 scale-150 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl -ml-16 -mb-16 scale-125"></div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 border border-white/40 text-sm font-bold text-white shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Empowering Your Clinical Decisions
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-black leading-[1.1]"
          >
            Welcome Back
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-black/70 font-medium leading-relaxed"
          >
            The MediSeen AI assistant is ready to help you analyze medical imagery and manage patient cases with ease.
          </motion.p>
        </div>
        
        {/* Abstract Illustration placement */}
        <div className="absolute right-12 bottom-12 hidden md:block opacity-80 rotate-6">
          <MedicalAssistanceIllustration className="w-64 h-64" bgColor="#FFFFFF" />
        </div>
      </section>

      {/* 2. Interactive Quick Actions Grid */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800">Quick Actions</h2>
            <p className="text-slate-400 font-medium">Tools to streamline your daily workflow</p>
          </div>
          <Link href="/upload" className="text-pastel-violet font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View all tools <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { 
              title: "New Diagnosis", 
              desc: "Upload an X-ray or skin scan for AI analysis", 
              icon: <Plus />, 
              color: "bg-pastel-pink", 
              link: "/upload" 
            },
            { 
              title: "Patient Files", 
              desc: "Review history and previous case assessments", 
              icon: <Search />, 
              color: "bg-pastel-blue", 
              link: "/diagnose" 
            },
          ].map((item, i) => (
            <Link key={item.title} href={item.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flo-card p-10 h-full flex flex-col justify-between"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} flex items-center justify-center text-white shadow-inner mb-8`}>
                  <div className="scale-125">{item.icon}</div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Educational Highlights Section */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800">Knowledge Hub</h2>
            <p className="text-slate-400 font-medium">Latest educational content and clinical guides</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lungs Knowledge Card */}
          <Link href="/disease-info?id=pneumonia" className="group">
            <motion.div 
              whileHover={{ scale: 0.99 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center gap-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-green/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 w-40 h-40 flex-shrink-0">
                <LungsIllustration className="w-full h-full" bgColor="#D4F4E2" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#2DD4BF] opacity-80">Respiratory Health</span>
                <h3 className="text-3xl font-black text-slate-800">Understanding Pneumonia</h3>
                <p className="text-slate-400 font-medium line-clamp-2">Learn about advanced diagnostic patterns for lobar pneumonia classification.</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 text-slate-500 font-bold text-sm group-hover:bg-pastel-green/20 group-hover:text-pastel-green transition-colors">
                    Explore Guide <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Skin Knowledge Card */}
          <Link href="/disease-info?id=skin-rash" className="group">
            <motion.div 
              whileHover={{ scale: 0.99 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center gap-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-pink/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 w-40 h-40 flex-shrink-0">
                <SkinRashArmIllustration className="w-full h-full" bgColor="#FFD1DC" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#FB7185] opacity-80">Dermatology</span>
                <h3 className="text-3xl font-black text-slate-800">Identifying Skin Rashes</h3>
                <p className="text-slate-400 font-medium line-clamp-2">Visual guides for differentiating between common inflammatory skin conditions.</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 text-slate-500 font-bold text-sm group-hover:bg-pastel-pink/20 group-hover:text-pastel-pink transition-colors">
                    Explore Guide <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* 4. Daily Health Insights / Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Heart className="text-pastel-pink" />, label: "Clinician Pulse", value: "Normal", bg: "bg-pastel-pink/5" },
          { icon: <Calendar className="text-pastel-blue" />, label: "Case Load", value: "+12 Today", bg: "bg-pastel-blue/5" },
          { icon: <ShieldCheck className="text-pastel-green" />, label: "AI Safety", value: "Verified", bg: "bg-pastel-green/5" },
          { icon: <Sparkles className="text-pastel-violet" />, label: "AI Accuracy", value: "98.4%", bg: "bg-pastel-violet/5" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[2rem] border border-slate-50 flex items-center gap-4 ${item.bg}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              {item.icon}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
              <p className="text-slate-800 text-xl font-black">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

    </div>
  )
}