import {
  LineChart, Line,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer,
} from "recharts";
import { Activity, TrendingUp, CreditCard } from "lucide-react";
import { C, PALETTE, xAxisProps, yAxisProps, gridProps, legendStyle, yFmtK } from "./utils";
import { SectionHeader, ChartCard } from "./SectionHeader";
import { ChartTooltip } from "./ChartTooltip";

export function TrendsSection({ radarData, cumulativeData, accounts }) {
  return (
    <div className="space-y-6">
      {/* Radar: this vs last month */}
      <ChartCard>
        <SectionHeader title="Spending Pattern — This vs Last Month" subtitle="By category" icon={Activity} accent={C.purple} />
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "var(--font-poppins)" }}
              />
              <Radar name="This Month" dataKey="This Month" stroke={C.blue}   fill={C.blue}   fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Last Month" dataKey="Last Month" stroke={C.purple} fill={C.purple} fillOpacity={0.1}  strokeWidth={2} strokeDasharray="4 4" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={legendStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Cumulative line */}
      <ChartCard>
        <SectionHeader title="Cumulative Income vs Expense" subtitle="Running total over time" icon={TrendingUp} accent={C.teal} />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...xAxisProps} />
              <YAxis {...yAxisProps} tickFormatter={yFmtK} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              <Line type="monotone" dataKey="cumIncome"  stroke={C.emerald} strokeWidth={2.5} dot={false} name="Cumulative Income" />
              <Line type="monotone" dataKey="cumExpense" stroke={C.red}     strokeWidth={2.5} dot={false} name="Cumulative Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Account balances */}
      {accounts.length > 1 && (
        <ChartCard>
          <SectionHeader title="Account Balance Distribution" subtitle="Current balances" icon={CreditCard} accent={C.indigo} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accounts.map((a) => ({ name: a.name, balance: parseFloat(a.balance || 0) }))}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...xAxisProps} />
                <YAxis {...yAxisProps} tickFormatter={yFmtK} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="balance" radius={[6,6,0,0]} name="Balance">
                  {accounts.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
