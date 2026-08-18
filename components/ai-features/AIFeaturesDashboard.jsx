// app/components/ai-features/AIFeaturesDashboard.tsx
"use client"

import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ExpenseAnalyzer } from "./ExpenseAnalyzer"
import { BudgetRecommender } from "./BudgetRecommender"
import { FinancialAdvisor } from "./FinancialAdvisor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function AIFeaturesDashboard() {
  const headerRef = React.useRef(null)
  const tabsRef = React.useRef(null)

  useGSAP(() => {
    // Header entrance animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )

    // Tabs entrance
    gsap.fromTo(
      tabsRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
    )
  })

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div ref={headerRef} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Financial Assistant
            </h1>
            <p className="text-sm text-gray-600">
              Intelligent insights powered by Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div ref={tabsRef}>
        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:flex gap-2 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <span>✨</span>
              <span className="hidden sm:inline">Analyzer</span>
            </TabsTrigger>
            <TabsTrigger
              value="recommender"
              className="flex items-center gap-2"
            >
              <span>🎯</span>
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger value="advisor" className="flex items-center gap-2">
              <span>💡</span>
              <span className="hidden sm:inline">Advisor</span>
            </TabsTrigger>
          </TabsList>

          {/* Feature 1: Expense Analyzer */}
          <TabsContent value="analyzer" className="mt-6">
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h2 className="font-semibold text-blue-900 mb-2">
                  Smart Expense Analysis
                </h2>
                <p className="text-sm text-blue-800">
                  Get AI-powered insights about your spending patterns. Identify
                  anomalies, optimize categories, and discover savings
                  opportunities.
                </p>
              </Card>
              <ExpenseAnalyzer />
            </div>
          </TabsContent>

          {/* Feature 2: Budget Recommender */}
          <TabsContent value="recommender" className="mt-6">
            <div className="space-y-4">
              <Card className="p-4 bg-amber-50 border-amber-200">
                <h2 className="font-semibold text-amber-900 mb-2">
                  Intelligent Budget Recommendations
                </h2>
                <p className="text-sm text-amber-800">
                  Receive personalized budget suggestions based on your spending
                  habits. Optimize allocations and maximize monthly savings.
                </p>
              </Card>
              <BudgetRecommender />
            </div>
          </TabsContent>

          {/* Feature 3: Financial Advisor */}
          <TabsContent value="advisor" className="mt-6">
            <div className="space-y-4">
              <Card className="p-4 bg-purple-50 border-purple-200">
                <h2 className="font-semibold text-purple-900 mb-2">
                  Personalized Financial Strategy
                </h2>
                <p className="text-sm text-purple-800">
                  Get comprehensive financial advice tailored to your goals.
                  Strategies for savings, investments, debt management, and
                  income optimization.
                </p>
              </Card>
              <FinancialAdvisor />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <FeatureCard
          icon="📊"
          title="Real-time Analysis"
          description="Instant AI analysis of every transaction with actionable insights"
        />
        <FeatureCard
          icon="💰"
          title="Smart Budgeting"
          description="Personalized budget recommendations to maximize savings potential"
        />
        <FeatureCard
          icon="🚀"
          title="Financial Growth"
          description="Strategic advice for long-term financial goals and wealth building"
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  const cardRef = React.useRef(null)

  useGSAP(() => {
    const card = cardRef.current
    card?.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    })

    card?.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })

  return (
    <Card
      ref={cardRef}
      className="p-4 border-2 border-gray-100 hover:border-purple-200 transition-colors"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Card>
  )
}
