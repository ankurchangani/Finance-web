import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { AdvancedAnalyticsClient } from "./_components/AdvancedAnalyticsClient";

async function getAnalyticsData(userId) {
  const [accounts, transactions, budget] = await Promise.all([
    db.account.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    db.transaction.findMany({ where: { userId }, orderBy: { date: "desc" } }),
    db.budget.findUnique({ where: { userId } }),
  ]);

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const defaultAccountId = accounts.find((a) => a.isDefault)?.id;

  const currentExpenses = transactions
    .filter((t) => t.type === "EXPENSE" && new Date(t.date) >= monthStart && t.accountId === defaultAccountId)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return {
    accounts:     accounts.map((a) => ({ ...a, balance: parseFloat(a.balance) })),
    transactions: transactions.map((t) => ({ ...t, amount: parseFloat(t.amount), date: t.date.toISOString() })),
    budgetData:   { budget: budget ? { ...budget, amount: parseFloat(budget.amount) } : null, currentExpenses },
  };
}

export default async function AdvancedAnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } });
  if (!user) redirect("/sign-in");

  const { accounts, transactions, budgetData } = await getAnalyticsData(user.id);

  return <AdvancedAnalyticsClient accounts={accounts} transactions={transactions} budgetData={budgetData} />;
}
