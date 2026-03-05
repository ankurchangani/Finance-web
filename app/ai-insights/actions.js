"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Generate Insights ──────────────────────────────────────
export async function generateInsights(transactions) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const last90 = transactions.slice(-90);
    const totalIncome = last90.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = last90.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

    const prompt = `
You are a smart, empathetic financial advisor AI.

Analyze the following user's last 3 months of transactions and give exactly 6 personalized, actionable insights.

Transaction Data:
${JSON.stringify(last90)}

Summary:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Net Savings: ₹${(totalIncome - totalExpenses).toFixed(2)}

Rules:
- Give EXACTLY 6 bullet points, each on a new line starting with "•"
- Reference actual categories and amounts from the data
- Mix positive reinforcement with areas for improvement
- Keep each insight under 2 sentences
- Be specific and actionable — give clear next steps
- Use ₹ symbol for Indian Rupee amounts
- Avoid generic advice; make every insight feel personal
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return { success: true, data: response };
  } catch (error) {
    console.error("Gemini generateInsights error:", error);
    return { success: false, data: "Failed to generate AI insights. Please try again." };
  }
}

// ─── Translate Insights ─────────────────────────────────────
export async function translateInsights(insights, targetLanguage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const languageNames = {
      gu: "Gujarati (ગુજરાતી)",
      hi: "Hindi (हिंदी)",
    };

    const langName = languageNames[targetLanguage] || "Gujarati";

    const insightsText = insights.join("\n");

    const prompt = `
Translate the following financial insights into ${langName}.

Original English insights:
${insightsText}

Rules:
- Translate each line separately, preserving the "•" bullet point at the start
- Keep ₹ symbols and numbers as-is (do NOT translate numbers or currency symbols)
- Keep the same meaning and tone — friendly, helpful, actionable
- Return ONLY the translated lines, one per line, nothing else
- Do not add any extra explanation or preamble
- Maintain the same number of lines as the original (${insights.length} lines)
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const translated = response
      .split("\n")
      .filter((line) => line.trim() !== "" && line.trim().length > 5);

    return { success: true, data: translated };
  } catch (error) {
    console.error("Gemini translateInsights error:", error);
    return { success: false, data: [] };
  }
}

// ─── Get User Transactions ──────────────────────────────────
export async function getUserTransactions() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await db.transaction.findMany({
      where: { userId: user.id, date: { gte: threeMonthsAgo } },
      orderBy: { date: "desc" },
      select: {
        amount: true,
        type: true,
        category: true,
        date: true,
        description: true,
        accountId: true,
      },
    });

    return transactions.map((t) => ({
      ...t,
      amount: t.amount.toNumber(),
    }));
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return [];
  }
}

// ─── Get User Accounts ──────────────────────────────────────
export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, type: true, isDefault: true, balance: true },
    });

    return accounts.map((a) => ({
      ...a,
      balance: a.balance.toNumber(),
    }));
  } catch (error) {
    console.error("Fetch accounts error:", error);
    return [];
  }
}
