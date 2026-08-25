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
      include: {
        accounts: true,
        budgets: true,
        goals: true,
        transactions: {
          take: 50,
          orderBy: { date: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalBalance = user.accounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0
    );
    const totalGoal = user.goals.reduce(
      (sum, g) => sum + Number(g.targetAmount),
      0
    );
    const totalSaved = user.goals.reduce(
      (sum, g) => sum + Number(g.savedAmount),
      0
    );
    const monthlyIncome = user.transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const monthlyExpense = user.transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const prompt = `
You are a professional financial advisor. Based on this user's financial profile, provide personalized advice:

Financial Profile:
- Total Account Balance: $${totalBalance.toFixed(2)}
- Monthly Income: $${monthlyIncome.toFixed(2)}
- Monthly Expenses: $${monthlyExpense.toFixed(2)}
- Monthly Net: $${(monthlyIncome - monthlyExpense).toFixed(2)}
- Total Goals: ${user.goals.length} goals
- Goal Target: $${totalGoal.toFixed(2)}
- Amount Saved: $${totalSaved.toFixed(2)}
- Current Budget: $${user.budgets[0]?.amount ? Number(user.budgets[0].amount) : "Not set"}

Provide 3-4 actionable pieces of advice as JSON:
[
  {
    "category": "savings",
    "title": "Build an Emergency Buffer",
    "advice": "Allocate at least 20% of net savings into high-yield accounts.",
    "priority": "HIGH",
    "impact": "High stability",
    "action_items": ["Set automated transfer", "Review fixed expenses"]
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
        console.warn(`Model ${modelName} failed in financial-advisor`, err.message);
      }
    }

    let adviceList = [];
    if (responseText) {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          adviceList = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse advice JSON", e);
        }
      }
    }

    if (!adviceList || adviceList.length === 0) {
      adviceList = [
        {
          category: "savings",
          title: "Build Emergency Reserve",
          advice: "Set aside 3-6 months of essential living expenses in a liquid account.",
          priority: "HIGH",
          impact: "Financial Resilience",
          action_items: ["Automate monthly savings", "Audit recurring subscriptions"],
        },
        {
          category: "investment",
          title: "Optimize Asset Allocation",
          advice: "Diversify surplus income across low-cost index funds and high-yield instruments.",
          priority: "MEDIUM",
          impact: "Long-term Wealth Growth",
          action_items: ["Review risk tolerance", "Set up dollar-cost averaging"],
        },
      ];
    }

    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    const savedAdvice = await Promise.all(
      adviceList.map((advice) => {
        const pStr = (advice.priority || "MEDIUM").toUpperCase();
        const priority = validPriorities.includes(pStr) ? pStr : "MEDIUM";
        const items = advice.action_items || advice.actionItems || [];

        return db.financialAdvice.create({
          data: {
            userId: user.id,
            category: advice.category || "savings",
            title: advice.title || "Financial Tip",
            advice: advice.advice || "Keep managing your budget.",
            priority,
            impact: advice.impact || "Positive Impact",
            actionItems: items,
          },
        });
      })
    );

    const formatted = savedAdvice.map((a) => ({
      ...a,
      action_items: a.actionItems,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Financial Advisor Error:", error);
    return NextResponse.json(
      { error: error.message || "Advice generation failed" },
      { status: 500 }
    );
  }
}
