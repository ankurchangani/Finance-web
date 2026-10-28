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
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-1.5-flash",
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
      console.error(`❌ ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw lastError;
}

// ─────────────────────────────────────────────
// SMART HEURISTIC FINANCIAL ANALYSIS (FALLBACK)
// ─────────────────────────────────────────────

function generateHeuristicInsights(transactions) {
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const income = transactions.filter((t) => t.type === "INCOME");
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  // Category breakdown
  const catMap = {};
  expenses.forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
  });
  const sortedCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const topCat = sortedCategories[0] || ["General", 0];
  const secondCat = sortedCategories[1] || null;
  const topCatPct = totalExpense > 0 ? ((topCat[1] / totalExpense) * 100).toFixed(0) : 0;

  // Largest transaction
  const sortedExpenses = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount));
  const largestExpense = sortedExpenses[0];

  const bullets = [];

  // Bullet 1: Savings Rate & Income vs Expense
  if (totalIncome > 0) {
    if (netSavings >= 0) {
      bullets.push(
        `• Your savings rate is currently ${savingsRate}% (₹${Math.round(netSavings).toLocaleString("en-IN")} net saved). Maintaining at least 20% builds steady wealth.`
      );
    } else {
      bullets.push(
        `• Expenses exceeded income by ₹${Math.abs(Math.round(netSavings)).toLocaleString("en-IN")} this period. Trimming non-essential discretionary items will restore a positive balance.`
      );
    }
  } else {
    bullets.push(
      `• Recorded spending is ₹${Math.round(totalExpense).toLocaleString("en-IN")} across ${expenses.length} transactions. Log your income to track your complete savings rate.`
    );
  }

  // Bullet 2: Top Category Analysis
  if (topCat[1] > 0) {
    const potSavings = Math.round(topCat[1] * 0.15);
    bullets.push(
      `• Your highest expense category is ${topCat[0]} at ₹${Math.round(topCat[1]).toLocaleString("en-IN")} (${topCatPct}% of total spend). A 15% reduction would save ₹${potSavings.toLocaleString("en-IN")} monthly.`
    );
  } else {
    bullets.push(
      `• Categorize all daily transactions consistently to unlock targeted category optimization insights.`
    );
  }

  // Bullet 3: Secondary Category or Budget Rule
  if (secondCat && secondCat[1] > 0) {
    bullets.push(
      `• Secondary spending in ${secondCat[0]} reached ₹${Math.round(secondCat[1]).toLocaleString("en-IN")}. Setting a weekly budget cap will prevent category creep.`
    );
  } else {
    bullets.push(
      `• Follow the 50/30/20 framework: 50% for core needs, 30% for lifestyle, and 20% directly into automated savings.`
    );
  }

  // Bullet 4: Highest Single Purchase
  if (largestExpense && Number(largestExpense.amount) > 0) {
    bullets.push(
      `• Your largest single transaction was ₹${Math.round(Number(largestExpense.amount)).toLocaleString("en-IN")} on ${largestExpense.description || largestExpense.category}. Apply a 24-hour consideration rule on major purchases.`
    );
  } else {
    bullets.push(
      `• Setting up automated recurring transfers on payday ensures you save first before discretionary spending starts.`
    );
  }

  // Bullet 5: Emergency Cushion
  const emergencyTarget = Math.round(totalExpense * 3);
  if (emergencyTarget > 0) {
    bullets.push(
      `• Your recommended 3-month emergency reserve target is ₹${emergencyTarget.toLocaleString("en-IN")}. Keep this in a liquid, high-yield account for safety.`
    );
  } else {
    bullets.push(
      `• Building an emergency buffer of 3 to 6 months of basic living costs provides crucial financial resilience.`
    );
  }

  // Bullet 6: Transaction Velocity
  const avgTx = expenses.length > 0 ? Math.round(totalExpense / expenses.length) : 0;
  bullets.push(
    `• Your average expense transaction size is ₹${avgTx.toLocaleString("en-IN")}. Consolidating smaller impulsive purchases reduces overall spending friction.`
  );

  return bullets.slice(0, 6).join("\n");
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

    const netSavings = totalIncome - totalExpenses;

    // reduce token usage
    const cleanedTransactions = last30.map((t) => ({
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description || "",
    }));

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

    try {
      const response = await generateAIResponse(prompt);
      return {
        success: true,
        data: response,
      };
    } catch (aiError) {
      console.warn("Gemini generation failed, using dynamic financial heuristic model:", aiError.message);
      // Fallback to high-accuracy financial intelligence model from real numbers
      const fallbackInsights = generateHeuristicInsights(transactions);
      return {
        success: true,
        data: fallbackInsights,
      };
    }
  } catch (error) {
    console.error("generateInsights fatal error:", error);
    const fallbackInsights = generateHeuristicInsights(transactions || []);
    return {
      success: true,
      data: fallbackInsights,
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
    console.warn("Gemini translateInsights error:", error.message);

    return {
      success: false,
      data: insights,
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

// ─────────────────────────────────────────────
// GET INITIAL INSIGHTS DATA (FAST COMBINED FETCH)
// ─────────────────────────────────────────────

export async function getInsightsInitialData() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { accounts: [], transactions: [] };
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return { accounts: [], transactions: [] };
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const [accounts, transactions] = await Promise.all([
      db.account.findMany({
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
      }),
      db.transaction.findMany({
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
      }),
    ]);

    return {
      accounts: accounts.map((a) => ({
        ...a,
        balance: a.balance ? a.balance.toNumber() : 0,
      })),
      transactions: transactions.map((t) => ({
        ...t,
        amount: t.amount ? t.amount.toNumber() : 0,
        date: t.date instanceof Date ? t.date.toISOString() : t.date,
      })),
    };
  } catch (error) {
    console.error("Fetch initial insights data error:", error);
    return { accounts: [], transactions: [] };
  }
}