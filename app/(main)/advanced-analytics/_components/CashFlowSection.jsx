"use client";

import {
  AreaChart, Area,
  BarChart, Bar,
  ComposedChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { Activity, BarChart3, Calendar } from "lucide-react";
import { C, xAxisProps, yAxisProps, gridProps, legendStyle, yFmtK } from "./utils";
import { SectionHeader, ChartCard } from "./SectionHeader";
import { ChartTooltip }             from "./ChartTooltip";

export function CashFlowSection({ runningBalance, timeSeriesData, monthlyComparison }) {
  return (
    <div className="space-y-6">

      {/* Running Balance */}
      <ChartCard>
        <SectionHeader title="Running Balance" subtitle="Last 30 data points (reverse-reconstructed)" icon={Activity} accent={C.blue} />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={runningBalance}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...xAxisProps} />
              <YAxis {...yAxisProps} tickFormatter={yFmtK} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
              <Area
                type="monotone" dataKey="balance"
                stroke={C.blue} strokeWidth={2.5}
                fill="url(#balGrad)" name="Balance"
                dot={false} activeDot={{ r: 4, fill: C.blue }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Net Cash Flow — Composed (bar + line) */}
      <ChartCard>
        <SectionHeader title="Net Cash Flow by Period" subtitle="Income & expense bars · net flow line" icon={BarChart3} accent={C.purple} />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeSeriesData} barGap={2}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...xAxisProps} />
              <YAxis {...yAxisProps} tickFormatter={yFmtK} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
              <Bar dataKey="income"  fill={C.emerald} radius={[3,3,0,0]} opacity={0.85} name="Income"  />
              <Bar dataKey="expense" fill={C.red}     radius={[3,3,0,0]} opacity={0.85} name="Expense" />
              <Line
                type="monotone" dataKey="net"
                stroke={C.blue} strokeWidth={2.5}
                dot={false} activeDot={{ r: 4, fill: C.blue }}
                name="Net"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 6-Month Comparison */}
      <ChartCard>
        <SectionHeader title="6-Month Comparison" subtitle="Monthly income vs expense" icon={Calendar} accent={C.teal} />
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparison} barGap={4} barCategoryGap="28%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...xAxisProps} />
              <YAxis {...yAxisProps} tickFormatter={yFmtK} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              <Bar dataKey="income"  fill={C.emerald} radius={[4,4,0,0]} name="Income"  />
              <Bar dataKey="expense" fill={C.red}     radius={[4,4,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

    </div>
  );
}