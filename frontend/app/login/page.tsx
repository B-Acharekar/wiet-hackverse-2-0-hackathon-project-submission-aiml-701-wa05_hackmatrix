"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleLogin = async () => {

    setError("")

    if(!email || !password){
      setError("Email and password required")
      return
    }

    try{

      setLoading(true)

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      // 🔐 Get Firebase token
      const token = await user.getIdToken()

      // send token to FastAPI backend
      await fetch("http://127.0.0.1:8000/auth/verify",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          token:token
        })
      })

      router.push("/")

    }catch(err:any){

      setError(err.message)

    }finally{

      setLoading(false)

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#03060b] relative font-sans">

      {/* background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,transparent_50%)] opacity-30"/>

      <div className="relative z-10 bg-[#0a0f1a]/80 backdrop-blur-2xl border border-white/10 p-10 w-[420px]
                      shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)]">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-600"/>

        <div className="flex flex-col gap-1 mb-10">

          <div className="flex items-center">
            <div className="bg-white px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#22d3ee] mr-3">
              <span className="text-black font-black text-xl tracking-tighter uppercase">
                Medi<span className="text-cyan-500">Seen</span>
              </span>
            </div>
          </div>

          <p className="text-white/30 text-[10px] font-medium tracking-widest uppercase mt-2 ml-1">
            AI Diagnostic Platform
          </p>

        </div>

        {/* form */}
        <div className="space-y-6">

          <div className="space-y-2">

            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@institute.com"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 text-sm focus:border-cyan-400 focus:outline-none"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

          <div className="space-y-2">

            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 text-sm focus:border-cyan-400 focus:outline-none"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

          </div>

        </div>

        {error && (
          <p className="text-red-400 text-xs mt-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-10 py-4 bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-black uppercase tracking-[0.2em]
                     shadow-[5px_5px_0px_0px_#fff] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                     transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Signing In..." : "Sign In"}
          <ChevronRight size={16}/>
        </button>

        <p className="mt-8 text-center text-sm text-white/40">
          New to Mediseen?{" "}
          <button
            onClick={()=>router.push("/register")}
            className="text-white font-bold hover:text-cyan-400 underline underline-offset-4"
          >
            Create Account
          </button>
        </p>

      </div>

    </div>
  )
}