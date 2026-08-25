"use client"

import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ExpenseAnalyzer } from "./ExpenseAnalyzer"
import { BudgetRecommender } from "./BudgetRecommender"
import { FinancialAdvisor } from "./FinancialAdvisor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Sparkles, Target, Lightbulb, Zap, ShieldCheck, TrendingUp } from "lucide-react"

export function AIFeaturesDashboard() {
  const headerRef = React.useRef(null)
  const tabsRef = React.useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )

    gsap.fromTo(
      tabsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power2.out" }
    )
  })

  return (
    <div className="space-y-6 py-6 text-slate-100">
      {/* Header */}
      <div ref={headerRef} className="space-y-2">
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative bg-slate-900 border border-slate-700/80 p-3 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              AI Financial Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Intelligent real-time insights powered by Google Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div ref={tabsRef}>
        <Tabs defaultValue="analyzer" className="w-full">
          <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/60 inline-block w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:flex sm:w-auto gap-1 bg-transparent p-0">
              <TabsTrigger
                value="analyzer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-900/50 hover:text-slate-200"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Analyzer</span>
              </TabsTrigger>
              <TabsTrigger
                value="recommender"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-900/50 hover:text-slate-200"
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Budget</span>
              </TabsTrigger>
              <TabsTrigger
                value="advisor"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-900/50 hover:text-slate-200"
              >
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                <span>Advisor</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Feature 1: Expense Analyzer */}
          <TabsContent value="analyzer" className="mt-6">
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-slate-900/40 border border-violet-500/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  <h2 className="font-bold text-sm sm:text-base text-violet-300">
                    Smart Expense Analysis
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Get AI-powered insights about your spending patterns. Identify
                  anomalies, optimize categories, and discover savings opportunities instantly.
                </p>
              </div>
              <ExpenseAnalyzer />
            </div>
          </TabsContent>

          {/* Feature 2: Budget Recommender */}
          <TabsContent value="recommender" className="mt-6">
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-900/40 border border-amber-500/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <h2 className="font-bold text-sm sm:text-base text-amber-300">
                    Intelligent Budget Recommendations
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Receive personalized budget suggestions based on your transaction history. Optimize category allocations and maximize monthly savings.
                </p>
              </div>
              <BudgetRecommender />
            </div>
          </TabsContent>

          {/* Feature 3: Financial Advisor */}
          <TabsContent value="advisor" className="mt-6">
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-900/40 border border-purple-500/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <h2 className="font-bold text-sm sm:text-base text-purple-300">
                    Personalized Financial Strategy
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Get comprehensive financial advice tailored to your goals. Strategic roadmaps for savings, investments, debt management, and growth.
                </p>
              </div>
              <FinancialAdvisor />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <FeatureCard
          icon={<Zap className="w-5 h-5 text-violet-400" />}
          title="Real-time Analysis"
          description="Instant AI analysis of every transaction with clear, actionable insights"
          borderHover="hover:border-violet-500/40"
        />
        <FeatureCard
          icon={<ShieldCheck className="w-5 h-5 text-amber-400" />}
          title="Smart Budgeting"
          description="Personalized recommendations engineered to increase net monthly savings"
          borderHover="hover:border-amber-500/40"
        />
        <FeatureCard
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
          title="Financial Growth"
          description="Strategic advisor roadmaps for wealth building and milestone tracking"
          borderHover="hover:border-cyan-500/40"
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, borderHover }) {
  const cardRef = React.useRef(null)

  useGSAP(() => {
    const card = cardRef.current
    if (!card) return

    const onEnter = () => {
      gsap.to(card, {
        y: -5,
        duration: 0.25,
        ease: "power2.out"
      })
    }
    const onLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mouseleave", onLeave)

    return () => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mouseleave", onLeave)
    }
  })

  return (
    <Card
      ref={cardRef}
      className={`p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl transition-all duration-300 ${borderHover} group shadow-lg`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-sm text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </Card>
  )
}
