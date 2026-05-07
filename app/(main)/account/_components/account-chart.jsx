"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

// ─── Date Ranges ─────────────────────────────────────────────
const DATE_RANGES = {
  "7D": { label: "Last 7 Days",   days: 7   },
  "1M": { label: "Last Month",    days: 30  },
  "3M": { label: "Last 3 Months", days: 90  },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL:  { label: "All Time",      days: null },
};

// ─── 3-D Bar Geometry ────────────────────────────────────────
const DEPTH = 6;
const SKEW  = 0.5;

function Bar3D({ x, y, width, height, fill, sideFill, topFill }) {
  if (!height || height <= 0) return null;

  const front = `M ${x},${y + height} L ${x},${y} L ${x + width},${y} L ${x + width},${y + height} Z`;
  const side  = `
    M ${x + width},${y}
    L ${x + width + DEPTH},${y - DEPTH * SKEW}
    L ${x + width + DEPTH},${y + height - DEPTH * SKEW}
    L ${x + width},${y + height} Z
  `;
  const top   = `
    M ${x},${y}
    L ${x + DEPTH},${y - DEPTH * SKEW}
    L ${x + width + DEPTH},${y - DEPTH * SKEW}
    L ${x + width},${y} Z
  `;

  return (
    <g>
      <path d={front} fill={fill}     />
      <path d={side}  fill={sideFill} />
      <path d={top}   fill={topFill}  />
    </g>
  );
}

const IncomeBar  = (props) => (
  <Bar3D {...props} fill="#22c55e" sideFill="#15803d" topFill="#4ade80" />
);
const ExpenseBar = (props) => (
  <Bar3D {...props} fill="#ef4444" sideFill="#b91c1c" topFill="#f87171" />
);

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover shadow-xl p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: entry.fill }}
            />
            {entry.name}
          </span>
          <span className="font-bold" style={{ color: entry.fill }}>
            ${Number(entry.value).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── ✅ Custom Legend ─────────────────────────────────────────
function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pt-3">
      {/* Income */}
      <div className="flex items-center gap-2">
        {/* Mini 3-D box */}
        <svg width="18" height="14" viewBox="0 0 18 14">
          {/* front */}
          <rect x="0" y="2" width="12" height="10" fill="#22c55e" rx="1" />
          {/* side */}
          <polygon points="12,2 18,0 18,10 12,12" fill="#15803d" />
          {/* top */}
          <polygon points="0,2 6,0 18,0 12,2" fill="#4ade80" />
        </svg>
        <span className="text-xs font-medium text-muted-foreground">
          Income
        </span>
      </div>

      {/* Expense */}
      <div className="flex items-center gap-2">
        <svg width="18" height="14" viewBox="0 0 18 14">
          <rect x="0" y="2" width="12" height="10" fill="#ef4444" rx="1" />
          <polygon points="12,2 18,0 18,10 12,12" fill="#b91c1c" />
          <polygon points="0,2 6,0 18,0 12,2" fill="#f87171" />
        </svg>
        <span className="text-xs font-medium text-muted-foreground">
          Expense
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range     = DATE_RANGES[dateRange];
    const now       = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) =>
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, t) => {
      const date = format(new Date(t.date), "MMM dd");
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      if (t.type === "INCOME") acc[date].income  += t.amount;
      else                      acc[date].expense += t.amount;
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(
    () =>
      filteredData.reduce(
        (acc, day) => ({
          income:  acc.income  + day.income,
          expense: acc.expense + day.expense,
        }),
        { income: 0, expense: 0 }
      ),
    [filteredData]
  );

  const net = totals.income - totals.expense;

  return (
    <Card className="overflow-hidden border-border">

      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>

        {/* ── Summary Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">

          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/15">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-sm font-bold text-green-500">
                ${totals.income.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/15">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-sm font-bold text-red-500">
                ${totals.expense.toFixed(2)}
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${
              net >= 0
                ? "bg-blue-500/10 border-blue-500/20"
                : "bg-orange-500/10 border-orange-500/20"
            }`}
          >
            <div className={`p-2 rounded-lg ${net >= 0 ? "bg-blue-500/15" : "bg-orange-500/15"}`}>
              <Wallet className={`h-4 w-4 ${net >= 0 ? "text-blue-500" : "text-orange-500"}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net</p>
              <p className={`text-sm font-bold ${net >= 0 ? "text-blue-500" : "text-orange-500"}`}>
                {net >= 0 ? "+" : ""}${net.toFixed(2)}
              </p>
            </div>
          </div>

        </div>

        {/* ── 3-D Bar Chart ──────────────────────────────────── */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 14, right: 20, left: 0, bottom: 0 }}
              barCategoryGap="30%"
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.6}
              />
              <XAxis
                dataKey="date"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4, radius: 4 }}
              />

              {/* ✅ Custom Legend replaces default */}
              <Legend content={<CustomLegend />} />

              <Bar dataKey="income"  name="Income"  shape={<IncomeBar  />} maxBarSize={36} />
              <Bar dataKey="expense" name="Expense" shape={<ExpenseBar />} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  );
}