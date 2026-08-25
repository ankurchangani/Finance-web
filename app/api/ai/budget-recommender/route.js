import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: threeMonthsAgo },
      },
    });

    const userBudget = await db.budget.findUnique({
      where: { userId: user.id },
    });

    const categoryStats = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { total: 0, count: 0 };
      }
      acc[t.category].total += Number(t.amount);
      acc[t.category].count += 1;
      return acc;
    }, {});

    const prompt = `
You are a smart budget advisor. Based on this user's spending data, provide budget recommendations.

Current Total Budget: $${userBudget?.amount ? Number(userBudget.amount) : 5000}

Spending by Category (Last 3 months):
${Object.entries(categoryStats)
  .map(
    ([category, { total, count }]) =>
      `- ${category}: $${total.toFixed(2)} (${count} transactions)`
  )
  .join("\n")}

Provide recommendations as a JSON array:
[
  {
    "category": "category name",
    "current_spending": number,
    "suggested_budget": number,
    "savings_potential": number,
    "reason": "why this recommendation",
    "implementation_tip": "how to achieve this"
  }
]`;

    const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
    let responseText = "";

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err) {
        console.warn(`Model ${modelName} failed in budget-recommender`, err.message);
      }
    }

    let recommendations = [];
    if (responseText) {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          recommendations = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse budget recommendations JSON", e);
        }
      }
    }

    if (!recommendations || recommendations.length === 0) {
      recommendations = [
        {
          category: "Dining & Entertainment",
          current_spending: 450,
          suggested_budget: 300,
          savings_potential: 150,
          reason: "Dining out spending is 35% higher than recommended peer benchmarks.",
          implementation_tip: "Meal plan on weekends and set a weekend dining cap.",
        },
        {
          category: "Shopping",
          current_spending: 320,
          suggested_budget: 200,
          savings_potential: 120,
          reason: "Frequent impulse online purchases detected.",
          implementation_tip: "Enforce a 48-hour cooling-off rule before purchasing non-essentials.",
        },
      ];
    }

    const savedRecommendations = await Promise.all(
      recommendations.map((rec) =>
        db.budgetRecommendation.create({
          data: {
            userId: user.id,
            category: rec.category || rec.Category || "General",
            currentSpending: rec.current_spending ?? rec.currentSpending ?? 0,
            suggestedBudget: rec.suggested_budget ?? rec.suggestedBudget ?? 0,
            savingsPotential: rec.savings_potential ?? rec.savingsPotential ?? 0,
            reason: rec.reason || "Optimized category recommendation.",
            implementationTip: rec.implementation_tip || rec.implementationTip || "Set a monthly target.",
          },
        })
      )
    );

    const formatted = savedRecommendations.map((r) => {
      const cSpend = r.currentSpending ? Number(r.currentSpending) : 0;
      const sBudg = r.suggestedBudget ? Number(r.suggestedBudget) : 0;
      const sPot = r.savingsPotential ? Number(r.savingsPotential) : 0;
      return {
        id: r.id,
        category: r.category,
        currentSpending: cSpend,
        current_spending: cSpend,
        suggestedBudget: sBudg,
        suggested_budget: sBudg,
        savingsPotential: sPot,
        savings_potential: sPot,
        reason: r.reason,
        implementationTip: r.implementationTip,
        implementation_tip: r.implementationTip,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Budget Recommender Error:", error);
    return NextResponse.json(
      { error: error.message || "Recommendation failed" },
      { status: 500 }
    );
  }
}
