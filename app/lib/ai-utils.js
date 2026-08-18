// lib/ai-utils.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const aiModel = {
  name: "gemini-2.0-flash",
  getModel: () => genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
}

// Extract JSON from AI response
export function extractJSON(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch (error) {
    console.error("JSON extraction failed:", error)
    return null
  }
}

// Generate spending insights
export async function generateSpendingInsight(category, amount, averageAmount) {
  const model = aiModel.getModel()
  const prompt = `
  Provide a brief, friendly spending insight for this category:
  - Category: ${category}
  - Current Spend: $${amount}
  - Your Average: $${averageAmount}
  
  Keep it to 1-2 sentences and actionable.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Analyze transaction patterns
export async function analyzeTransactionPatterns(transactions) {
  const model = aiModel.getModel()

  const summary = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

  const prompt = `
  Analyze these spending patterns and identify trends:
  ${Object.entries(summary)
    .map(([cat, amount]) => `- ${cat}: $${amount}`)
    .join("\n")}
  
  Provide 2-3 key insights in bullet points.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Generate savings recommendations
export async function generateSavingsRecommendation(
  category,
  currentAmount,
  targetAmount
) {
  const model = aiModel.getModel()
  const prompt = `
  Generate a practical savings tip for reducing ${category} spending:
  - Current: $${currentAmount}
  - Target: $${targetAmount}
  - Potential Savings: $${currentAmount - targetAmount}
  
  Keep it practical and specific.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount)
}

// Calculate percentage
export function calculatePercentage(current, target) {
  if (target === 0) return 0
  return Math.round((current / target) * 100 * 10) / 10
}

// Get confidence level
export function getConfidenceLevel(score) {
  if (score >= 0.9) return "Very High"
  if (score >= 0.75) return "High"
  if (score >= 0.6) return "Medium"
  if (score >= 0.45) return "Low"
  return "Very Low"
}
