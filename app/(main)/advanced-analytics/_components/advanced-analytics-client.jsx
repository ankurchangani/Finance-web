"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  format, subDays, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, eachMonthOfInterval,
  differenceInDays,
} from "date-fns";
import {
  TrendingUp, TrendingDown, Activity, BarChart3,
  DollarSign, ArrowDownRight, Zap,
  Target, PieChart as PieIcon, Calendar,
  Layers, CreditCard, AlertTriangle,
  CheckCircle, Clock, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  blue:    "#22BDFD",
  purple:  "#7C3AED",
  emerald: "#10B981",
  amber:   "#F59E0B",
  red:     "#EF4444",
  pink:    "#EC4899",
  indigo:  "#6366F1",
  teal:    "#14B8A6",
  bg:      "hsl(220,22%,5%)",
  card:    "hsl(220,20%,8%)",
  border:  "rgba(255,255,255,0.07)",
};

const PALETTE = [C.blue, C.purple, C.emerald, C.amber, C.red, C.pink, C.indigo, C.teal];
const RANGE_OPTIONS = ["7D", "30D", "90D", "6M", "1Y", "ALL"];

// ─── Pure helpers (stable refs — defined outside component) ──────────────────
const fmt$   = (n, dec = 2) => `$${Math.abs(parseFloat(n || 0)).toFixed(dec)}`;
const fmtK   = (n) => { const v = Math.abs(parseFloat(n || 0)); return v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`; };
const fmtPct = (n) => `${parseFloat(n || 0).toFixed(1)}%`;

function getRangeStart(range) {
  const now = new Date();
  const map = { "7D": subDays(now, 7), "30D": subDays(now, 30), "90D": subDays(now, 90), "6M": subMonths(now, 6), "1Y": subMonths(now, 12) };
  return map[range] ?? null;
}

// ─── Memoized sub-components ─────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[hsl(220,20%,11%)] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl min-w-[140px]">
      <p className="text-[10px] text-white/40 font-poppins mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
            <span className="text-xs text-white/60 font-poppins capitalize">{p.name}</span>
          </div>
          <span className="text-xs font-bold font-montserrat text-white">{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[hsl(220,20%,11%)] border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-xs font-bold text-white font-montserrat capitalize">{payload[0].name}</p>
      <p className="text-sm font-extrabold font-montserrat" style={{ color: payload[0].payload.fill }}>{fmt$(payload[0].value)}</p>
      <p className="text-[10px] text-white/40 font-poppins">{fmtPct(payload[0].percent * 100)}</p>
    </div>
  );
};

function KpiCard({ label, value, sub, icon: Icon, accent, trend, trendLabel, badge }) {
  return (
    <div className="relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:border-white/15"
      style={{ background: C.card, borderColor: C.border }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}10, transparent 60%)` }} />
      <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ background: `${accent}18`, borderColor: `${accent}30`, color: accent }}>
            <Icon className="w-4 h-4" />
          </div>
          {badge && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full font-montserrat tracking-wider"
              style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-white/40 font-poppins mb-1">{label}</p>
        <p className="text-2xl font-extrabold font-montserrat text-white mb-2">{value}</p>
        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <span className={cn("flex items-center gap-0.5 text-[11px] font-bold font-montserrat",
              trend >= 0 ? "text-emerald-400" : "text-red-400")}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend >= 0 ? "+" : "−"}{Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {sub && <p className="text-[10px] text-white/30 font-poppins">{sub}</p>}
        </div>
        {trendLabel && <p className="text-[10px] text-white/20 font-poppins mt-0.5">{trendLabel}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon: Icon, accent = C.blue }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}18`, border: `1px solid ${accent}25`, color: accent }}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white font-montserrat">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/35 font-poppins">{subtitle}</p>}
      </div>
    </div>
  );
}

function ChartCard({ children, className }) {
  return (
    <div className={cn("rounded-2xl p-5 border", className)} style={{ background: C.card, borderColor: C.border }}>
      {children}
    </div>
  );
}

// ─── ✅ FIXED: Custom Account Filter Dropdown ────────────────────────────────
function AccountFilter({ accounts, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = value === "ALL" ? "All Accounts" : accounts.find(a => a.id === value)?.name ?? "All Accounts";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-poppins text-white/70
          hover:text-white hover:border-white/20 transition-all duration-200"
        style={{ background: C.card, borderColor: C.border, minWidth: 140 }}
      >
        {/* Colored dot for selected account */}
        {value !== "ALL" && (
          <span className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: PALETTE[accounts.findIndex(a => a.id === value) % PALETTE.length] }} />
        )}
        <span className="flex-1 text-left truncate">{selected}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-white/40 flex-shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown panel */}
          <div
            className="absolute right-0 top-full mt-1.5 z-50 min-w-[180px] rounded-2xl border overflow-hidden shadow-2xl"
            style={{ background: "hsl(220,20%,10%)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            {/* All Accounts option */}
            <button
              onClick={() => { onChange("ALL"); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-poppins transition-colors duration-150 text-left",
                value === "ALL"
                  ? "text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
              style={value === "ALL" ? { background: `${C.blue}15`, color: C.blue } : {}}
            >
              {/* All accounts — grid icon */}
              <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: value === "ALL" ? `${C.blue}25` : "rgba(255,255,255,0.06)" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="6" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="0" y="6" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                </svg>
              </span>
              <span className="font-medium">All Accounts</span>
              {value === "ALL" && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: C.blue }} />}
            </button>

            {/* Divider */}
            <div className="mx-3 my-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Individual accounts */}
            {accounts.map((a, i) => {
              const color = PALETTE[i % PALETTE.length];
              const isSelected = value === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => { onChange(a.id); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-poppins transition-all duration-150 text-left",
                    isSelected ? "text-white" : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  )}
                  style={isSelected ? { background: `${color}12` } : {}}
                >
                  {/* Account initial avatar */}
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold font-montserrat flex-shrink-0"
                    style={{ background: `${color}25`, color }}>
                    {a.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1 truncate font-medium">{a.name}</span>
                  {/* Balance chip */}
                  <span className="text-[9px] font-montserrat font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${color}15`, color: `${color}cc` }}>
                    {fmtK(a.balance)}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 ml-1" style={{ background: color }} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdvancedAnalyticsClient({ accounts, transactions, budgetData }) {
  const [range,         setRange]         = useState("90D");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [activeSection, setActiveSection] = useState("overview");

  // ── Filtered transactions ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const start = getRangeStart(range);
    return transactions.filter(t => {
      const d = new Date(t.date);
      return (start ? d >= start : true) && (accountFilter === "ALL" || t.accountId === accountFilter);
    });
  }, [transactions, range, accountFilter]);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const income  = filtered.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    const net     = income - expense;
    const savings = income > 0 ? (net / income) * 100 : 0;
    const totalBalance = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0);
    const avgTxAmount  = filtered.length ? filtered.reduce((s, t) => s + t.amount, 0) / filtered.length : 0;

    const start     = getRangeStart(range);
    const rangeDays = start ? differenceInDays(new Date(), start) : 365;
    const prevStart = subDays(start || subDays(new Date(), 365), rangeDays);
    const prevEnd   = start ? new Date(start.getTime() - 1) : subDays(new Date(), 365);

    const prev = transactions.filter(t => {
      const d = new Date(t.date);
      return (accountFilter === "ALL" || t.accountId === accountFilter) && d >= prevStart && d <= prevEnd;
    });
    const pi = prev.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const pe = prev.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

    return {
      income, expense, net, savings, totalBalance, avgTxAmount,
      incomeTrend:  pi > 0 ? ((income - pi)  / pi)  * 100 : 0,
      expenseTrend: pe > 0 ? ((expense - pe) / pe) * 100 : 0,
      netTrend:     pi > 0 ? (((income - expense) - (pi - pe)) / Math.abs(pi - pe || 1)) * 100 : 0,
    };
  }, [filtered, transactions, accounts, accountFilter, range]);

  // ── Time series ───────────────────────────────────────────────────────────
  const timeSeriesData = useMemo(() => {
    const start = getRangeStart(range) || subMonths(new Date(), 12);
    const now   = new Date();
    const useMonthly = differenceInDays(now, start) > 60;

    if (useMonthly) {
      return eachMonthOfInterval({ start, end: now }).map(m => {
        const ms = startOfMonth(m), me = endOfMonth(m);
        const mTx = filtered.filter(t => { const d = new Date(t.date); return d >= ms && d <= me; });
        const income  = mTx.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
        const expense = mTx.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
        return { label: format(m, "MMM yy"), income, expense, net: income - expense };
      });
    }
    return eachDayOfInterval({ start, end: now }).map(d => {
      const ds  = format(d, "yyyy-MM-dd");
      const dTx = filtered.filter(t => format(new Date(t.date), "yyyy-MM-dd") === ds);
      const income  = dTx.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      const expense = dTx.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      return { label: format(d, "MMM d"), income, expense, net: income - expense };
    });
  }, [filtered, range]);

  // ── Running balance ────────────────────────────────────────────────────────
  const runningBalance = useMemo(() => {
    const balance = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0);
    const sorted  = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    const points  = sorted.reduce((acc, t) => {
      const prev = acc.length ? acc[acc.length - 1].balance : balance;
      acc.push({ label: format(new Date(t.date), "MMM d"), balance: parseFloat((t.type === "INCOME" ? prev - t.amount : prev + t.amount).toFixed(2)) });
      return acc;
    }, []);
    return [{ label: "Now", balance }, ...points].reverse().slice(-30);
  }, [filtered, accounts]);

  // ── Category breakdown ────────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    const m = {};
    filtered.filter(t => t.type === "EXPENSE").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  // ── Monthly 6M comparison ─────────────────────────────────────────────────
  const monthlyComparison = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const m = subMonths(new Date(), 5 - i);
      const ms = startOfMonth(m), me = endOfMonth(m);
      const mTx = transactions.filter(t => {
        const d = new Date(t.date);
        return (accountFilter === "ALL" || t.accountId === accountFilter) && d >= ms && d <= me;
      });
      const income  = mTx.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      const expense = mTx.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      return { label: format(m, "MMM"), income, expense, net: income - expense };
    }),
  [transactions, accountFilter]);

  // ── Radar data ────────────────────────────────────────────────────────────
  const radarData = useMemo(() => {
    const TOP_CATS = ["housing", "food", "transportation", "entertainment", "shopping", "healthcare"];
    const now = new Date();
    const thisMs = startOfMonth(now);
    const lastMs = startOfMonth(subMonths(now, 1));
    const lastMe = endOfMonth(subMonths(now, 1));
    const inAcc  = t => accountFilter === "ALL" || t.accountId === accountFilter;

    const thisM = transactions.filter(t => inAcc(t) && t.type === "EXPENSE" && new Date(t.date) >= thisMs);
    const lastM = transactions.filter(t => { const d = new Date(t.date); return inAcc(t) && t.type === "EXPENSE" && d >= lastMs && d <= lastMe; });

    return TOP_CATS.map(cat => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      "This Month": thisM.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0),
      "Last Month": lastM.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0),
    }));
  }, [transactions, accountFilter]);

  // ── Misc derived ──────────────────────────────────────────────────────────
  const topExpenses = useMemo(() =>
    [...filtered].filter(t => t.type === "EXPENSE").sort((a, b) => b.amount - a.amount).slice(0, 5),
  [filtered]);

  const dailyAvgExpense = useMemo(() => {
    const start = getRangeStart(range) || subMonths(new Date(), 12);
    const days  = Math.max(differenceInDays(new Date(), start), 1);
    return filtered.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0) / days;
  }, [filtered, range]);

  const incomeSources = useMemo(() => {
    const m = {};
    filtered.filter(t => t.type === "INCOME").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const recurringTx = useMemo(() => filtered.filter(t => t.isRecurring), [filtered]);

  const budgetPercent = budgetData?.budget
    ? Math.min((budgetData.currentExpenses / budgetData.budget.amount) * 100, 100)
    : null;

  // ── Axis formatters (stable) ───────────────────────────────────────────────
  const yFmtK   = v => fmtK(v);
  const yFmt$k  = v => `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`;

  const SECTIONS = [
    { id: "overview",   label: "Overview",    icon: BarChart3 },
    { id: "cashflow",   label: "Cash Flow",   icon: Activity },
    { id: "spending",   label: "Spending",    icon: PieIcon },
    { id: "trends",     label: "Trends",      icon: TrendingUp },
    { id: "insights",   label: "Insights",    icon: Zap },
  ];

  const xAxisProps = { axisLine: false, tickLine: false, tick: { fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "var(--font-poppins)" }, interval: "preserveStartEnd" };
  const yAxisProps = { axisLine: false, tickLine: false, tick: { fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "var(--font-poppins)" } };
  const gridProps  = { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.04)", vertical: false };
  const legendStyle = { fontSize: 11, fontFamily: "var(--font-poppins)", color: "rgba(255,255,255,0.5)" };

  return (
    <div className="min-h-screen text-white" style={{ background: C.bg }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[15%] w-[700px] h-[700px] rounded-full blur-[200px] opacity-[0.035]" style={{ background: C.blue }} />
        <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.03]"  style={{ background: C.purple }} />
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: `linear-gradient(${C.blue}40 1px, transparent 1px), linear-gradient(90deg, ${C.blue}40 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: `${C.blue}15`, border: `1px solid ${C.blue}25` }}>
              <Activity className="w-3 h-3" style={{ color: C.blue }} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-montserrat" style={{ color: C.blue }}>Advanced Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat leading-tight">
              Financial{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.purple})` }}>Intelligence</span>
            </h1>
            <p className="text-sm text-white/35 font-poppins mt-2">
              {transactions.length.toLocaleString()} transactions · {accounts.length} accounts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* ✅ Custom dropdown — no browser select */}
            <AccountFilter accounts={accounts} value={accountFilter} onChange={setAccountFilter} />

            {/* Range pills */}
            <div className="flex gap-1 p-1 rounded-xl border" style={{ background: C.card, borderColor: C.border }}>
              {RANGE_OPTIONS.map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-bold font-montserrat transition-all duration-200",
                    range === r ? "" : "text-white/40 hover:text-white/70")}
                  style={range === r ? { background: `${C.blue}25`, border: `1px solid ${C.blue}35`, color: C.blue } : {}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section nav ── */}
        <div className="flex gap-1 p-1 rounded-2xl border mb-8 overflow-x-auto" style={{ background: C.card, borderColor: C.border }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 font-poppins",
                activeSection === s.id ? "" : "text-white/40 hover:text-white/65")}
              style={activeSection === s.id ? { background: `${C.blue}18`, border: `1px solid ${C.blue}28`, color: C.blue } : {}}>
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* ══════════ OVERVIEW ══════════ */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Total Income"    value={fmtK(kpis.income)}  sub="in selected range" icon={TrendingUp}   accent={C.emerald} trend={kpis.incomeTrend}  trendLabel="vs prev period" />
              <KpiCard label="Total Expenses"  value={fmtK(kpis.expense)} sub="in selected range" icon={TrendingDown} accent={C.red}     trend={-kpis.expenseTrend} trendLabel="vs prev period" />
              <KpiCard label="Net Cash Flow"   value={`${kpis.net >= 0 ? "+" : ""}${fmtK(kpis.net)}`} sub="income − expenses" icon={Activity} accent={kpis.net >= 0 ? C.blue : C.red} trend={kpis.netTrend} trendLabel="vs prev period" />
              <KpiCard label="Savings Rate"    value={fmtPct(kpis.savings)} sub="of income saved" icon={Target} accent={C.purple}
                badge={kpis.savings >= 20 ? "Excellent" : kpis.savings >= 10 ? "Good" : "Low"} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Portfolio Balance" value={fmtK(kpis.totalBalance)}  sub={`${accounts.length} accounts`}     icon={CreditCard} accent={C.teal} />
              <KpiCard label="Avg. Transaction"  value={fmt$(kpis.avgTxAmount)}   sub={`${filtered.length} total`}        icon={DollarSign} accent={C.amber} />
              <KpiCard label="Daily Avg. Spend"  value={fmt$(dailyAvgExpense)}    sub="per day"                           icon={Calendar}   accent={C.pink} />
              <KpiCard label="Recurring Total"   value={fmtK(recurringTx.reduce((s, t) => s + t.amount, 0))} sub={`${recurringTx.length} transactions`} icon={Clock} accent={C.indigo} />
            </div>

            {budgetData?.budget && (
              <ChartCard>
                <SectionHeader title="Monthly Budget Status" subtitle="Default account" icon={Target} accent={C.amber} />
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-white/50 font-poppins">{fmt$(budgetData.currentExpenses)} spent</span>
                  <span className={cn("font-extrabold font-montserrat", budgetPercent >= 90 ? "text-red-400" : budgetPercent >= 75 ? "text-amber-400" : "text-emerald-400")}>
                    {budgetPercent?.toFixed(1)}% used
                  </span>
                  <span className="text-white/50 font-poppins">of {fmt$(budgetData.budget.amount)}</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{
                    width: `${budgetPercent}%`,
                    background: budgetPercent >= 90 ? `linear-gradient(90deg, ${C.red}, #ff6b6b)` : budgetPercent >= 75 ? `linear-gradient(90deg, ${C.amber}, #fbbf24)` : `linear-gradient(90deg, ${C.emerald}, #34d399)`,
                  }} />
                </div>
                <div className="mt-3">
                  {budgetPercent >= 90
                    ? <div className="flex items-center gap-1.5 text-xs text-red-400 font-poppins"><AlertTriangle className="w-3 h-3" />Budget critically low</div>
                    : budgetPercent >= 75
                    ? <div className="flex items-center gap-1.5 text-xs text-amber-400 font-poppins"><AlertTriangle className="w-3 h-3" />Approaching limit</div>
                    : <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-poppins"><CheckCircle className="w-3 h-3" />On track</div>}
                </div>
              </ChartCard>
            )}

            <ChartCard>
              <SectionHeader title="Income vs Expense Over Time" subtitle={`${range} view`} icon={BarChart3} />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.emerald} stopOpacity={0.3} /><stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.red} stopOpacity={0.3} /><stop offset="100%" stopColor={C.red} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="label" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={yFmt$k} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 16, ...legendStyle }} />
                    <Area type="monotone" dataKey="income"  stroke={C.emerald} strokeWidth={2} fill="url(#incGrad)" name="Income" />
                    <Area type="monotone" dataKey="expense" stroke={C.red}     strokeWidth={2} fill="url(#expGrad)" name="Expense" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}

        {/* ══════════ CASH FLOW ══════════ */}
        {activeSection === "cashflow" && (
          <div className="space-y-6">
            <ChartCard>
              <SectionHeader title="Running Balance" subtitle="Last 30 data points" icon={Activity} accent={C.blue} />
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={runningBalance}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.blue} stopOpacity={0.25} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="label" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={yFmtK} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="balance" stroke={C.blue} strokeWidth={2.5} fill="url(#balGrad)" name="Balance" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard>
              <SectionHeader title="Net Cash Flow by Period" subtitle="Income minus expense" icon={BarChart3} accent={C.purple} />
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="label" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={yFmtK} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={legendStyle} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                    <Bar dataKey="income"  fill={C.emerald} radius={[3,3,0,0]} opacity={0.8} name="Income" />
                    <Bar dataKey="expense" fill={C.red}     radius={[3,3,0,0]} opacity={0.8} name="Expense" />
                    <Line type="monotone" dataKey="net" stroke={C.blue} strokeWidth={2.5} dot={false} name="Net" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard>
              <SectionHeader title="6-Month Comparison" subtitle="Monthly overview" icon={Calendar} accent={C.teal} />
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparison} barGap={4}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="label" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={yFmtK} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={legendStyle} />
                    <Bar dataKey="income"  fill={C.emerald} radius={[4,4,0,0]} name="Income" />
                    <Bar dataKey="expense" fill={C.red}     radius={[4,4,0,0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}

        {/* ══════════ SPENDING ══════════ */}
        {activeSection === "spending" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard>
                <SectionHeader title="Expense Breakdown" subtitle="By category" icon={PieIcon} accent={C.red} />
                {categoryData.length > 0 ? (
                  <>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                            {categoryData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="transparent" />)}
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
                ) : <div className="h-[220px] flex items-center justify-center text-white/20 font-poppins text-sm">No expense data</div>}
              </ChartCard>

              <ChartCard>
                <SectionHeader title="Income Sources" subtitle="By category" icon={TrendingUp} accent={C.emerald} />
                {incomeSources.length > 0 ? (
                  <>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={incomeSources} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                            {incomeSources.map((_, i) => <Cell key={i} fill={[C.emerald, C.teal, C.blue, C.indigo][i % 4]} stroke="transparent" />)}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      {incomeSources.slice(0, 4).map((d, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: [C.emerald, C.teal, C.blue, C.indigo][i % 4] }} />
                            <span className="text-[11px] text-white/50 font-poppins truncate capitalize">{d.name}</span>
                          </div>
                          <span className="text-[11px] font-bold font-montserrat text-white/70 flex-shrink-0">{fmt$(d.value, 0)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <div className="h-[220px] flex items-center justify-center text-white/20 font-poppins text-sm">No income data</div>}
              </ChartCard>
            </div>

            <ChartCard>
              <SectionHeader title="Top Spending Categories" subtitle="Ranked by amount" icon={Layers} accent={C.amber} />
              <div className="space-y-3">
                {categoryData.slice(0, 8).map((d, i) => {
                  const pct = categoryData[0]?.value ? (d.value / categoryData[0].value) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-white/50 font-poppins capitalize w-24 flex-shrink-0 truncate">{d.name}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${PALETTE[i % PALETTE.length]}, ${PALETTE[(i + 1) % PALETTE.length]})` }} />
                      </div>
                      <span className="text-xs font-bold font-montserrat text-white/70 w-20 text-right flex-shrink-0">{fmt$(d.value, 0)}</span>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard>
              <SectionHeader title="Top Expenses" subtitle="Highest single transactions" icon={ArrowDownRight} accent={C.red} />
              <div className="space-y-2">
                {topExpenses.length === 0
                  ? <p className="text-sm text-white/25 font-poppins py-6 text-center">No expense data</p>
                  : topExpenses.map((tx, i) => (
                    <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                      <span className="text-[11px] font-bold font-montserrat w-4 flex-shrink-0 text-white/20">{i + 1}</span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${PALETTE[i % PALETTE.length]}20`, color: PALETTE[i % PALETTE.length] }}>
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white font-poppins truncate">{tx.description || "Untitled"}</p>
                        <p className="text-[10px] text-white/30 font-poppins capitalize">{tx.category} · {format(new Date(tx.date), "MMM d, yyyy")}</p>
                      </div>
                      <span className="text-sm font-extrabold font-montserrat text-red-400 flex-shrink-0">−{fmt$(tx.amount)}</span>
                    </div>
                  ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* ══════════ TRENDS ══════════ */}
        {activeSection === "trends" && (
          <div className="space-y-6">
            <ChartCard>
              <SectionHeader title="Spending Pattern — This vs Last Month" subtitle="By category" icon={Activity} accent={C.purple} />
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "var(--font-poppins)" }} />
                    <Radar name="This Month" dataKey="This Month" stroke={C.blue}   fill={C.blue}   fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Last Month" dataKey="Last Month" stroke={C.purple} fill={C.purple} fillOpacity={0.1}  strokeWidth={2} strokeDasharray="4 4" />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={legendStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard>
              <SectionHeader title="Cumulative Income vs Expense" subtitle="Running total over time" icon={TrendingUp} accent={C.teal} />
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData.reduce((acc, d) => {
                    const prev = acc[acc.length - 1] || { cumIncome: 0, cumExpense: 0 };
                    acc.push({ label: d.label, cumIncome: prev.cumIncome + d.income, cumExpense: prev.cumExpense + d.expense });
                    return acc;
                  }, [])}>
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

            {accounts.length > 1 && (
              <ChartCard>
                <SectionHeader title="Account Balance Distribution" subtitle="Current balances" icon={CreditCard} accent={C.indigo} />
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={accounts.map(a => ({ name: a.name, balance: parseFloat(a.balance || 0) }))}>
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
        )}

        {/* ══════════ INSIGHTS ══════════ */}
        {activeSection === "insights" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { icon: kpis.savings >= 20 ? CheckCircle : AlertTriangle, color: kpis.savings >= 20 ? C.emerald : kpis.savings >= 10 ? C.amber : C.red, title: "Savings Rate",
                  body: kpis.savings >= 20 ? `Excellent! You're saving ${fmtPct(kpis.savings)} of income — above the recommended 20%.` : kpis.savings >= 10 ? `Savings rate is ${fmtPct(kpis.savings)}. Aim for 20% for stronger financial health.` : `Savings rate is only ${fmtPct(kpis.savings)}. Reduce expenses to improve this.` },
                { icon: kpis.net >= 0 ? TrendingUp : TrendingDown, color: kpis.net >= 0 ? C.blue : C.red, title: "Cash Flow",
                  body: kpis.net >= 0 ? `Positive flow of ${fmtK(kpis.net)}. You earned more than you spent this period.` : `Negative flow of ${fmtK(Math.abs(kpis.net))}. Spending exceeds income — review expenses.` },
                { icon: categoryData[0] ? AlertTriangle : CheckCircle, color: C.amber, title: "Top Spending Category",
                  body: categoryData[0] ? `"${categoryData[0].name}" is your largest expense at ${fmt$(categoryData[0].value)} (${fmtPct(categoryData[0].value / (kpis.expense || 1) * 100)} of total).` : "No expense data for this period." },
                { icon: dailyAvgExpense > 200 ? AlertTriangle : CheckCircle, color: dailyAvgExpense > 200 ? C.red : C.emerald, title: "Daily Spending Average",
                  body: `Average ${fmt$(dailyAvgExpense)} per day. ${dailyAvgExpense > 200 ? "Above average — consider reducing discretionary spending." : "Healthy daily spending rate."}` },
                { icon: recurringTx.length > 0 ? Clock : CheckCircle, color: C.indigo, title: "Recurring Transactions",
                  body: recurringTx.length > 0 ? `${recurringTx.length} recurring transaction(s) totaling ${fmtK(recurringTx.reduce((s, t) => s + t.amount, 0))}. Review them regularly.` : "No recurring transactions in this period." },
                { icon: accounts.length > 1 ? CheckCircle : Zap, color: C.teal, title: "Account Diversification",
                  body: accounts.length > 1 ? `${accounts.length} accounts totaling ${fmtK(kpis.totalBalance)}. Good diversification!` : "Consider opening a savings account to separate spending from savings." },
              ].map((ins, i) => (
                <div key={i} className="rounded-2xl p-5 border transition-all duration-300 hover:border-white/15"
                  style={{ background: C.card, borderColor: C.border }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${ins.color}18`, border: `1px solid ${ins.color}25`, color: ins.color }}>
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
                      const d = subDays(new Date(), (11 - week) * 7 + (6 - day));
                      const count = filtered.filter(t => format(new Date(t.date), "yyyy-MM-dd") === format(d, "yyyy-MM-dd")).length;
                      return (
                        <div key={`${week}-${day}`}
                          className="w-5 h-5 rounded-sm transition-all duration-200 hover:scale-125 cursor-default"
                          title={`${format(d, "MMM d")}: ${count} tx`}
                          style={{
                            background: count === 0 ? "rgba(255,255,255,0.04)" : `rgba(34,189,253,${0.15 + Math.min(count / 5, 1) * 0.75})`,
                            border: `1px solid rgba(255,255,255,${count === 0 ? 0.04 : 0.1})`,
                          }} />
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
                      {["Account", "Type", "Balance", "Transactions", "Avg. Tx", "Status"].map(h => (
                        <th key={h} className="text-left text-[10px] text-white/30 font-montserrat uppercase tracking-widest pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((a, i) => {
                      const aTx = transactions.filter(t => t.accountId === a.id);
                      const avg = aTx.length ? aTx.reduce((s, t) => s + t.amount, 0) / aTx.length : 0;
                      return (
                        <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold font-montserrat"
                                style={{ background: `${PALETTE[i % PALETTE.length]}20`, color: PALETTE[i % PALETTE.length] }}>
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
                            {a.isDefault
                              ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-montserrat" style={{ background: `${C.blue}20`, color: C.blue, border: `1px solid ${C.blue}30` }}>Default</span>
                              : <span className="text-[10px] text-white/25 font-poppins">Active</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
          <p className="text-xs text-white/20 font-poppins">
            {range === "ALL" ? "All time" : `Last ${range}`} · {filtered.length} transactions
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/20 font-poppins">
            <Zap className="w-3 h-3" style={{ color: C.blue }} />
            <span>Welth Analytics Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
}