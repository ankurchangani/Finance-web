// app/components/ai-features/BudgetRecommender.tsx
"use client"
import { useState } from "react"
import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Target, DollarSign, LightbulbIcon } from "lucide-react"

export function BudgetRecommender() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const containerRef = React.useRef(null)
  const itemsRef = React.useRef([])

  useGSAP(() => {
    if (recommendations.length > 0 && containerRef.current) {
      // Container animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "back.out" }
      )

      // Items slide in from right
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: 50, rotation: 5 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
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
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-lg">Smart Budget Recommender</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Get Budget Recommendations
              </>
            )}
          </Button>

          {recommendations.length > 0 && (
            <div className="space-y-3 mt-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  ref={el => {
                    if (el) itemsRef.current[idx] = el
                  }}
                  className="p-4 bg-white rounded-lg border border-amber-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {rec.category}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-amber-600">
                        Save ${rec.savings_potential.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-xs text-gray-500 mb-0.5">Current</p>
                      <p className="text-sm font-bold text-red-600">
                        ${rec.current_spending.toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-xs text-gray-500 mb-0.5">Suggested</p>
                      <p className="text-sm font-bold text-blue-600">
                        ${rec.suggested_budget.toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-gray-500 mb-0.5">Save</p>
                      <p className="text-sm font-bold text-green-600">
                        {(
                          (rec.savings_potential / rec.current_spending) *
                          100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="p-2 bg-blue-50 rounded border border-blue-100">
                    <div className="flex items-start gap-2">
                      <LightbulbIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-800">
                        {rec.implementation_tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-200 mt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">
                      Monthly Savings Potential
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      $
                      {recommendations
                        .reduce((sum, r) => sum + r.savings_potential, 0)
                        .toFixed(2)}
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
