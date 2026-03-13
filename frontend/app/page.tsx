"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Brain, UploadCloud, Activity, Sparkles, ShieldCheck, ChevronRight } from "lucide-react"

export default function LandingPage() {
  return (

    <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 space-y-32">

      {/* HERO */}

      <section className="relative overflow-hidden rounded-[3rem] p-16 bg-gradient-to-br from-pastel-pink via-white to-pastel-violet min-h-[520px] flex flex-col justify-center">

        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

        <div className="relative z-10 max-w-3xl space-y-8">

          <motion.div
            initial={{opacity:0,scale:0.9}}
            animate={{opacity:1,scale:1}}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 border border-white font-bold text-sm"

            <Brain className="w-4 h-4"/>
            Explainable Medical AI
          </motion.div>

          <motion.h1
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            className="text-6xl md:text-7xl font-black text-slate-800 leading-[1.1]"
          >
            Faster Diagnosis
            <br/>
            with Explainable AI
          </motion.h1>

          <p className="text-xl text-slate-500 max-w-xl">
            Upload medical scans, analyze them using multiple neural networks,
            and visualize AI reasoning with interpretable heatmaps.
          </p>

          <div className="flex gap-4 pt-4">

            <Link href="/login">
              <motion.button
                whileTap={{scale:0.96}}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-violet text-white font-bold flex items-center gap-2 shadow-lg"
              >
                Start Diagnosis
                <ChevronRight className="w-4 h-4"/>
              </motion.button>
            </Link>

            <Link href="/register">
              <button className="px-8 py-4 rounded-full bg-white border border-slate-200 font-bold text-slate-700">
                Create Account
              </button>
            </Link>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="space-y-12">

        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-800">
            AI Tools for Clinical Decision Making
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Mediseen combines deep learning and explainable AI to assist doctors
            in analyzing medical images faster and more accurately.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {[

            {
              title:"Upload Medical Images",
              desc:"Upload X-rays or dermatology scans for instant AI analysis.",
              icon:<UploadCloud/>,
              color:"bg-pastel-pink"
            },
            {
              title:"Multi-Model Diagnosis",
              desc:"Multiple neural networks analyze scans for higher accuracy.",
              icon:<Activity/>,
              color:"bg-pastel-blue"
            },
            {
              title:"Explainable AI Heatmaps",
              desc:"Visualize exactly which regions influenced AI predictions.",
              icon:<Sparkles/>,
              color:"bg-pastel-violet"
            }
          ].map((item,i)=>(
            <motion.div
              key={item.title}
              initial={{opacity:0,y:20}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{delay:i*0.1}}
              className="flo-card p-10 space-y-6"
            >

              <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} flex items-center justify-center text-white shadow-inner`}>
                {item.icon}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {item.title}
                </h3>
                <p className="text-slate-400 font-medium mt-2">
                  {item.desc}
                </p>
              </div>

            </motion.div>
          ))}

        </div>

      </section>


      {/* AI WORKFLOW */}

      <section className="space-y-12">

        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-800">
            How Mediseen Works
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {[
            {step:"Upload Scan",icon:<UploadCloud/>},
            {step:"AI Analysis",icon:<Brain/>},
            {step:"Heatmap Explanation",icon:<Sparkles/>},
            {step:"Clinical Insight",icon:<ShieldCheck/>}
          ].map((item,i)=>(
            <motion.div
              key={item.step}
              initial={{opacity:0,scale:0.9}}
              whileInView={{opacity:1,scale:1}}
              viewport={{once:true}}
              transition={{delay:i*0.1}}
              className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4"
            >

              <div className="w-14 h-14 rounded-2xl bg-pastel-blue/20 flex items-center justify-center">
                {item.icon}
              </div>

              <p className="font-bold text-slate-700">
                {item.step}
              </p>

            </motion.div>
          ))}

        </div>

      </section>


      {/* CTA */}

      <section className="rounded-[3rem] bg-gradient-to-r from-pastel-blue to-pastel-violet p-20 text-center text-white space-y-6">

        <h2 className="text-4xl font-black">
          Ready to experience AI-assisted diagnosis?
        </h2>

        <p className="text-white/80 text-lg">
          Join clinicians using Mediseen to analyze medical scans with explainable AI.
        </p>

        <Link href="/register">
          <motion.button
            whileTap={{scale:0.96}}
            className="px-10 py-4 rounded-full bg-white text-slate-700 font-bold flex items-center gap-2 mx-auto"
          >
            Create Account
            <ChevronRight className="w-4 h-4"/>
          </motion.button>
        </Link>

      </section>

    </div>
  )
}