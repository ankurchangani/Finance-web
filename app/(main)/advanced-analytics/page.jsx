import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { AdvancedAnalyticsClient } from "./_components/AdvancedAnalyticsClient";

// ── Data fetcher ──────────────────────────────────────────────────────────────
async function getAnalyticsData(userId) {
  const [accounts, transactions, budget] = await Promise.all([
    db.account.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    db.transaction.findMany({ where: { userId }, orderBy: { date: "desc" } }),
    db.budget.findUnique({ where: { userId } }),
  ]);

  const now          = new Date();
  const monthStart   = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultAccId = accounts.find((a) => a.isDefault)?.id;

  const currentExpenses = transactions
    .filter((t) =>
      t.type === "EXPENSE" &&
      new Date(t.date) >= monthStart &&
      t.accountId === defaultAccId
    )
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return {
    accounts: accounts.map((a) => ({
      ...a,
      balance: parseFloat(a.balance),
    })),
    transactions: transactions.map((t) => ({
      ...t,
      amount: parseFloat(t.amount),
      date:   t.date.toISOString(),
    })),
    budgetData: {
      budget:          budget ? { ...budget, amount: parseFloat(budget.amount) } : null,
      currentExpenses,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AIInsightsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where:  { clerkUserId: userId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  const { accounts, transactions, budgetData } = await getAnalyticsData(user.id);

  return (
    <AdvancedAnalyticsClient
      accounts={accounts}
      transactions={transactions}
      budgetData={budgetData}
    />
  );
}