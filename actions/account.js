
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  return serialized;
};

// ─── Get Account With Transactions ─────────────────────────
export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: { id: accountId, userId: user.id },
    include: {
      transactions: { orderBy: { date: "desc" } },
      _count: { select: { transactions: true } },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
}

// ─── Bulk Delete Transactions ───────────────────────────────
export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
      where: { id: { in: transactionIds }, userId: user.id },
    });

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change = transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: { id: { in: transactionIds }, userId: user.id },
      });
      for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: balanceChange } },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── Update Default Account ─────────────────────────────────
export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: { id: accountId, userId: user.id },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeDecimal(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── Edit Account ───────────────────────────────────────────
export async function editAccount(accountId, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    // Verify account belongs to user
    const existing = await db.account.findUnique({
      where: { id: accountId, userId: user.id },
    });
    if (!existing) throw new Error("Account not found");

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    // If setting as default, unset others first
    if (data.isDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.update({
      where: { id: accountId },
      data: {
        name: data.name,
        type: data.type,
        balance: balanceFloat,
        isDefault: data.isDefault,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeDecimal(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── Delete Account ─────────────────────────────────────────
export async function deleteAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    // Verify account belongs to user
    const existing = await db.account.findUnique({
      where: { id: accountId, userId: user.id },
    });
    if (!existing) throw new Error("Account not found");

    // Prevent deleting the only account
    const accountCount = await db.account.count({ where: { userId: user.id } });
    if (accountCount <= 1) throw new Error("Cannot delete your only account");

    // If deleting default account, make another one default
    if (existing.isDefault) {
      const nextAccount = await db.account.findFirst({
        where: { userId: user.id, id: { not: accountId } },
        orderBy: { createdAt: "asc" },
      });
      if (nextAccount) {
        await db.account.update({
          where: { id: nextAccount.id },
          data: { isDefault: true },
        });
      }
    }

    // Delete account (transactions cascade delete via Prisma schema)
    await db.account.delete({
      where: { id: accountId, userId: user.id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
