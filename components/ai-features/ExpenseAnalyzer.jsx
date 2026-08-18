// app/components/ai-features/ExpenseAnalyzer.tsx
"use client"
import { useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, TrendingDown } from "lucide-react"

export function ExpenseAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const containerRef = React.useRef(null)
  const cardsRef = React.useRef([])

  useGSAP(() => {
    if (analysis && containerRef.current) {
      // Animate container entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )

      // Animate cards staggered
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
      setAnalysis(data.metadata)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">AI Expense Analyzer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze My Expenses
              </>
            )}
          </Button>

          {analysis && (
            <div className="space-y-3 mt-4">
              <div
                ref={el => {
                  if (el) cardsRef.current[0] = el
                }}
                className="p-3 bg-white rounded-lg border border-blue-100"
              >
                <h3 className="font-semibold text-sm text-gray-700 mb-1">
                  Insight
                </h3>
                <p className="text-sm text-gray-600">{analysis.insight}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  ref={el => {
                    if (el) cardsRef.current[1] = el
                  }}
                  className="p-3 bg-white rounded-lg border border-green-100"
                >
                  <p className="text-xs text-gray-500 mb-1">Category Match</p>
                  <Badge
                    variant={
                      analysis.category_match === "yes"
                        ? "default"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {analysis.category_match}
                  </Badge>
                </div>

                <div
                  ref={el => {
                    if (el) cardsRef.current[2] = el
                  }}
                  className="p-3 bg-white rounded-lg border border-orange-100"
                >
                  <p className="text-xs text-gray-500 mb-1">Anomaly</p>
                  <Badge
                    variant={
                      analysis.anomaly_detected === "yes"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {analysis.anomaly_detected}
                  </Badge>
                </div>
              </div>

              <div
                ref={el => {
                  if (el) cardsRef.current[3] = el
                }}
                className="p-3 bg-gradient-to-r from-emerald-50 to-transparent rounded-lg border border-emerald-100"
              >
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-700 mb-1">
                      Recommendation
                    </h3>
                    <p className="text-sm text-gray-600">
                      {analysis.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              <div
                ref={el => {
                  if (el) cardsRef.current[4] = el
                }}
                className="p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-100"
              >
                <p className="text-xs font-semibold text-purple-900 mb-1">
                  Potential Savings
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {analysis.savings_opportunity}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
