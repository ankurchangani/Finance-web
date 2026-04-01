import { format, subDays } from "date-fns";
import {
  TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Zap, Calendar, CreditCard,
} from "lucide-react";
import { C, PALETTE, fmt$, fmtK, fmtPct } from "./utils";
import { SectionHeader, ChartCard } from "./SectionHeader";

// ─── Insight card data builder ────────────────────────────────────────────────
function buildInsights({ kpis, categoryData, dailyAvgExpense, recurringTx, accounts }) {
  return [
    {
      icon:  kpis.savings >= 20 ? CheckCircle : AlertTriangle,
      color: kpis.savings >= 20 ? C.emerald : kpis.savings >= 10 ? C.amber : C.red,
      title: "Savings Rate",
      body:  kpis.savings >= 20
        ? `Excellent! You're saving ${fmtPct(kpis.savings)} of income — above the recommended 20%.`
        : kpis.savings >= 10
        ? `Savings rate is ${fmtPct(kpis.savings)}. Aim for 20% for stronger financial health.`
        : `Savings rate is only ${fmtPct(kpis.savings)}. Reduce expenses to improve this.`,
    },
    {
      icon:  kpis.net >= 0 ? TrendingUp : TrendingDown,
      color: kpis.net >= 0 ? C.blue : C.red,
      title: "Cash Flow",
      body:  kpis.net >= 0
        ? `Positive flow of ${fmtK(kpis.net)}. You earned more than you spent this period.`
        : `Negative flow of ${fmtK(Math.abs(kpis.net))}. Spending exceeds income — review expenses.`,
    },
    {
      icon:  categoryData[0] ? AlertTriangle : CheckCircle,
      color: C.amber,
      title: "Top Spending Category",
      body:  categoryData[0]
        ? `"${categoryData[0].name}" is your largest expense at ${fmt$(categoryData[0].value)} (${fmtPct(categoryData[0].value / (kpis.expense || 1) * 100)} of total).`
        : "No expense data for this period.",
    },
    {
      icon:  dailyAvgExpense > 200 ? AlertTriangle : CheckCircle,
      color: dailyAvgExpense > 200 ? C.red : C.emerald,
      title: "Daily Spending Average",
      body:  `Average ${fmt$(dailyAvgExpense)} per day. ${dailyAvgExpense > 200 ? "Above average — consider reducing discretionary spending." : "Healthy daily spending rate."}`,
    },
    {
      icon:  recurringTx.length > 0 ? Clock : CheckCircle,
      color: C.indigo,
      title: "Recurring Transactions",
      body:  recurringTx.length > 0
        ? `${recurringTx.length} recurring transaction(s) totaling ${fmtK(recurringTx.reduce((s, t) => s + t.amount, 0))}. Review them regularly.`
        : "No recurring transactions in this period.",
    },
    {
      icon:  accounts.length > 1 ? CheckCircle : Zap,
      color: C.teal,
      title: "Account Diversification",
      body:  accounts.length > 1
        ? `${accounts.length} accounts totaling ${fmtK(kpis.totalBalance)}. Good diversification!`
        : "Consider opening a savings account to separate spending from savings.",
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────
export function InsightsSection({ kpis, categoryData, dailyAvgExpense, recurringTx, accounts, filtered, transactions }) {
  const insights = buildInsights({ kpis, categoryData, dailyAvgExpense, recurringTx, accounts });

  return (
    <div className="space-y-6">
      {/* Insight cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((ins, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 border transition-all duration-300 hover:border-white/15"
            style={{ background: C.card, borderColor: C.border }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${ins.color}18`, border: `1px solid ${ins.color}25`, color: ins.color }}
              >
                <ins.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-montserrat mb-1">{ins.title}</h4>
                <p className="text-[13px] text-white/50 font-poppins leading-relaxed">{ins.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <ChartCard>
        <SectionHeader title="Transaction Frequency" subtitle="Last 12 weeks" icon={Calendar} accent={C.blue} />
        <div className="overflow-x-auto">
          <div className="flex gap-1.5 min-w-max py-2">
            {Array.from({ length: 12 }, (_, week) =>
              Array.from({ length: 7 }, (__, day) => {
                const d     = subDays(new Date(), (11 - week) * 7 + (6 - day));
                const count = filtered.filter(
                  (t) => format(new Date(t.date), "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
                ).length;
                return (
                  <div
                    key={`${week}-${day}`}
                    className="w-5 h-5 rounded-sm transition-all duration-200 hover:scale-125 cursor-default"
                    title={`${format(d, "MMM d")}: ${count} tx`}
                    style={{
                      background: count === 0
                        ? "rgba(255,255,255,0.04)"
                        : `rgba(34,189,253,${0.15 + Math.min(count / 5, 1) * 0.75})`,
                      border: `1px solid rgba(255,255,255,${count === 0 ? 0.04 : 0.1})`,
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-white/25 font-poppins">Less</span>
          {[0, 0.2, 0.4, 0.65, 0.85].map((o, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ background: `rgba(34,189,253,${o === 0 ? 0.04 : o})` }} />
          ))}
          <span className="text-[10px] text-white/25 font-poppins">More</span>
        </div>
      </ChartCard>

      {/* Account summary table */}
      <ChartCard>
        <SectionHeader title="Account Summary" subtitle="All accounts at a glance" icon={CreditCard} accent={C.purple} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border }}>
                {["Account", "Type", "Balance", "Transactions", "Avg. Tx", "Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] text-white/30 font-montserrat uppercase tracking-widest pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((a, i) => {
                const aTx = transactions.filter((t) => t.accountId === a.id);
                const avg = aTx.length ? aTx.reduce((s, t) => s + t.amount, 0) / aTx.length : 0;
                return (
                  <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold font-montserrat"
                          style={{ background: `${PALETTE[i % PALETTE.length]}20`, color: PALETTE[i % PALETTE.length] }}
                        >
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white font-poppins">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><span className="text-xs font-poppins text-white/40 capitalize">{a.type?.toLowerCase()}</span></td>
                    <td className="py-3 pr-4"><span className="text-sm font-bold font-montserrat text-white">{fmt$(a.balance)}</span></td>
                    <td className="py-3 pr-4"><span className="text-sm font-poppins text-white/60">{aTx.length}</span></td>
                    <td className="py-3 pr-4"><span className="text-sm font-poppins text-white/60">{fmt$(avg)}</span></td>
                    <td className="py-3">
                      {a.isDefault ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-montserrat"
                          style={{ background: `${C.blue}20`, color: C.blue, border: `1px solid ${C.blue}30` }}>
                          Default
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/25 font-poppins">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
