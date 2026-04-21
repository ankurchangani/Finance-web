"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, Activity, BarChart3,
  DollarSign, Target, Calendar, CreditCard,
  Clock, AlertTriangle, CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { C, fmtK, fmtPct, fmt$, xAxisProps, yAxisProps, gridProps, legendStyle, yFmt$k } from "./utils";
import { KpiCard }                  from "./KpiCard";
import { SectionHeader, ChartCard } from "./SectionHeader";
import { ChartTooltip }             from "./ChartTooltip";

export function OverviewSection({ kpis, filtered, accounts, dailyAvgExpense, recurringTx, budgetData, budgetPercent, timeSeriesData, range }) {
  return (
    <div className="space-y-6">

      {/* ── Row 1: income / expense / net / savings ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Income"   value={fmtK(kpis.income)}  sub="in selected range"  icon={TrendingUp}   accent={C.emerald} trend={kpis.incomeTrend}    trendLabel="vs prev period" delay={0}    />
        <KpiCard label="Total Expenses" value={fmtK(kpis.expense)} sub="in selected range"  icon={TrendingDown} accent={C.red}     trend={-kpis.expenseTrend}  trendLabel="vs prev period" delay={0.08} />
        <KpiCard label="Net Cash Flow"  value={`${kpis.net >= 0 ? "+" : ""}${fmtK(kpis.net)}`} sub="income − expenses" icon={Activity} accent={kpis.net >= 0 ? C.blue : C.red} trend={kpis.netTrend} trendLabel="vs prev period" delay={0.16} />
        <KpiCard label="Savings Rate"   value={fmtPct(kpis.savings)} sub="of income saved"  icon={Target}       accent={C.purple}  badge={kpis.savings >= 20 ? "Excellent" : kpis.savings >= 10 ? "Good" : "Low"} delay={0.24} />
      </div>

      {/* ── Row 2: balance / avg tx / daily spend / recurring ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Portfolio Balance" value={fmtK(kpis.totalBalance)} sub={`${accounts.length} account${accounts.length !== 1 ? "s" : ""}`} icon={CreditCard} accent={C.teal}   delay={0.08} />
        <KpiCard label="Avg. Transaction"  value={fmt$(kpis.avgTxAmount)}  sub={`${filtered.length} total`}                                       icon={DollarSign} accent={C.amber}  delay={0.16} />
        <KpiCard label="Daily Avg. Spend"  value={fmt$(dailyAvgExpense)}   sub="per day"                                                          icon={Calendar}   accent={C.pink}   delay={0.24} />
        <KpiCard label="Recurring Total"   value={fmtK(recurringTx.reduce((s, t) => s + t.amount, 0))} sub={`${recurringTx.length} transactions`} icon={Clock}      accent={C.indigo} delay={0.32} />
      </div>

      {/* ── Budget progress ── */}
      {budgetData?.budget && (
        <ChartCard>
          <SectionHeader title="Monthly Budget Status" subtitle="Default account spending" icon={Target} accent={C.amber} />
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-white/50 font-poppins text-xs">{fmt$(budgetData.currentExpenses)} spent</span>
            <span className={cn("font-extrabold font-montserrat text-sm",
              budgetPercent >= 90 ? "text-red-400" : budgetPercent >= 75 ? "text-amber-400" : "text-emerald-400"
            )}>
              {budgetPercent?.toFixed(1)}% used
            </span>
            <span className="text-white/50 font-poppins text-xs">of {fmt$(budgetData.budget.amount)}</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
              style={{
                width: `${budgetPercent}%`,
                background: budgetPercent >= 90
                  ? `linear-gradient(90deg, ${C.red}, #ff6b6b)`
                  : budgetPercent >= 75
                  ? `linear-gradient(90deg, ${C.amber}, #fbbf24)`
                  : `linear-gradient(90deg, ${C.emerald}, #34d399)`,
              }}
            />
          </div>

          <div className="mt-3">
            {budgetPercent >= 90 ? (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-poppins">
                <AlertTriangle className="w-3 h-3" /> Budget critically low
              </div>
            ) : budgetPercent >= 75 ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-poppins">
                <AlertTriangle className="w-3 h-3" /> Approaching budget limit
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-poppins">
                <CheckCircle className="w-3 h-3" /> On track — keep it up!
              </div>
            )}
          </div>
        </ChartCard>
      )}

      {/* ── Area chart: income vs expense over time ── */}
      <ChartCard>
        <SectionHeader title="Income vs Expense Over Time" subtitle={`${range} · ${timeSeriesData.length} data points`} icon={BarChart3} />
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="ov-incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.emerald} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C.emerald} stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="ov-expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.red} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C.red} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...xAxisProps} />
              <YAxis {...yAxisProps} tickFormatter={yFmt$k} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              <Area type="monotone" dataKey="income"  stroke={C.emerald} strokeWidth={2.5} fill="url(#ov-incGrad)" name="Income"  dot={false} activeDot={{ r: 4, fill: C.emerald }} />
              <Area type="monotone" dataKey="expense" stroke={C.red}     strokeWidth={2.5} fill="url(#ov-expGrad)" name="Expense" dot={false} activeDot={{ r: 4, fill: C.red }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

    </div>
  );
}