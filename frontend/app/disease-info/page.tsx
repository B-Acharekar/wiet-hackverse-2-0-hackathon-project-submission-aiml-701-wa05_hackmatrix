"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Wind, 
  Activity, 
  ShieldCheck, 
  Stethoscope,
  Lightbulb,
  HeartPulse,
  Syringe,
  Thermometer,
  ChevronRight,
  BookOpen,
  ArrowRight
} from "lucide-react"
import { LungsIllustration, SkinRashArmIllustration } from "../components/Illustrations"

type DiseaseInfo = {
  id: string;
  name: string;
  category: string;
  illustration: React.ReactNode;
  shortDescription: string;
  color: string;
  bgColor: string;
  details: {
    symptoms: string[];
    prevention: string[];
    treatment: string[];
    tips: string[];
  }
}

const diseases: DiseaseInfo[] = [
  {
    id: "pneumonia",
    name: "Pneumonia",
    category: "Respiratory Health",
    illustration: <LungsIllustration className="w-full h-full" bgColor="#D4F4E2" />,
    shortDescription: "An inflammatory condition of the lung affecting primarily the small air sacs known as alveoli.",
    color: "text-[#2DD4BF]",
    bgColor: "bg-pastel-green/10",
    details: {
      symptoms: [
        "Productive cough with colored mucus",
        "Persistent fever and shaking chills",
        "Shortness of breath during resting",
        "Sharp chest pain when breathing deeply",
        "Fatigue and muscle aches"
      ],
      prevention: [
        "Stay current with pneumococcal vaccines",
        "Wash hands frequently with soap",
        "Avoid smoking and second-hand smoke",
        "Maintain a strong immune system"
      ],
      treatment: [
        "Targeted antibiotic therapy",
        "Enhanced fluid intake and hydration",
        "Chest physiotherapy techniques",
        "Consistent clinical monitoring"
      ],
      tips: [
        "Use a warm-mist humidifier nearby",
        "Avoid lung irritants like strong perfumes",
        "Ensure complete rest during recovery",
        "Monitor oxygen saturation levels"
      ]
    }
  },
  {
    id: "skin-rash",
    name: "Skin Rash",
    category: "Dermatology",
    illustration: <SkinRashArmIllustration className="w-full h-full" bgColor="#FFD1DC" />,
    shortDescription: "A change of the human skin which affects its color, appearance, or texture.",
    color: "text-[#FB7185]",
    bgColor: "bg-pastel-pink/10",
    details: {
      symptoms: [
        "Intense redness or discoloration",
        "Localized itching or burning",
        "Raised bumps or fluid-filled blisters",
        "Dry, scaly, or cracked patches",
        "Tenderness and local inflammation"
      ],
      prevention: [
        "Identify and avoid specific triggers",
        "Use fragrance-free moisturizers",
        "Switch to mild, hypoallergenic soaps",
        "Wear loose, breathable cotton clothing"
      ],
      treatment: [
        "Topical corticosteroid applications",
        "Soothing cool compresses & baths",
        "Oral antihistamine medications",
        "Dermatological evaluation for persistent cases"
      ],
      tips: [
        "Resist the urge to scratch the area",
        "Keep the affected area clean and dry",
        "Apply aloe vera for cooling effects",
        "Monitor for any signs of infection"
      ]
    }
  }
]

function DiseaseInfoContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id")
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null)

  useEffect(() => {
    if (initialId) {
      const found = diseases.find(d => d.id === initialId)
      if (found) setSelectedDisease(found)
    } else if (diseases.length > 0) {
      setSelectedDisease(diseases[0])
    }
  }, [initialId])

  if (!selectedDisease) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-20 pb-32">
      
      {/* Page Header */}
      <header className="space-y-4 pt-12">
        <div className="flex items-center gap-3 text-pastel-violet">
          <BookOpen className="w-6 h-6" />
          <span className="font-black uppercase tracking-widest text-sm">Learning Center</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
          Know Your <span className="text-pastel-blue">Health</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl">
          Empower yourself with clinical knowledge about common health conditions and management paths.
        </p>
      </header>

      {/* Disease Selection Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {diseases.map((disease) => (
          <motion.div
            key={disease.id}
            onClick={() => setSelectedDisease(disease)}
            whileHover={{ y: -5 }}
            className={`cursor-pointer rounded-[2.5rem] p-8 transition-all duration-500 flex items-center gap-8 border-2 ${
              selectedDisease.id === disease.id 
                ? "bg-white border-pastel-violet shadow-xl" 
                : "bg-white/50 border-slate-50 hover:bg-white hover:border-slate-100 shadow-sm"
            }`}
          >
            <div className="w-24 h-24 flex-shrink-0">
               {disease.illustration}
            </div>
            <div className="space-y-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${disease.color} opacity-80`}>{disease.category}</span>
              <h3 className="text-2xl font-black text-slate-800">{disease.name}</h3>
              <p className="text-slate-400 font-medium text-xs line-clamp-2">{disease.shortDescription}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Detailed Content Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDisease.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="space-y-24"
        >
          {/* Main Hero Card */}
          <section className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl shadow-black/[0.02] border border-slate-100 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 ${selectedDisease.bgColor} rounded-full mix-blend-multiply filter blur-[100px] -mr-32 -mt-32 opacity-30`}></div>
            
            <div className="w-full md:w-1/2 space-y-8 relative z-10">
              <div className="space-y-2">
                <span className={`text-sm font-black uppercase tracking-[0.3em] ${selectedDisease.color}`}>{selectedDisease.category}</span>
                <h2 className="text-5xl md:text-7xl font-black text-slate-800 leading-tight">All About {selectedDisease.name}</h2>
              </div>
              <p className="text-xl text-slate-400 font-bold leading-relaxed">
                {selectedDisease.shortDescription} Understanding the nuances of this condition helps in early detection and effective recovery.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Medical Grade
                </div>
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest">
                  <HeartPulse className="w-4 h-4 text-pastel-pink" /> Patient Centered
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative z-10 flex justify-center">
               <div className="w-80 h-80 md:w-[450px] md:h-[450px]">
                  {selectedDisease.illustration}
               </div>
            </div>
          </section>

          {/* Detailed Info Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Symptoms Card */}
            <div className="bg-white rounded-[3rem] p-12 border border-slate-50 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pastel-blue/10 flex items-center justify-center text-pastel-blue">
                   <Thermometer className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black text-slate-800">Key Symptoms</h3>
              </div>
              <ul className="space-y-4">
                {selectedDisease.details.symptoms.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <ArrowRight className="w-5 h-5 text-pastel-blue mt-1 flex-shrink-0" />
                    <span className="text-slate-500 font-bold leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention Card */}
            <div className="bg-white rounded-[3rem] p-12 border border-slate-50 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pastel-green/10 flex items-center justify-center text-pastel-green">
                   <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black text-slate-800">How to Prevent</h3>
              </div>
              <ul className="space-y-4">
                {selectedDisease.details.prevention.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-pastel-green mt-1 flex-shrink-0" />
                    <span className="text-slate-500 font-bold leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Card */}
            <div className="bg-white rounded-[3rem] p-12 border border-slate-50 shadow-sm space-y-8 md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pastel-violet/10 flex items-center justify-center text-pastel-violet">
                   <Stethoscope className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black text-slate-800">Treatment Options</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedDisease.details.treatment.map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex items-center gap-6 group hover:translate-y-1 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-pastel-violet opacity-60 group-hover:opacity-100 transition-opacity">
                      <Syringe className="w-6 h-6" />
                    </div>
                    <span className="text-slate-600 font-black text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Tips Card */}
            <div className="bg-pastel-pink/10 rounded-[3rem] p-12 md:p-16 border border-pastel-pink/10 md:col-span-2 text-center space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full filter blur-3xl -ml-16 -mt-16"></div>
               <div className="relative z-10 flex flex-col items-center gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-white shadow-md flex items-center justify-center text-pastel-pink">
                    <Lightbulb className="w-10 h-10" />
                 </div>
                 <h3 className="text-4xl font-black text-slate-800">Supportive Care Tips</h3>
                 <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                   {selectedDisease.details.tips.map((item, i) => (
                     <div key={i} className="px-8 py-3 bg-white/60 backdrop-blur-md rounded-full border border-white text-slate-600 font-black text-sm">
                       {item}
                     </div>
                   ))}
                 </div>
               </div>
            </div>

          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

import { CheckCircle2 } from "lucide-react"

export default function DiseaseInfo() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 rounded-full border-4 border-pastel-violet border-t-transparent animate-spin"></div>
      </div>
    }>
      <DiseaseInfoContent />
    </Suspense>
  )
}
