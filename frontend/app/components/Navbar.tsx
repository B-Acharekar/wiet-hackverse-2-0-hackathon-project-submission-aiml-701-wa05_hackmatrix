"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Home, 
  Sparkles, 
  UploadCloud, 
  Activity, 
  MessageCircle, 
  BookOpen 
} from "lucide-react"

const navItems = [
  { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
  { name: "Insights", path: "/insights", icon: <Sparkles className="w-5 h-5" /> },
  { name: "Upload", path: "/upload", icon: <UploadCloud className="w-5 h-5" /> },
  { name: "Diagnosis", path: "/diagnose", icon: <Activity className="w-5 h-5" /> },
  { name: "Messages", path: "/communication", icon: <MessageCircle className="w-5 h-5" /> },
  { name: "Education", path: "/disease-info", icon: <BookOpen className="w-5 h-5" /> },
]

import { MediSeenEyeLogo } from "./Illustrations"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-white/90 backdrop-blur-xl border border-black/5 shadow-lg shadow-black/[0.05] rounded-2xl px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-pink to-pastel-violet flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-500">
            <MediSeenEyeLogo className="w-9 h-9" />
          </div>
          <span className="text-2xl font-black text-black tracking-tight uppercase">
            MediSeen
          </span>
        </Link>
        
        {/* Navigation Tabs - Boxy Style */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = item.path === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.path)
            
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`relative px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
                  isActive 
                    ? "text-black" 
                    : "text-black/40 hover:text-black"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-xl border-b-4 border-pastel-violet shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? "text-pastel-violet" : ""}`}>
                  {item.icon}
                </div>
                <span className="relative z-10 font-black text-xs uppercase tracking-widest">{item.name}</span>
              </Link>
            )
          })}
        </div>
        
        {/* Profile/Menu Mock */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pastel-blue to-pastel-blue/60 border border-black/5 flex items-center justify-center text-black cursor-pointer hover:shadow-md transition-all">
          <span className="font-black text-xs">SP</span>
        </div>
      </div>
    </nav>
  )
}
