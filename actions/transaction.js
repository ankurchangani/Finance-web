"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "buffer";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// Create Transaction
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        ...query,
      },
      include: {
        account: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const serializedTransactions = transactions.map((t) => ({
      ...t,
      amount: t.amount ? Number(t.amount) : 0,
      account: t.account
        ? {
            ...t.account,
            balance: t.account.balance ? Number(t.account.balance) : 0,
          }
        : null,
    }));

    return { success: true, data: serializedTransactions };
  } catch (error) {
    throw new Error(error.message);
  }
}


// Helper to determine if an error is unrecoverable across all models
function isUnrecoverableGeminiError(err) {
  const status = err?.status;
  const message = (err?.message || "").toLowerCase();

  // Invalid API key
  if (
    status === 400 &&
    (message.includes("api_key_invalid") || message.includes("api key not valid"))
  ) {
    return {
      unrecoverable: true,
      userMessage: "Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.",
    };
  }

  // Permission / Auth issues
  if (
    status === 401 ||
    status === 403 ||
    message.includes("permission_denied") ||
    message.includes("unauthorized")
  ) {
    return {
      unrecoverable: true,
      userMessage: "Gemini API access denied. Please verify your project permissions.",
    };
  }

  // Account quota exhausted
  if (
    status === 429 ||
    message.includes("resource_exhausted") ||
    message.includes("quota")
  ) {
    return {
      unrecoverable: true,
      userMessage: "Gemini API quota exceeded. Please try again in a few moments.",
    };
  }

  return { unrecoverable: false };
}

export async function scanReceipt(formData) {
  try {
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded");
    }

    // File validation
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are supported");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be under 5MB");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in your .env file");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    // Normalize MIME type
    let mimeType = file.type || "image/jpeg";
    if (mimeType === "image/jpg") mimeType = "image/jpeg";

    // Confirmed model list supporting generateContent and multimodal image input
    const models = [
      "gemini-3.8-flash",      // 1. Primary Model
      "gemini-3.5-flash",      // 2. Fallback
      "gemini-3.5-flash-lite", // 3. Fallback
      "gemini-2.5-flash",      // 4. Fallback
      "gemini-2.5-flash-lite", // 5. Fallback
      "gemini-flash-latest",   // 6. Fallback
    ];

    const prompt = `
Analyze this receipt image and extract the following information in JSON format:
- Total amount (just the number)
- Date (in ISO format)
- Description or items purchased (brief summary)
- Merchant/store name
- Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
 
Respond ONLY with raw valid JSON — no markdown, no code fences, no explanation.
Use exactly this format:
{
  "amount": number,
  "date": "ISO date string",
  "description": "string",
  "merchantName": "string",
  "category": "string"
}
 
If this is not a receipt, return exactly: {}
`;
    let text = "";

    // Iterate through models with recoverable-only fallback
    for (const modelName of models) {
      try {
        console.log(`[scanReceipt] Attempting receipt scan with model: ${modelName}`);

        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType,
              data: base64String,
            },
          },
          prompt,
        ]);

        const response = result.response;
        text = response.text();

        // Success
        if (text && text.trim().length > 0) {
          console.log(`[scanReceipt] Successfully processed receipt with model: ${modelName}`);
          break;
        }
      } catch (err) {
        // Fast-fail if error is unrecoverable across models
        const check = isUnrecoverableGeminiError(err);
        if (check.unrecoverable) {
          console.error(`[scanReceipt] Unrecoverable error with model ${modelName} (${err?.status || "error"}):`, err?.message);
          throw new Error(check.userMessage);
        }

        // Recoverable model error (e.g. 503 high demand, 500, 404, or transient issue)
        console.warn(`[scanReceipt] Model ${modelName} encountered recoverable error (${err?.status || "error"}), attempting next model...`);
        continue;
      }
    }

    // No AI response from any model
    if (!text) {
      throw new Error(
        "Receipt scan failed: Gemini AI models could not process this image. Please check your image clarity or try another receipt."
      );
    }

    // Extract JSON (strip markdown code fences if present)
    const cleanedText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("[scanReceipt] No valid JSON found in model output");
      return {};
    }

    let data = {};

    try {
      data = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("[scanReceipt] JSON parse error:", err);
      return {};
    }

    if (!data || Object.keys(data).length === 0) {
      return {};
    }

    // Ensure date is valid and safe for date-fns parsing
    let validDate = new Date().toISOString();
    if (data.date) {
      const parsed = new Date(data.date);
      if (!isNaN(parsed.getTime())) {
        validDate = parsed.toISOString();
      }
    }

    return {
      amount: Number(data.amount) || 0,
      date: validDate,
      description: data.description || data.merchantName || "",
      merchantName: data.merchantName || "",
      category: data.category || "other-expense",
    };
  } catch (error) {
    console.error("[scanReceipt] Processing error:", error.message);

    if (error.message.includes("429")) {
      throw new Error("AI quota exceeded. Try again later.");
    }

    if (error.message.includes("503")) {
      throw new Error("Gemini servers busy. Please retry.");
    }

    throw new Error(error.message || "Receipt scan failed");
  }
}

// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}