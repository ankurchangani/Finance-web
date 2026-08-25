"use client"

import { useState } from "react"
import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Target, DollarSign, LightbulbIcon, ArrowUpRight } from "lucide-react"

export function BudgetRecommender() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const containerRef = React.useRef(null)
  const itemsRef = React.useRef([])

  useGSAP(() => {
    if (recommendations.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.2)" }
      )

      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: 40, rotation: 3 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out"
        }
      )
    }
  }, [recommendations])

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/budget-recommender", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-100">
              Smart Budget Recommender
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <Button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="w-full py-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-xl shadow-amber-900/40 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Get Budget Recommendations
              </>
            )}
          </Button>

          {recommendations.length > 0 && (
            <div className="space-y-4 mt-5">
              {recommendations.map((rec, idx) => {
                const savingsPotential = Number(rec.savings_potential ?? rec.savingsPotential ?? 0);
                const currentSpending = Number(rec.current_spending ?? rec.currentSpending ?? 0);
                const suggestedBudget = Number(rec.suggested_budget ?? rec.suggestedBudget ?? 0);
                const tip = rec.implementation_tip || rec.implementationTip || "";
                const savePct = currentSpending > 0 ? ((savingsPotential / currentSpending) * 100).toFixed(0) : "0";

                return (
                  <div
                    key={idx}
                    ref={el => {
                      if (el) itemsRef.current[idx] = el
                    }}
                    className="p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60 backdrop-blur-md hover:border-amber-500/30 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-100 capitalize">
                          {rec.category}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.reason}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <span className="inline-flex items-center text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                          Save ${savingsPotential.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-rose-950/40 border border-rose-500/20 p-3 rounded-xl">
                        <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wider mb-1">Current</p>
                        <p className="text-base font-extrabold text-slate-100">
                          ${currentSpending.toFixed(0)}
                        </p>
                      </div>
                      <div className="bg-blue-950/40 border border-blue-500/20 p-3 rounded-xl">
                        <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-1">Suggested</p>
                        <p className="text-base font-extrabold text-slate-100">
                          ${suggestedBudget.toFixed(0)}
                        </p>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-xl">
                        <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1">Potential</p>
                        <p className="text-base font-extrabold text-emerald-400 flex items-center">
                          {savePct}% <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                        </p>
                      </div>
                    </div>

                    {tip && (
                      <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/20 flex items-start gap-2.5">
                        <LightbulbIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium text-slate-300 leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-5 bg-gradient-to-r from-emerald-950/50 via-slate-800/80 to-slate-900/60 rounded-2xl border border-emerald-500/30 backdrop-blur-md mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                      Total Monthly Savings Potential
                    </p>
                    <p className="text-xs text-slate-400">Sum of optimized category budgets</p>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                  $
                  {recommendations
                    .reduce((sum, r) => sum + Number(r.savings_potential ?? r.savingsPotential ?? 0), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
