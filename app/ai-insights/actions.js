"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ─────────────────────────────────────────────
// AI RESPONSE HELPER
// ─────────────────────────────────────────────

async function generateAIResponse(prompt) {
  const models = [
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
  ];

  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`🚀 Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const response = result.response.text();

      if (!response || response.trim().length === 0) {
        throw new Error("Empty AI response");
      }

      console.log(`✅ Success with ${modelName}`);

      return response;
    } catch (error) {
      console.error(`❌ ${modelName} failed`);

      lastError = error;

      // retry delay
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );
    }
  }

  throw lastError;
}

// ─────────────────────────────────────────────
// GENERATE INSIGHTS
// ─────────────────────────────────────────────

export async function generateInsights(transactions) {
  try {
    // safety check
    if (
      !transactions ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    ) {
      return {
        success: false,
        data: `
• No transaction data found
• Add income and expense entries
• AI analysis requires transaction history
• Start tracking your spending daily
• Insights will improve with more data
• Try adding at least 5 transactions
`,
      };
    }

    // latest 30 transactions only
    const last30 = transactions.slice(0, 30);

    const totalIncome = last30
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = last30
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings =
      totalIncome - totalExpenses;

    // reduce token usage
    const cleanedTransactions = last30.map(
      (t) => ({
        amount: t.amount,
        type: t.type,
        category: t.category,
        description: t.description || "",
      })
    );

    const prompt = `
You are an advanced AI financial advisor.

Analyze the user's financial behavior and generate EXACTLY 6 personalized insights.

Transaction Data:
${JSON.stringify(cleanedTransactions)}

Financial Summary:
- Income: ₹${totalIncome.toFixed(2)}
- Expenses: ₹${totalExpenses.toFixed(2)}
- Savings: ₹${netSavings.toFixed(2)}

STRICT RULES:
1. EXACTLY 6 bullet points
2. Every line must start with "•"
3. Maximum 2 short sentences
4. Mention real categories and amounts
5. Give practical financial suggestions
6. Use natural human language
7. Use ₹ symbol
8. No markdown
9. No headings
10. No numbering
11. No extra explanation
12. Return ONLY the 6 bullet points

Example:
• You spent ₹8,400 on food this month, which increased by 20%. Cutting weekend orders could save ₹2,000 monthly.
`;

    const response =
      await generateAIResponse(prompt);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error(
      "Gemini generateInsights error:",
      error
    );

    return {
      success: false,
      data: `
• AI servers are currently busy
• Please try again after a few seconds
• Your transaction data is safe
• No information was lost
• Financial analysis will resume shortly
• Try refreshing the page
`,
    };
  }
}

// ─────────────────────────────────────────────
// TRANSLATE INSIGHTS
// ─────────────────────────────────────────────

export async function translateInsights(
  insights,
  targetLanguage
) {
  try {
    if (
      !insights ||
      !Array.isArray(insights)
    ) {
      return {
        success: false,
        data: [],
      };
    }

    const languageNames = {
      gu: "Gujarati",
      hi: "Hindi",
    };

    const langName =
      languageNames[targetLanguage] ||
      "Gujarati";

    const prompt = `
Translate the following financial insights into ${langName}.

${insights.join("\n")}

Rules:
1. Keep all bullet points
2. Keep ₹ symbols unchanged
3. Keep all numbers unchanged
4. Return ONLY translated lines
5. No headings
6. No markdown
7. No explanations
`;

    const response =
      await generateAIResponse(prompt);

    const translated = response
      .split("\n")
      .filter(
        (line) => line.trim() !== ""
      );

    return {
      success: true,
      data: translated,
    };
  } catch (error) {
    console.error(
      "Gemini translateInsights error:",
      error
    );

    return {
      success: false,
      data: [],
    };
  }
}

// ─────────────────────────────────────────────
// GET USER TRANSACTIONS
// ─────────────────────────────────────────────

export async function getUserTransactions() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const threeMonthsAgo = new Date();

    threeMonthsAgo.setMonth(
      threeMonthsAgo.getMonth() - 3
    );

    const transactions =
      await db.transaction.findMany({
        where: {
          userId: user.id,
          date: {
            gte: threeMonthsAgo,
          },
        },
        orderBy: {
          date: "desc",
        },
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
    console.error(
      "Fetch transactions error:",
      error
    );

    return [];
  }
}

// ─────────────────────────────────────────────
// GET USER ACCOUNTS
// ─────────────────────────────────────────────

export async function getUserAccounts() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        type: true,
        isDefault: true,
        balance: true,
      },
    });

    return accounts.map((a) => ({
      ...a,
      balance: a.balance.toNumber(),
    }));
  } catch (error) {
    console.error(
      "Fetch accounts error:",
      error
    );

    return [];
  }
}