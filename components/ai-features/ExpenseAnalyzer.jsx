"use client"

import React, { useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, TrendingDown, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"

export function ExpenseAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const containerRef = React.useRef(null)
  const cardsRef = React.useRef([])

  useGSAP(() => {
    if (analysis && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [analysis])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/expense-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 45.99,
          description: "Coffee & lunch",
          category: "Food & Dining",
          month: new Date().toLocaleString("default", { month: "long" })
        })
      })

      const data = await response.json()
      setAnalysis(data.metadata || data)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-100">
              AI Expense Analyzer
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-6 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-xl shadow-violet-900/40 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Transactions with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze My Expenses
              </>
            )}
          </Button>

          {analysis && (
            <div className="space-y-4 mt-5">
              {/* Insight Box */}
              <div
                ref={el => {
                  if (el) cardsRef.current[0] = el
                }}
                className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Expense Insight
                  </h3>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {analysis.insight}
                </p>
              </div>

              {/* Match & Anomaly Status */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  ref={el => {
                    if (el) cardsRef.current[1] = el
                  }}
                  className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 backdrop-blur-md"
                >
                  <p className="text-xs font-semibold text-slate-400 mb-2">Category Match</p>
                  <Badge
                    variant="outline"
                    className={
                      analysis.category_match === "yes"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-1"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold px-2.5 py-1"
                    }
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {analysis.category_match === "yes" ? "Appropriate" : "Needs Review"}
                  </Badge>
                </div>

                <div
                  ref={el => {
                    if (el) cardsRef.current[2] = el
                  }}
                  className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 backdrop-blur-md"
                >
                  <p className="text-xs font-semibold text-slate-400 mb-2">Anomaly Detection</p>
                  <Badge
                    variant="outline"
                    className={
                      analysis.anomaly_detected === "yes"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold px-2.5 py-1"
                        : "bg-slate-700/50 border-slate-600 text-slate-300 font-bold px-2.5 py-1"
                    }
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {analysis.anomaly_detected === "yes" ? "Unusual Spend" : "Normal Pattern"}
                  </Badge>
                </div>
              </div>

              {/* Recommendation */}
              <div
                ref={el => {
                  if (el) cardsRef.current[3] = el
                }}
                className="p-4 bg-gradient-to-r from-emerald-950/40 to-slate-800/60 rounded-2xl border border-emerald-500/30 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-1">
                      Optimization Recommendation
                    </h3>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                      {analysis.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Potential Savings */}
              <div
                ref={el => {
                  if (el) cardsRef.current[4] = el
                }}
                className="p-4 bg-gradient-to-r from-purple-950/40 to-slate-800/60 rounded-2xl border border-purple-500/30 backdrop-blur-md flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-0.5">
                    Estimated Potential Savings
                  </p>
                  <p className="text-xs text-slate-400">Monthly optimization target</p>
                </div>
                <p className="text-xl font-extrabold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-xl">
                  {typeof analysis.savings_opportunity === "number" || !isNaN(Number(analysis.savings_opportunity))
                    ? `$${Number(analysis.savings_opportunity).toFixed(2)}`
                    : analysis.savings_opportunity || "$0.00"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
