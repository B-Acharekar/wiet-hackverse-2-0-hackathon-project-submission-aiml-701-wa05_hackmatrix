"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { HeartPulse, Mail, Lock, ChevronRight } from "lucide-react"

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

      const token = await userCredential.user.getIdToken()

      await fetch("http://127.0.0.1:8000/auth/verify",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({token})
      })

      router.push("/home")

    }catch(err:any){

      setError(err.message)

    }finally{

      setLoading(false)

    }

  }

  return (

    <div className="-mt-28 min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-pink via-white to-pastel-violet px-6">

      <motion.div
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}
        className="w-full max-w-xl flo-card p-12 space-y-10 rounded-[3rem]"
      >

        <div className="text-center space-y-4">

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-3xl bg-pastel-pink flex items-center justify-center text-white shadow-lg">
              <HeartPulse/>
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-800">
            Welcome Back
          </h1>

          <p className="text-slate-400 font-medium">
            Login to continue using Mediseen AI
          </p>

        </div>

        <div className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500">
              Email Address
            </label>

            <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
              <Mail className="w-5 h-5 text-slate-400"/>
              <input
                type="email"
                placeholder="doctor@hospital.com"
                className="w-full outline-none text-slate-700 font-medium"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500">
              Password
            </label>

            <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
              <Lock className="w-5 h-5 text-slate-400"/>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none text-slate-700 font-medium"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
          </div>

        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <motion.button
          whileTap={{scale:0.96}}
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-pastel-violet text-white font-bold shadow-md hover:shadow-xl transition-all"
        >
          {loading ? "Signing In..." : "Sign In"}
          <ChevronRight className="w-5 h-5"/>
        </motion.button>

        <p className="text-center text-slate-400 font-medium">
          New to Mediseen?{" "}
          <button
            onClick={()=>router.push("/register")}
            className="text-pastel-violet font-bold"
          >
            Create Account
          </button>
        </p>

      </motion.div>

    </div>
  )
}