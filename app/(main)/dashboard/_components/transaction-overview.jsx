"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Only red shades for the chart ──
const COLORS = [
  "#FF0000",
  "#CC0000",
  "#FF3333",
  "#990000",
  "#FF6666",
  "#800000",
  "#FF9999",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
        <p className="text-red-500 font-semibold text-sm mb-1">
          {payload[0].name}
        </p>
        <p className="text-foreground font-bold text-lg">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 px-4">
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-1.5 group cursor-default">
        <span
          className="w-2.5 h-2.5 rounded-full transition-transform duration-200 group-hover:scale-125"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );
  const [hoveredTx, setHoveredTx] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({ name: category, value: amount })
  );

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {/* ── Recent Transactions — uses CSS variable theme ── */}
      <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
              Recent Transactions
            </CardTitle>
          </div>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <div className="space-y-1">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Wallet className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No recent transactions</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onMouseEnter={() => setHoveredTx(transaction.id)}
                  onMouseLeave={() => setHoveredTx(null)}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-xl cursor-default transition-all duration-200",
                    hoveredTx === transaction.id ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
                        transaction.type === "EXPENSE"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary/20 text-secondary",
                        hoveredTx === transaction.id && "scale-110"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground leading-none mb-1">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "text-sm font-bold tabular-nums transition-all duration-200",
                      transaction.type === "EXPENSE"
                        ? "text-destructive"
                        : "text-secondary",
                      hoveredTx === transaction.id && "scale-105"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "−" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Expense Breakdown — red chart only ── */}
      <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <CardHeader className="pt-5 px-5 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <CardTitle className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
              Monthly Expense Breakdown
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center mb-3">
                <span className="text-2xl opacity-30">$</span>
              </div>
              <p className="text-sm">No expenses this month</p>
            </div>
          ) : (
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {COLORS.map((color, i) => (
                      <radialGradient key={i} id={`grad-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="47%"
                    outerRadius={activeIndex !== null ? 95 : 90}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#grad-${index % COLORS.length})`}
                        stroke={activeIndex === index ? COLORS[index % COLORS.length] : "transparent"}
                        strokeWidth={activeIndex === index ? 2 : 0}
                        style={{
                          filter: activeIndex === index
                            ? `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}88)`
                            : "none",
                          transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                          transformOrigin: "center",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          opacity: activeIndex !== null && activeIndex !== index ? 0.5 : 1,
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
