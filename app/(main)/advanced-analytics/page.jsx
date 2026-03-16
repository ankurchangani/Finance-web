import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AdvancedAnalyticsClient } from "./_components/advanced-analytics-client";

// Force dynamic so fresh data every visit
export const dynamic = "force-dynamic";

export default async function AdvancedAnalyticsPage() {
  // Parallel data fetch — optimized
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((a) => a.isDefault);
  const budgetData = defaultAccount
    ? await getCurrentBudget(defaultAccount.id)
    : null;

  return (
    <AdvancedAnalyticsClient
      accounts={accounts ?? []}
      transactions={transactions ?? []}
      budgetData={budgetData}
    />
  );
}
