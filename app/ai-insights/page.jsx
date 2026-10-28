import { Suspense } from "react";
import { getInsightsInitialData } from "./actions";
import AIInsightsClient from "./components/AIInsightsClient";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Insights & Analytics | Finovexa",
  description: "AI-driven personal finance insights, spending breakdowns, and wealth intelligence.",
};

export default async function AIInsightsPage() {
  const { accounts, transactions } = await getInsightsInitialData();

  return (
    <Suspense fallback={<Loading />}>
      <AIInsightsClient
        initialAccounts={accounts}
        initialTransactions={transactions}
      />
    </Suspense>
  );
}
