"use client"

import { motion } from "framer-motion"
import { User, Calendar, Fingerprint, Activity } from "lucide-react"

export default function PatientForm() {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/[0.02] border border-slate-100 h-full">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-black mb-2">Patient Information</h2>
        <p className="text-black font-bold">Capture essential patient data for clinical records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-black px-2 flex items-center gap-2">
            <User className="w-3 h-3 text-pastel-pink" />
            Full Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. John Doe"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-black font-bold focus:outline-none focus:ring-2 focus:ring-pastel-pink/30 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-black px-2 flex items-center gap-2">
            <Calendar className="w-3 h-3 text-pastel-blue" />
            Age
          </label>
          <input 
            type="number" 
            placeholder="e.g. 45"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-black font-bold focus:outline-none focus:ring-2 focus:ring-pastel-blue/30 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-black px-2 flex items-center gap-2">
            <Fingerprint className="w-3 h-3 text-pastel-violet" />
            Case ID
          </label>
          <input 
            type="text" 
            placeholder="e.g. #MS-2026-001"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-black font-bold focus:outline-none focus:ring-2 focus:ring-pastel-violet/30 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-black px-2 flex items-center gap-2">
            <Activity className="w-3 h-3 text-pastel-green" />
            Study Type
          </label>
          <select 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-black font-bold focus:outline-none focus:ring-2 focus:ring-pastel-green/30 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option>Chest X-Ray (PA View)</option>
            <option>Dermatoscopic Scan</option>
            <option>MRI Head Scan</option>
            <option>CT Thorax</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-black px-2">Clinical Symptoms & Notes</label>
          <textarea 
            rows={4}
            placeholder="Describe symptoms, duration, and patient history..."
            className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-black font-bold focus:outline-none focus:ring-2 focus:ring-pastel-pink/30 focus:bg-white transition-all resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  )
}
