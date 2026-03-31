"use client";

import { useMemo, useState } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs capitalize">{p.name}</span>
          </div>
          <span className="text-xs font-bold">${Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function MonthlyChart({ data }) {
  const [chartType, setChartType] = useState("bar");

  // Format label: "2024-01" → "Jan 24"
  const formatted = useMemo(() =>
    (data || []).map((d) => {
      const [y, m] = d.label.split("-");
      const date = new Date(Number(y), Number(m) - 1);
      return {
        ...d,
        label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      };
    }),
  [data]);

  const totals = useMemo(() =>
    formatted.reduce((acc, d) => ({
      income:  acc.income  + (d.income  || 0),
      expense: acc.expense + (d.expense || 0),
    }), { income: 0, expense: 0 }),
  [formatted]);

  const axisProps = {
    axisLine: false, tickLine: false,
    tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
  };
  const gridProps = { strokeDasharray: "3 3", stroke: "hsl(var(--border))", vertical: false };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-semibold">Monthly Overview</CardTitle>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[110px] h-8 text-xs rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Totals row */}
        <div className="flex gap-6 mb-5 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Total Income</p>
            <p className="font-bold text-emerald-500">${totals.income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Total Expenses</p>
            <p className="font-bold text-red-500">${totals.expense.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Net</p>
            <p className={`font-bold ${totals.income - totals.expense >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              ${(totals.income - totals.expense).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income"  name="Income"  fill="#10B981" radius={[4,4,0,0]} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            ) : (
              <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="income"  name="Income"  stroke="#10B981" fill="url(#incG)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" fill="url(#expG)" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
