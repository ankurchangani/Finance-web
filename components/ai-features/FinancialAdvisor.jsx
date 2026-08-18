// app/components/ai-features/FinancialAdvisor.tsx
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
      // Title animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      )

      // Cards flip in
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, rotationY: -90, y: 20 },
        {
          opacity: 1,
          rotationY: 0,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "back.out"
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

  const getPriorityColor = priority => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">AI Financial Advisor</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGetAdvice}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Advice...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Get Financial Advice
              </>
            )}
          </Button>

          {adviceList.length > 0 && (
            <div className="space-y-3 mt-4">
              {adviceList.map((advice, idx) => (
                <div
                  key={idx}
                  ref={el => {
                    if (el) cardsRef.current[idx] = el
                  }}
                  className="p-4 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">
                        {getCategoryIcon(advice.category)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {advice.title}
                        </h3>
                        <Badge
                          className={`mt-1 text-xs font-semibold ${getPriorityColor(
                            advice.priority
                          )}`}
                        >
                          {advice.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 pl-11">
                    {advice.advice}
                  </p>

                  {advice.impact && (
                    <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded mb-3 ml-11">
                      <p className="text-xs font-semibold text-indigo-900">
                        Expected Impact
                      </p>
                      <p className="text-sm text-indigo-700 font-medium">
                        {advice.impact}
                      </p>
                    </div>
                  )}

                  {advice.action_items && advice.action_items.length > 0 && (
                    <div className="ml-11 space-y-1">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Action Items
                      </p>
                      {advice.action_items.map((action, actionIdx) => (
                        <div
                          key={actionIdx}
                          className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-purple-900 mb-1">
                      Total Recommendations
                    </p>
                    <p className="text-sm text-purple-800">
                      Follow these {adviceList.length} recommendations to
                      improve your financial health
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
