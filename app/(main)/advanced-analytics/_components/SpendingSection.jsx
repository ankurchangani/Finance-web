import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowDownRight, Layers, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { format } from "date-fns";
import { C, PALETTE, INCOME_COLORS, fmt$ } from "./utils";
import { SectionHeader, ChartCard } from "./SectionHeader";
import { PieTooltip } from "./PieTooltip";

export function SpendingSection({ categoryData, incomeSources, topExpenses }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense pie */}
        <ChartCard>
          <SectionHeader title="Expense Breakdown" subtitle="By category" icon={PieIcon} accent={C.red} />
          {categoryData.length > 0 ? (
            <>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {categoryData.slice(0, 6).map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                      <span className="text-[11px] text-white/50 font-poppins truncate capitalize">{d.name}</span>
                    </div>
                    <span className="text-[11px] font-bold font-montserrat text-white/70 flex-shrink-0">{fmt$(d.value, 0)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-white/20 font-poppins text-sm">No expense data</div>
          )}
        </ChartCard>

        {/* Income pie */}
        <ChartCard>
          <SectionHeader title="Income Sources" subtitle="By category" icon={TrendingUp} accent={C.emerald} />
          {incomeSources.length > 0 ? (
            <>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incomeSources} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                      {incomeSources.map((_, i) => (
                        <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {incomeSources.slice(0, 4).map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: INCOME_COLORS[i % INCOME_COLORS.length] }} />
                      <span className="text-[11px] text-white/50 font-poppins truncate capitalize">{d.name}</span>
                    </div>
                    <span className="text-[11px] font-bold font-montserrat text-white/70 flex-shrink-0">{fmt$(d.value, 0)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-white/20 font-poppins text-sm">No income data</div>
          )}
        </ChartCard>
      </div>

      {/* Category bar chart */}
      <ChartCard>
        <SectionHeader title="Top Spending Categories" subtitle="Ranked by amount" icon={Layers} accent={C.amber} />
        <div className="space-y-3">
          {categoryData.slice(0, 8).map((d, i) => {
            const pct = categoryData[0]?.value ? (d.value / categoryData[0].value) * 100 : 0;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-white/50 font-poppins capitalize w-24 flex-shrink-0 truncate">{d.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${PALETTE[i % PALETTE.length]}, ${PALETTE[(i + 1) % PALETTE.length]})` }}
                  />
                </div>
                <span className="text-xs font-bold font-montserrat text-white/70 w-20 text-right flex-shrink-0">
                  {fmt$(d.value, 0)}
                </span>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* Top 5 transactions */}
      <ChartCard>
        <SectionHeader title="Top Expenses" subtitle="Highest single transactions" icon={ArrowDownRight} accent={C.red} />
        <div className="space-y-2">
          {topExpenses.length === 0 ? (
            <p className="text-sm text-white/25 font-poppins py-6 text-center">No expense data</p>
          ) : (
            topExpenses.map((tx, i) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-bold font-montserrat w-4 flex-shrink-0 text-white/20">{i + 1}</span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${PALETTE[i % PALETTE.length]}20`, color: PALETTE[i % PALETTE.length] }}
                >
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white font-poppins truncate">{tx.description || "Untitled"}</p>
                  <p className="text-[10px] text-white/30 font-poppins capitalize">
                    {tx.category} · {format(new Date(tx.date), "MMM d, yyyy")}
                  </p>
                </div>
                <span className="text-sm font-extrabold font-montserrat text-red-400 flex-shrink-0">
                  −{fmt$(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </ChartCard>
    </div>
  );
}
