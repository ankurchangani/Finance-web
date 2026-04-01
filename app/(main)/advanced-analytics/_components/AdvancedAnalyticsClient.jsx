"use client";

import { useState } from "react";
import { Activity, BarChart3, TrendingUp, PieChart as PieIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Hooks ─────────────────────────────────────────────────────────────────────
import {
  useFiltered, useKpis, useTimeSeries, useCumulative,
  useRunningBalance, useCategoryData, useIncomeSources,
  useMonthlyComparison, useRadarData, useMiscDerived,
} from "./useAnalyticsData";

// ── UI Components ─────────────────────────────────────────────────────────────
import { AccountFilter }    from "./AccountFilter";
import { OverviewSection }  from "./OverviewSection";
import { CashFlowSection }  from "./CashFlowSection";
import { SpendingSection }  from "./SpendingSection";
import { TrendsSection }    from "./TrendsSection.jsx";
import { InsightsSection }  from "./InsightsSection";

// ── Constants ─────────────────────────────────────────────────────────────────
import { C, RANGE_OPTIONS } from "./utils";

const SECTIONS = [
  { id: "overview",  label: "Overview",  icon: BarChart3  },
  { id: "cashflow",  label: "Cash Flow", icon: Activity   },
  { id: "spending",  label: "Spending",  icon: PieIcon    },
  { id: "trends",    label: "Trends",    icon: TrendingUp },
  { id: "insights",  label: "Insights",  icon: Zap        },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdvancedAnalyticsClient({ accounts, transactions, budgetData }) {
  const [range,         setRange]         = useState("90D");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [activeSection, setActiveSection] = useState("overview");

  // ── All data hooks ──────────────────────────────────────────────────────────
  const filtered         = useFiltered(transactions, range, accountFilter);
  const kpis             = useKpis(filtered, transactions, accounts, accountFilter, range);
  const timeSeriesData   = useTimeSeries(filtered, range);
  const cumulativeData   = useCumulative(timeSeriesData);
  const runningBalance   = useRunningBalance(filtered, accounts);
  const categoryData     = useCategoryData(filtered);
  const incomeSources    = useIncomeSources(filtered);
  const monthlyComparison = useMonthlyComparison(transactions, accountFilter);
  const radarData        = useRadarData(transactions, accountFilter);
  const { topExpenses, dailyAvgExpense, recurringTx } = useMiscDerived(filtered, range);

  const budgetPercent = budgetData?.budget
    ? Math.min((budgetData.currentExpenses / budgetData.budget.amount) * 100, 100)
    : null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white" style={{ background: C.bg }}>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[15%] w-[700px] h-[700px] rounded-full blur-[200px] opacity-[0.035]"
          style={{ background: C.blue }} />
        <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.03]"
          style={{ background: C.purple }} />
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: `linear-gradient(${C.blue}40 1px, transparent 1px), linear-gradient(90deg, ${C.blue}40 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: `${C.blue}15`, border: `1px solid ${C.blue}25` }}>
              <Activity className="w-3 h-3" style={{ color: C.blue }} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-montserrat" style={{ color: C.blue }}>
                Advanced Analytics
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat leading-tight">
              Financial{" "}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.purple})` }}>
                Intelligence
              </span>
            </h1>
            <p className="text-sm text-white/35 font-poppins mt-2">
              {transactions.length.toLocaleString()} transactions · {accounts.length} accounts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AccountFilter accounts={accounts} value={accountFilter} onChange={setAccountFilter} />

            {/* Range pills */}
            <div className="flex gap-1 p-1 rounded-xl border" style={{ background: C.card, borderColor: C.border }}>
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-bold font-montserrat transition-all duration-200",
                    range === r ? "" : "text-white/40 hover:text-white/70")}
                  style={range === r ? { background: `${C.blue}25`, border: `1px solid ${C.blue}35`, color: C.blue } : {}}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section Nav ── */}
        <div className="flex gap-1 p-1 rounded-2xl border mb-8 overflow-x-auto"
          style={{ background: C.card, borderColor: C.border }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 font-poppins",
                activeSection === s.id ? "" : "text-white/40 hover:text-white/65",
              )}
              style={activeSection === s.id
                ? { background: `${C.blue}18`, border: `1px solid ${C.blue}28`, color: C.blue }
                : {}}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Active Section ── */}
        {activeSection === "overview" && (
          <OverviewSection
            kpis={kpis}
            filtered={filtered}
            accounts={accounts}
            dailyAvgExpense={dailyAvgExpense}
            recurringTx={recurringTx}
            budgetData={budgetData}
            budgetPercent={budgetPercent}
            timeSeriesData={timeSeriesData}
            range={range}
          />
        )}
        {activeSection === "cashflow" && (
          <CashFlowSection
            runningBalance={runningBalance}
            timeSeriesData={timeSeriesData}
            monthlyComparison={monthlyComparison}
          />
        )}
        {activeSection === "spending" && (
          <SpendingSection
            categoryData={categoryData}
            incomeSources={incomeSources}
            topExpenses={topExpenses}
          />
        )}
        {activeSection === "trends" && (
          <TrendsSection
            radarData={radarData}
            cumulativeData={cumulativeData}
            accounts={accounts}
          />
        )}
        {activeSection === "insights" && (
          <InsightsSection
            kpis={kpis}
            categoryData={categoryData}
            dailyAvgExpense={dailyAvgExpense}
            recurringTx={recurringTx}
            accounts={accounts}
            filtered={filtered}
            transactions={transactions}
          />
        )}

        {/* ── Footer ── */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
          <p className="text-xs text-white/20 font-poppins">
            {range === "ALL" ? "All time" : `Last ${range}`} · {filtered.length} transactions
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/20 font-poppins">
            <Zap className="w-3 h-3" style={{ color: C.blue }} />
            <span>Welth Analytics Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
}
