"use client"

import { useState } from "react"
import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export function FinancialAdvisor() {
  const [isLoading, setIsLoading] = useState(false)
  const [adviceList, setAdviceList] = useState([])
  const containerRef = React.useRef(null)
  const cardsRef = React.useRef([])

  useGSAP(() => {
    if (adviceList.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      )

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out"
        }
      )
    }
  }, [adviceList])

  const handleGetAdvice = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/financial-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      const data = await response.json()
      setAdviceList(data)
    } catch (error) {
      console.error("Error getting advice:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityStyle = priority => {
    switch (priority) {
      case "HIGH":
      case "CRITICAL":
        return "bg-rose-500/15 border-rose-500/30 text-rose-400 font-bold"
      case "MEDIUM":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400 font-bold"
      case "LOW":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold"
      default:
        return "bg-slate-700/50 border-slate-600 text-slate-300 font-bold"
    }
  }

  const getCategoryIcon = category => {
    switch (category) {
      case "savings":
        return "💰"
      case "investment":
        return "📈"
      case "debt_management":
        return "🔄"
      case "income":
        return "💸"
      default:
        return "💡"
    }
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-100">
              AI Financial Advisor
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <Button
            onClick={handleGetAdvice}
            disabled={isLoading}
            className="w-full py-6 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-900/40 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Personalized Advice...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Get Financial Advice
              </>
            )}
          </Button>

          {adviceList.length > 0 && (
            <div className="space-y-4 mt-5">
              {adviceList.map((advice, idx) => (
                <div
                  key={idx}
                  ref={el => {
                    if (el) cardsRef.current[idx] = el
                  }}
                  className="p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60 backdrop-blur-md hover:border-purple-500/30 transition-all duration-300 shadow-lg space-y-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                        {getCategoryIcon(advice.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-100">
                          {advice.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${getPriorityStyle(
                            advice.priority
                          )}`}
                        >
                          {advice.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {advice.advice}
                  </p>

                  {advice.impact && (
                    <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/20">
                      <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-0.5">
                        Expected Impact
                      </p>
                      <p className="text-xs font-semibold text-slate-200">
                        {advice.impact}
                      </p>
                    </div>
                  )}

                  {(advice.actionItems || advice.action_items) &&
                    (advice.actionItems || advice.action_items).length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Action Items
                        </p>
                        <div className="space-y-1.5">
                          {(advice.actionItems || advice.action_items).map((action, actionIdx) => (
                            <div
                              key={actionIdx}
                              className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="font-medium leading-relaxed">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}

              <div className="p-4 bg-gradient-to-r from-purple-950/40 via-slate-800/80 to-slate-900/60 rounded-2xl border border-purple-500/30 backdrop-blur-md mt-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-purple-400 mb-0.5">
                    Strategy Summary ({adviceList.length} Insights)
                  </p>
                  <p className="text-xs text-slate-300 font-medium">
                    Execute these recommended action items to steadily increase your financial health score.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
