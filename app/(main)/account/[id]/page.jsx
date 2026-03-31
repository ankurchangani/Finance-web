// import { Suspense } from "react";
// import { getAccountWithTransactions } from "@/actions/account";
// import { BarLoader } from "react-spinners";
// import { TransactionTable } from "../_components/transaction-table";
// import { notFound } from "next/navigation";
// import { AccountChart } from "../_components/account-chart";

// export default async function AccountPage({ params }) {
//   const accountData = await getAccountWithTransactions(params.id);
//   if (!accountData) notFound();

//   const { transactions, ...account } = accountData;

//   return (
//     <div className="space-y-8 px-5">
//       <div className="flex gap-4 items-end justify-between">
//         <div>
//           <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
//             {account.name}
//           </h1>
//           <p className="text-muted-foreground">
//             {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
//           </p>
//         </div>
//         <div className="text-right pb-2">
//           <div className="text-xl sm:text-2xl font-bold">
//             ${parseFloat(account.balance).toFixed(2)}
//           </div>
//           <p className="text-sm text-muted-foreground">
//             {account._count.transactions} Transactions
//           </p>
//         </div>
//       </div>
//       <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
//         <AccountChart transactions={transactions} />
//       </Suspense>
//       <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
//         <TransactionTable transactions={transactions} />
//       </Suspense>
//     </div>
//   );
// }

// app/account/[id]/page.jsx
// ── Full Server Component — no "use client" ──────────────────────────────────
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAccountWithTransactions } from "@/actions/account";
import { getTransactionsPaginated } from "@/actions/transaction-optimized";
import { TransactionTablePaginated } from "../_components/transaction-table-paginated";
import { LazyAccountChart } from "@/app/dashboard/_components/lazy-charts";
import {
  TransactionTableSkeleton,
  ChartSkeleton,
} from "@/components/ui/skeleton-loaders";

// Revalidate every 60 s (ISR) — avoids full SSR on every request
export const revalidate = 60;

export default async function AccountPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  // Account info (no transactions here — we load them separately)
  const accountData = await getAccountWithTransactions(resolvedParams.id);
  if (!accountData) notFound();

  const { transactions: allTx, ...account } = accountData;

  // Server-side pagination & filters from URL
  const page       = Number(resolvedSearch.page)     || 1;
  const search     = resolvedSearch.search           || "";
  const type       = resolvedSearch.type             || "";
  const category   = resolvedSearch.category        || "";
  const recurring  = resolvedSearch.recurring        || "";
  const dateFrom   = resolvedSearch.dateFrom         || "";
  const dateTo     = resolvedSearch.dateTo           || "";
  const sort       = resolvedSearch.sort             || "date";
  const dir        = resolvedSearch.dir              || "desc";

  const {
    transactions,
    total,
    totalPages,
  } = await getTransactionsPaginated({
    accountId: resolvedParams.id,
    page,
    pageSize: 10,
    search,
    type,
    category,
    recurringFilter: recurring,
    dateFrom,
    dateTo,
    sortField: sort,
    sortDir: dir,
  });

  return (
    <div className="space-y-8 px-5 pb-10">
      {/* ── Header ── */}
      <div className="flex gap-4 items-end justify-between pt-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>
        <div className="text-right pb-1">
          <div className="text-2xl font-bold tabular-nums">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions total
          </p>
        </div>
      </div>

      {/* ── Chart — lazy loaded, chart still gets all transactions ── */}
      <Suspense fallback={<ChartSkeleton />}>
        <LazyAccountChart transactions={allTx} />
      </Suspense>

      {/* ── Paginated Transaction Table ── */}
      <Suspense fallback={<TransactionTableSkeleton />}>
        <TransactionTablePaginated
          transactions={transactions}
          totalPages={totalPages}
          total={total}
          currentPage={page}
          accountId={resolvedParams.id}
        />
      </Suspense>
    </div>
  );
}
