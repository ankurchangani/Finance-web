// app/dashboard/_components/stats-cards.jsx
"use client";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ title, value, subtitle, icon: Icon, accent, trend, delay = 0 }) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl p-5 overflow-hidden cursor-default",
        "bg-slate-800/70",
        "border border-slate-700/50",
        "hover:border-slate-600",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/40",
        "transition-all duration-300 ease-out",
        "animate-[float-up_0.5s_ease_both]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}44)` }}
      />

      {/* Glow blob */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-300"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          <Icon className="w-5 h-5" />
        </div>

        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            )}
          >
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
        {title}
      </p>
      <p className="text-2xl font-black text-white tabular-nums transition-all duration-300 group-hover:scale-[1.02] origin-left">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export function DashboardStatsCards({ stats }) {
  const { totalBalance, monthlyIncome, monthlyExpense } = stats;
  const net = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0
    ? ((net / monthlyIncome) * 100).toFixed(1)
    : "0.0";

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const savingsPct = parseFloat(savingsRate);
  const savingsAccent = savingsPct >= 20 ? "#10B981" : savingsPct >= 10 ? "#F59E0B" : "#EF4444";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Balance"
        value={fmt(totalBalance)}
        subtitle="Across all accounts"
        icon={Wallet}
        accent="#8B5CF6"
        delay={0}
      />
      <StatCard
        title="Monthly Income"
        value={fmt(monthlyIncome)}
        subtitle="This month"
        icon={TrendingUp}
        accent="#10B981"
        trend={0}
        delay={60}
      />
      <StatCard
        title="Monthly Expenses"
        value={fmt(monthlyExpense)}
        subtitle="This month"
        icon={TrendingDown}
        accent="#EF4444"
        trend={0}
        delay={120}
      />
      <StatCard
        title="Savings Rate"
        value={`${savingsRate}%`}
        subtitle={net >= 0 ? `+${fmt(net)} net` : `${fmt(net)} net`}
        icon={BarChart3}
        accent={savingsAccent}
        delay={180}
      />
    </div>
  );
}