// app/dashboard/_components/stats-cards.jsx
// ── Pure Server Component — no "use client" needed ──────────────────────────
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ title, value, subtitle, icon: Icon, accent, trend }) {
  return (
    <div className={cn(
      "relative rounded-2xl p-5 border overflow-hidden",
      "bg-card border-border",
      "hover:border-border/80 transition-all duration-300 group"
    )}>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            trend >= 0
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl font-bold text-foreground font-montserrat">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
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
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Balance"
        value={fmt(totalBalance)}
        subtitle="Across all accounts"
        icon={Wallet}
        accent="#22BDFD"
      />
      <StatCard
        title="Monthly Income"
        value={fmt(monthlyIncome)}
        subtitle="This month"
        icon={TrendingUp}
        accent="#10B981"
        trend={0}
      />
      <StatCard
        title="Monthly Expenses"
        value={fmt(monthlyExpense)}
        subtitle="This month"
        icon={TrendingDown}
        accent="#EF4444"
        trend={0}
      />
      <StatCard
        title="Savings Rate"
        value={`${savingsRate}%`}
        subtitle={net >= 0 ? `+${fmt(net)} net` : `${fmt(net)} net`}
        icon={BarChart3}
        accent={parseFloat(savingsRate) >= 20 ? "#10B981" : parseFloat(savingsRate) >= 10 ? "#F59E0B" : "#EF4444"}
      />
    </div>
  );
}
