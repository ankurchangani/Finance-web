// export const dynamic = "force-dynamic";

// import { Suspense } from "react";
// import { Plus } from "lucide-react";
// import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
// import { getCurrentBudget } from "@/actions/budget";
// import { AccountCard } from "./_components/account-card";
// import { CreateAccountDrawer } from "@/components/create-account-drawer";
// import { BudgetProgress } from "./_components/budget-progress";
// import { DashboardOverview } from "./_components/transaction-overview";
// import { DashboardStatsCards } from "./_components/stats-cards";

// function computeStats(accounts, transactions) {
//   const totalBalance = accounts.reduce(
//     (sum, a) => sum + (Number(a.balance) || 0),
//     0
//   );
//   const now = new Date();
//   const thisMonth = transactions.filter((t) => {
//     const d = new Date(t.date);
//     return (
//       d.getMonth() === now.getMonth() &&
//       d.getFullYear() === now.getFullYear()
//     );
//   });
//   const monthlyIncome = thisMonth
//     .filter((t) => t.type === "INCOME")
//     .reduce((s, t) => s + (Number(t.amount) || 0), 0);
//   const monthlyExpense = thisMonth
//     .filter((t) => t.type === "EXPENSE")
//     .reduce((s, t) => s + (Number(t.amount) || 0), 0);

//   return { totalBalance, monthlyIncome, monthlyExpense };
// }

// function buildMonthlyData(transactions) {
//   const map = {};
//   transactions.forEach((t) => {
//     const d = new Date(t.date);
//     const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//     if (!map[key]) map[key] = { label: key, income: 0, expense: 0 };
//     if (t.type === "INCOME") map[key].income += Number(t.amount) || 0;
//     if (t.type === "EXPENSE") map[key].expense += Number(t.amount) || 0;
//   });
//   return Object.values(map)
//     .sort((a, b) => a.label.localeCompare(b.label))
//     .slice(-6);
// }

// export default async function DashboardPage() {
//   const [accounts, transactions] = await Promise.all([
//     getUserAccounts(),
//     getDashboardData(),
//   ]);

//   const safeAccounts = accounts || [];
//   const safeTransactions = transactions || [];

//   const defaultAccount = safeAccounts.find((a) => a.isDefault);
//   let budgetData = null;
//   if (defaultAccount) {
//     budgetData = await getCurrentBudget(defaultAccount.id);
//   }

//   const stats = computeStats(safeAccounts, safeTransactions);
//   const monthlyData = buildMonthlyData(safeTransactions);

//   return (
//     <div className="space-y-6 pb-10">
//       <DashboardStatsCards stats={stats} />

//       <BudgetProgress
//         initialBudget={budgetData?.budget}
//         currentExpenses={budgetData?.currentExpenses || 0}
//       />

//       <Suspense
//         fallback={
//           <div className="grid gap-5 md:grid-cols-2">
//             {/* <SkeletonCard />
//             <SkeletonCard /> */}
//           </div>
//         }
//       >
//         <DashboardOverview
//           accounts={safeAccounts}
//           transactions={safeTransactions}
//         />
//       </Suspense>

//       <section>
//         <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-4">
//           Your Accounts
//         </p>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <CreateAccountDrawer>
//             <div className="group rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/60 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/60 dark:hover:bg-violet-500/5 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg min-h-[180px] flex items-center justify-center">
//               <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
//                 <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
//                   <Plus className="w-5 h-5" />
//                 </div>
//                 <p className="text-sm font-bold">Add New Account</p>
//               </div>
//             </div>
//           </CreateAccountDrawer>

//           {safeAccounts.map((account, i) => (
//             <AccountCard key={account.id} account={account} delay={i * 70} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }


export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Plus, Dna, Telescope, Scale } from "lucide-react";
import Link from "next/link";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import { DashboardStatsCards } from "./_components/stats-cards";

// ─── Serialize Decimal → plain JS number everywhere ──────────────────────────
function serializeAccount(a) {
  return {
    ...a,
    balance: Number(a.balance),
  };
}

function serializeTransaction(t) {
  return {
    ...t,
    amount: Number(t.amount),
    date: t.date instanceof Date ? t.date.toISOString() : t.date,
  };
}

function serializeBudget(b) {
  if (!b) return null;
  return {
    ...b,
    amount: Number(b.amount),
  };
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function computeStats(accounts, transactions) {
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
  const monthlyIncome = thisMonth
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + (t.amount || 0), 0);
  const monthlyExpense = thisMonth
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + (t.amount || 0), 0);
  return { totalBalance, monthlyIncome, monthlyExpense };
}

// ─── AI Feature Cards (static nav tiles) ──────────────────────────────────────


// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  // ✅ Serialize ALL Decimal fields before passing to Client Components
  const safeAccounts = (accounts || []).map(serializeAccount);
  const safeTransactions = (transactions || []).map(serializeTransaction);

  const defaultAccount = safeAccounts.find((a) => a.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    const raw = await getCurrentBudget(defaultAccount.id);
    if (raw) {
      budgetData = {
        budget: raw.budget ? serializeBudget(raw.budget) : null,
        currentExpenses: Number(raw.currentExpenses || 0),
      };
    }
  }

  const stats = computeStats(safeAccounts, safeTransactions);

  return (
    <div className="space-y-6 pb-10">

      {/* Stats row */}
      <DashboardStatsCards stats={stats} />

      {/* Budget bar */}
      <BudgetProgress
        initialBudget={budgetData?.budget ?? null}
        currentExpenses={budgetData?.currentExpenses ?? 0}
      />

      {/* Charts */}
      <Suspense fallback={
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-slate-800/60 animate-pulse border border-slate-700/50" />
          <div className="h-64 rounded-2xl bg-slate-800/60 animate-pulse border border-slate-700/50" />
        </div>
      }>
        <DashboardOverview
          accounts={safeAccounts}
          transactions={safeTransactions}
        />
      </Suspense>
      

      {/* Accounts grid */}
      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-4">
          Your Accounts
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <div className="group rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/60 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/60 dark:hover:bg-violet-500/5 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg min-h-[180px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold">Add New Account</p>
              </div>
            </div>
          </CreateAccountDrawer>

          {safeAccounts.map((account, i) => (
            <AccountCard key={account.id} account={account} delay={i * 70} />
          ))}
        </div>
      </section>

    </div>
  );
}