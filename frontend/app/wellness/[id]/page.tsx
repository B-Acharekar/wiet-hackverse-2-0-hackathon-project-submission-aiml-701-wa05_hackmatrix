"use client"

import { useState, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  HeartPulse, Salad, Moon, Droplets, Sun, Activity, Shield, Smile, BrainCircuit,
  ArrowLeft, UploadCloud, Stethoscope, AlertCircle, Loader2
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { conditions } from "../page"

const dietRecommendations: Record<string, string[]> = {
  pneumonia: [
    "High-protein foods such as eggs, fish, beans, and lean meats to support tissue repair.",
    "Vitamin-rich fruits and vegetables like citrus fruits, berries, spinach, and broccoli.",
    "Adequate hydration including water, soups, and herbal teas.",
    "Foods rich in zinc and vitamin C that support immune function.",
    "Warm liquids that may help soothe the respiratory tract."
  ],
  eczema: [
    "Anti-inflammatory foods such as leafy greens, berries, and fatty fish (omega-3).",
    "Whole grains and legumes.",
    "Foods rich in vitamin E and antioxidants.",
    "Identify and avoid possible food triggers such as dairy, nuts, or gluten if recommended by a healthcare professional."
  ],
  psoriasis: [
    "Anti-inflammatory Mediterranean-style diet including fish, nuts, olive oil, and vegetables.",
    "Limit processed foods, excessive sugar, and alcohol.",
    "Maintain healthy body weight to reduce inflammation."
  ],
  melanoma: [
    "Antioxidant-rich fruits and vegetables.",
    "Foods containing vitamin A, C, E, and selenium.",
    "Balanced diet supporting immune health during treatment."
  ],
  ringworm: [
    "Maintain balanced nutrition supporting immune response.",
    "Reduce excessive refined sugar which may promote fungal growth.",
    "Include probiotic foods like yogurt or fermented foods."
  ],
  warts: [
    "Foods supporting immunity such as garlic, citrus fruits, yogurt, and leafy greens."
  ],
  "molluscum-contagiosum": [
    "Balanced diet with immune-supportive nutrients.",
    "Maintain hydration and nutrient diversity."
  ],
  acne: [
    "Emphasize whole foods, vegetables, fruits, healthy fats, and hydration.",
    "Reduce excessive processed foods and high-glycemic foods when appropriate."
  ],
  rosacea: [
    "Emphasize whole foods, vegetables, fruits, healthy fats, and hydration.",
    "Limit highly spicy foods or hot beverages that may trigger flushing.",
    "Reduce excessive processed foods when appropriate."
  ],
  vitiligo: [
    "Emphasize whole foods, vegetables, fruits, healthy fats, and hydration.",
    "Incorporate antioxidant-rich foods to protect skin cells."
  ],
  impetigo: [
    "Emphasize whole foods, vegetables, fruits, healthy fats, and hydration.",
    "Include immune-boosting foods like citrus and zinc-rich seeds."
  ],
  "contact-dermatitis": [
    "Emphasize whole foods, vegetables, fruits, healthy fats, and hydration.",
    "Avoid known dietary triggers if linked to skin reactions."
  ]
}

const lifestyleGuidance = [
  {
    title: "Sleep", icon: <Moon className="w-5 h-5" />,
    tips: [ "Maintain 7–9 hours of quality sleep per night for immune function and skin repair." ]
  },
  {
    title: "Hydration", icon: <Droplets className="w-5 h-5" />,
    tips: [ "Drink adequate water daily to maintain skin and systemic health." ]
  },
  {
    title: "Bathing and Skin Care", icon: <Droplets className="w-5 h-5" />,
    tips: [
      "Use lukewarm water rather than hot showers.",
      "Use gentle fragrance-free cleansers.",
      "Moisturize skin regularly after bathing."
    ]
  },
  {
    title: "Oral Hygiene", icon: <Smile className="w-5 h-5" />,
    tips: [ "Brush teeth twice daily and maintain oral health to prevent systemic inflammation." ]
  },
  {
    title: "Exercise", icon: <Activity className="w-5 h-5" />,
    tips: [ "Moderate physical activity such as walking, yoga, or cycling supports immunity." ]
  },
  {
    title: "Sun Protection", icon: <Sun className="w-5 h-5" />,
    tips: [ "Use sunscreen and protective clothing to reduce skin damage and melanoma risk." ]
  },
  {
    title: "Stress Management", icon: <BrainCircuit className="w-5 h-5" />,
    tips: [ "Meditation, breathing exercises, and relaxation help reduce inflammatory responses." ]
  },
  {
    title: "Hygiene Practices", icon: <Shield className="w-5 h-5" />,
    tips: [
      "Avoid sharing towels when dealing with contagious infections.",
      "Maintain clean bedding and clothing."
    ]
  }
];

interface DietPlan {
  recommended: string[];
  limit: string[];
  hydration: string;
  goals: string;
  mealPlan: { meal: string; idea: string; }[];
}

export default function WellnessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const condition = conditions.find(c => c.id === unwrappedParams.id)
  if (!condition) return notFound()

  const diets = dietRecommendations[unwrappedParams.id] || dietRecommendations.acne

  // Minimal form state for /generate-diet
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity_level: "",
    food_allergies: "",
    symptoms: "",
    severity: "",
    duration: ""
  })

  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dietPlanMarkdown, setDietPlanMarkdown] = useState<string | null>(null)

  const handleGenerateDiet = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    setError(null)
    setDietPlanMarkdown(null)

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: condition.name,
          symptoms: `${formData.symptoms} (Severity: ${formData.severity}, Duration: ${formData.duration})`,
          age: formData.age,
          activity_level: formData.activity_level,
          food_allergies: formData.food_allergies || "None"
        })
      })

      if (!response.ok) throw new Error("API failure")

      const data = await response.json()
      if (data.status === "success" && data.diet_plan) {
        setDietPlanMarkdown(data.diet_plan)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error(err)
      setError("Diet plan currently unavailable. Please consult a healthcare professional.")
    } finally {
      setGenerating(false)
    }
  }

  const InputLabel = ({ txt }: { txt: string }) => (
    <label className="block text-[10px] font-black uppercase tracking-widest text-black/60 mb-2">{txt}</label>
  )
  const InputStyle = "w-full px-4 py-3 bg-white border border-black/10 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pastel-violet/50 shadow-inner block"
  const CheckboxLabel = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${
        checked ? 'bg-black border-black text-white' : 'bg-white border-black/20 group-hover:border-black/40'
      }`}>
        {checked && <Shield className="w-3 h-3" />}
      </div>
      <span className="text-sm font-bold text-black">{label}</span>
    </label>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-16 pb-32 pt-12">
      {/* Header & Back Link */}
      <header className="space-y-8">
        <Link href="/wellness" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Wellness Directory
        </Link>
        <div className="flex items-center gap-6">
           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${condition.color}`}>
             <div className="scale-150">{condition.icon}</div>
           </div>
           <div className="space-y-2">
             <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
               {condition.name}
             </h1>
             <p className="text-sm font-black uppercase tracking-widest text-black/40">Clinical Wellness Profile</p>
           </div>
        </div>
      </header>

      {/* Section 1: Diet Recommendations */}
      <section className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 border border-black/5 shadow-xl">
         <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-pastel-green/20 flex items-center justify-center text-pastel-green">
              <Salad className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">Diet Recommendations</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">General nutrition advice</p>
            </div>
         </div>
         <ul className="space-y-4">
            {diets.map((rec, i) => (
              <li key={i} className="flex items-start gap-4">
                 <span className="w-2 h-2 rounded bg-pastel-green mt-2 flex-shrink-0" />
                 <span className="text-black font-bold text-base leading-relaxed">{rec}</span>
              </li>
            ))}
         </ul>
      </section>

      {/* Section 2: Lifestyle Guidance */}
      <section className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 border border-black/5 shadow-xl">
         <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-pastel-blue/20 flex items-center justify-center text-pastel-blue">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">Lifestyle Guidance</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Healthy Practices</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lifestyleGuidance.map((guide: { title: string; icon: React.ReactNode; tips: string[]; }, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-black/5 shadow-sm space-y-3">
                 <div className="flex items-center gap-3 text-pastel-blue">
                   {guide.icon}
                   <h3 className="font-black text-xs uppercase tracking-widest text-black">{guide.title}</h3>
                 </div>
                 <ul className="space-y-2">
                   {guide.tips.map((tip: string, j: number) => (
                     <li key={j} className="text-black font-semibold text-sm leading-snug opacity-80">
                       • {tip}
                     </li>
                   ))}
                 </ul>
              </div>
            ))}
         </div>
      </section>

      {/* Section 3: AI Form */}
      <section className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-10 border border-black/5 shadow-xl">
         <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-pastel-violet/20 flex items-center justify-center text-pastel-violet">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">Generate Personalized Diet Plan</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">AI Powered Tailored Nutrition</p>
            </div>
         </div>          <form onSubmit={handleGenerateDiet} className="space-y-12">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-pastel-violet border-b border-black/5 pb-2">Basic Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><InputLabel txt="Age"/><input required type="number" className={InputStyle} value={formData.age} onChange={e=>setFormData({...formData, age: e.target.value})} /></div>
                <div>
                  <InputLabel txt="Gender"/>
                  <select required className={InputStyle} value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><InputLabel txt="Height (cm)"/><input required type="number" className={InputStyle} value={formData.height} onChange={e=>setFormData({...formData, height: e.target.value})} /></div>
                <div><InputLabel txt="Weight (kg)"/><input required type="number" className={InputStyle} value={formData.weight} onChange={e=>setFormData({...formData, weight: e.target.value})} /></div>
              </div>
            </div>

            {/* Health Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-pastel-violet border-b border-black/5 pb-2">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <InputLabel txt="Selected Disease/Condition"/>
                  <input readOnly value={condition.name} className={`${InputStyle} bg-slate-100 text-black/50 cursor-not-allowed`} />
                </div>
                <div className="md:col-span-2">
                  <InputLabel txt="Specific Symptoms"/>
                  <textarea 
                    placeholder="Describe your symptoms..." 
                    required 
                    className={InputStyle} 
                    rows={1}
                    value={formData.symptoms} 
                    onChange={e=>setFormData({...formData, symptoms: e.target.value})} 
                  />
                </div>
                <div><InputLabel txt="Condition Duration"/><input placeholder="e.g. 2 months" required className={InputStyle} value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} /></div>
                <div>
                  <InputLabel txt="Symptom Severity"/>
                  <select required className={InputStyle} value={formData.severity} onChange={e=>setFormData({...formData, severity: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <InputLabel txt="Activity Level"/>
                  <select required className={InputStyle} value={formData.activity_level} onChange={e=>setFormData({...formData, activity_level: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dietary Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-pastel-violet border-b border-black/5 pb-2">Dietary Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div><InputLabel txt="Food Allergies"/><input placeholder="e.g. Peanuts, Dairy (Optional)" className={InputStyle} value={formData.food_allergies} onChange={e=>setFormData({...formData, food_allergies: e.target.value})} /></div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button type="submit" disabled={generating} className="w-full py-6 bg-black text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3">
               {generating ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Analyzing Health Data...
                 </>
               ) : "Generate Personalized Diet Plan"}
            </button>
         </form>

         {/* Results */}
         <AnimatePresence>
           {dietPlanMarkdown && (
             <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className="mt-16 border-t-4 border-black/5 pt-16 space-y-8"
             >
               <div className="flex items-center gap-4 border-b-2 border-black pb-8">
                 <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white">
                   <Stethoscope />
                 </div>
                 <div>
                   <h3 className="text-3xl font-black text-black italic">MediSeen Diet Report</h3>
                   <p className="text-xs font-black uppercase tracking-[0.3em] text-black/40">Customized Nutrition & Hydration</p>
                 </div>
               </div>

               <div className="prose prose-slate max-w-none 
                 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black
                 prose-p:font-bold prose-p:text-black/80 prose-p:leading-relaxed
                 prose-li:font-bold prose-li:text-black/80 prose-li:marker:text-black
                 prose-strong:text-black prose-strong:font-black
                 bg-white p-8 md:p-12 rounded-2xl border border-black/10 shadow-inner"
               >
                 <ReactMarkdown>{dietPlanMarkdown}</ReactMarkdown>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </section>
    </div>
  )
}
