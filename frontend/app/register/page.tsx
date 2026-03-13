"use client"

import { useState } from "react"
import { User, Stethoscope, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function RegisterPage() {

  const router = useRouter()

  const [role,setRole] = useState("doctor")
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleRegister = async () => {

    setError("")

    if(!email || !password || !name){
      setError("All fields required")
      return
    }

    try{

      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      // Save name in Firebase profile
      await updateProfile(userCredential.user,{
        displayName:name
      })

      router.push("/login")

    }catch(err:any){

      setError(err.message)

    }finally{

      setLoading(false)

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#03060b] relative font-sans">

      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,transparent_50%)] opacity-30" />

      {/* Main Card */}
      <div className="relative z-10 bg-[#0a0f1a]/80 backdrop-blur-2xl border border-white/10 p-10 w-[420px]
                      shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] transition-all">

        {/* Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-600" />

        {/* Branding */}
        <div className="flex flex-col gap-1 mb-10">

          <div className="flex items-center gap-0">

            <div className="bg-white px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#22d3ee] mr-3">
              <span className="text-black font-black text-xl tracking-tighter uppercase">
                Medi<span className="text-cyan-500">Seen</span>
              </span>
            </div>

          </div>

          <p className="text-white/30 text-[10px] font-medium tracking-widest uppercase mt-2 ml-1">
            Create Secure Account
          </p>

        </div>

        {/* Role Selector */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-sm mb-8">

          <button
            onClick={()=>setRole("doctor")}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
              ${role==="doctor"
                ? "bg-white text-black shadow-[3px_3px_0px_0px_#22d3ee]"
                : "text-white/50 hover:text-white"}`}
          >
            <Stethoscope size={14}/>
            Practitioner
          </button>

          <button
            onClick={()=>setRole("patient")}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
              ${role==="patient"
                ? "bg-white text-black shadow-[3px_3px_0px_0px_#22d3ee]"
                : "text-white/50 hover:text-white"}`}
          >
            <User size={14}/>
            Patient
          </button>

        </div>

        {/* Form Fields */}
        <div className="space-y-6">

          {/* Name */}
          <div className="space-y-2">

            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">
              Full Name
            </label>

            <input
              placeholder={role==="doctor" ? "e.g. Dr. Sarah Chen" : "e.g. John Doe"}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 text-sm focus:border-cyan-400 focus:outline-none transition-all"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

          </div>

          {/* Email */}
          <div className="space-y-2">

            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@institute.com"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 text-sm focus:border-cyan-400 focus:outline-none transition-all"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

          {/* Password */}
          <div className="space-y-2">

            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 text-sm focus:border-cyan-400 focus:outline-none transition-all"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

          </div>

        </div>

        {error && (
          <p className="text-red-400 text-xs mt-4">{error}</p>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-10 py-4 bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-black uppercase tracking-[0.2em]
                     shadow-[5px_5px_0px_0px_#fff] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                     transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Creating..." : "Create Account"}
          <ChevronRight size={16}/>
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/40">
          Already registered?{" "}
          <button
            onClick={()=>router.push("/login")}
            className="text-white font-bold hover:text-cyan-400 transition-colors underline underline-offset-4"
          >
            Sign In
          </button>
        </p>

      </div>

    </div>
  )
}