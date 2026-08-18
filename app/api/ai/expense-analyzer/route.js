import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionId, amount, description, category, month } = await req.json();

    // Find DB user by clerkUserId
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's recent transactions for context
    const recentTransactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 30,
    });

    const categorySpending = recentTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    const prompt = `
You are a financial advisor AI. Analyze this expense transaction:

Transaction Details:
- Amount: $${amount}
- Description: ${description}
- Category: ${category}
- Month: ${month}

User's Spending Pattern (Last 30 days):
${Object.entries(categorySpending)
  .map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`)
  .join("\n")}

Provide a JSON response with:
{
  "insight": "Brief insight about this expense",
  "category_match": "Is the category appropriate? (yes/no)",
  "anomaly_detected": "Is this spending unusual? (yes/no)",
  "recommendation": "How to optimize this category",
  "savings_opportunity": "Dollar amount that could be saved"
}`;

    const models = ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.0-flash"];
    let responseText = "";

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err) {
        console.warn(`Model ${modelName} failed in expense-analyzer`, err.message);
      }
    }

    if (!responseText) {
      return NextResponse.json(
        {
          insight: "Regular expense transaction analyzed.",
          category_match: "yes",
          anomaly_detected: "no",
          recommendation: "Keep tracking your recurring expenses for optimum control.",
          savings_opportunity: "0",
        },
        { status: 200 }
      );
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const savedAnalysis = await db.aIAnalysis.create({
      data: {
        userId: user.id,
        transactionId: transactionId || null,
        analysisType: "expense_insight",
        title: `Analysis: ${category || "General"}`,
        description: analysis.insight || "Expense analysis completed",
        recommendation: analysis.recommendation || "Review recurring spend",
        confidence: 0.9,
        metadata: analysis,
      },
    });

    return NextResponse.json(savedAnalysis);
  } catch (error) {
    console.error("AI Analyzer Error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
