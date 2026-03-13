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

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/[0.03] rounded-[2.5rem] px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pastel-pink to-pastel-violet flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
            <span className="text-white font-black text-xl">H</span>
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pastel-pink to-pastel-violet">
            HackMatrix
          </span>
        </Link>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.path === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.path)
            
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`relative px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 group ${
                  isActive 
                    ? "text-[#4A4A4A]" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-gradient-to-r from-pastel-pink/40 to-pastel-violet/30 rounded-full border border-white"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? "text-pastel-violet" : ""}`}>
                  {item.icon}
                </div>
                <span className="relative z-10 font-bold text-sm tracking-tight">{item.name}</span>
              </Link>
            )
          })}
        </div>
        
        {/* Profile/Menu Mock */}
        <div className="w-10 h-10 rounded-full bg-pastel-blue/30 border border-pastel-blue/50 flex items-center justify-center text-pastel-blue cursor-pointer hover:bg-pastel-blue transition-colors">
          <span className="font-bold text-xs">SP</span>
        </div>
      </div>
    </nav>
  )
}
