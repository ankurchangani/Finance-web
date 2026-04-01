import { useMemo } from "react";
import {
  format, subDays, subMonths,
  startOfMonth, endOfMonth,
  eachDayOfInterval, eachMonthOfInterval,
  differenceInDays,
} from "date-fns";
import { getRangeStart } from "./getRangeStart";
import { TOP_CATEGORIES } from "./utils";

// ─── Filter helper ────────────────────────────────────────────────────────────
const matchesAccount = (t, accountFilter) =>
  accountFilter === "ALL" || t.accountId === accountFilter;

// ─── Hook: filtered transactions ─────────────────────────────────────────────
export function useFiltered(transactions, range, accountFilter) {
  return useMemo(() => {
    const start = getRangeStart(range);
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return (start ? d >= start : true) && matchesAccount(t, accountFilter);
    });
  }, [transactions, range, accountFilter]);
}

// ─── Hook: KPI metrics ────────────────────────────────────────────────────────
export function useKpis(filtered, transactions, accounts, accountFilter, range) {
  return useMemo(() => {
    const income  = filtered.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    const net     = income - expense;
    const savings = income > 0 ? (net / income) * 100 : 0;
    const totalBalance = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0);
    const avgTxAmount  = filtered.length
      ? filtered.reduce((s, t) => s + t.amount, 0) / filtered.length
      : 0;

    // Previous period
    const start     = getRangeStart(range);
    const rangeDays = start ? differenceInDays(new Date(), start) : 365;
    const prevStart = subDays(start ?? subDays(new Date(), 365), rangeDays);
    const prevEnd   = start ? new Date(start.getTime() - 1) : subDays(new Date(), 365);

    const prev = transactions.filter((t) => {
      const d = new Date(t.date);
      return matchesAccount(t, accountFilter) && d >= prevStart && d <= prevEnd;
    });
    const pi = prev.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const pe = prev.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

    return {
      income, expense, net, savings, totalBalance, avgTxAmount,
      incomeTrend:  pi > 0 ? ((income  - pi) / pi)  * 100 : 0,
      expenseTrend: pe > 0 ? ((expense - pe) / pe)  * 100 : 0,
      netTrend:     pi > 0
        ? (((income - expense) - (pi - pe)) / Math.abs(pi - pe || 1)) * 100
        : 0,
    };
  }, [filtered, transactions, accounts, accountFilter, range]);
}

// ─── Hook: time series (daily or monthly) ────────────────────────────────────
export function useTimeSeries(filtered, range) {
  return useMemo(() => {
    const start      = getRangeStart(range) ?? subMonths(new Date(), 12);
    const now        = new Date();
    const useMonthly = differenceInDays(now, start) > 60;

    if (useMonthly) {
      return eachMonthOfInterval({ start, end: now }).map((m) => {
        const ms = startOfMonth(m), me = endOfMonth(m);
        const mTx     = filtered.filter((t) => { const d = new Date(t.date); return d >= ms && d <= me; });
        const income  = mTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
        const expense = mTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
        return { label: format(m, "MMM yy"), income, expense, net: income - expense };
      });
    }

    return eachDayOfInterval({ start, end: now }).map((d) => {
      const ds      = format(d, "yyyy-MM-dd");
      const dTx     = filtered.filter((t) => format(new Date(t.date), "yyyy-MM-dd") === ds);
      const income  = dTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      const expense = dTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      return { label: format(d, "MMM d"), income, expense, net: income - expense };
    });
  }, [filtered, range]);
}

// ─── Hook: cumulative income vs expense ──────────────────────────────────────
export function useCumulative(timeSeriesData) {
  return useMemo(() =>
    timeSeriesData.reduce((acc, d) => {
      const prev = acc[acc.length - 1] ?? { cumIncome: 0, cumExpense: 0 };
      acc.push({ label: d.label, cumIncome: prev.cumIncome + d.income, cumExpense: prev.cumExpense + d.expense });
      return acc;
    }, []),
  [timeSeriesData]);
}

// ─── Hook: running balance ────────────────────────────────────────────────────
export function useRunningBalance(filtered, accounts) {
  return useMemo(() => {
    const balance = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0);
    const sorted  = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    const points  = sorted.reduce((acc, t) => {
      const prev = acc.length ? acc[acc.length - 1].balance : balance;
      acc.push({
        label:   format(new Date(t.date), "MMM d"),
        balance: parseFloat((t.type === "INCOME" ? prev - t.amount : prev + t.amount).toFixed(2)),
      });
      return acc;
    }, []);
    return [{ label: "Now", balance }, ...points].reverse().slice(-30);
  }, [filtered, accounts]);
}

// ─── Hook: category breakdown ────────────────────────────────────────────────
export function useCategoryData(filtered) {
  return useMemo(() => {
    const m = {};
    filtered.filter((t) => t.type === "EXPENSE")
      .forEach((t) => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);
}

// ─── Hook: income sources ─────────────────────────────────────────────────────
export function useIncomeSources(filtered) {
  return useMemo(() => {
    const m = {};
    filtered.filter((t) => t.type === "INCOME")
      .forEach((t) => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);
}

// ─── Hook: 6-month comparison ─────────────────────────────────────────────────
export function useMonthlyComparison(transactions, accountFilter) {
  return useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const m   = subMonths(new Date(), 5 - i);
      const ms  = startOfMonth(m), me = endOfMonth(m);
      const mTx = transactions.filter((t) => {
        const d = new Date(t.date);
        return matchesAccount(t, accountFilter) && d >= ms && d <= me;
      });
      const income  = mTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      const expense = mTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      return { label: format(m, "MMM"), income, expense, net: income - expense };
    }),
  [transactions, accountFilter]);
}

// ─── Hook: radar data (this vs last month) ───────────────────────────────────
export function useRadarData(transactions, accountFilter) {
  return useMemo(() => {
    const now    = new Date();
    const thisMs = startOfMonth(now);
    const lastMs = startOfMonth(subMonths(now, 1));
    const lastMe = endOfMonth(subMonths(now, 1));

    const thisM = transactions.filter(
      (t) => matchesAccount(t, accountFilter) && t.type === "EXPENSE" && new Date(t.date) >= thisMs
    );
    const lastM = transactions.filter((t) => {
      const d = new Date(t.date);
      return matchesAccount(t, accountFilter) && t.type === "EXPENSE" && d >= lastMs && d <= lastMe;
    });

    return TOP_CATEGORIES.map((cat) => ({
      category:     cat.charAt(0).toUpperCase() + cat.slice(1),
      "This Month": thisM.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0),
      "Last Month": lastM.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0),
    }));
  }, [transactions, accountFilter]);
}

// ─── Hook: misc derived values ────────────────────────────────────────────────
export function useMiscDerived(filtered, range) {
  const topExpenses = useMemo(() =>
    [...filtered].filter((t) => t.type === "EXPENSE")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5),
  [filtered]);

  const dailyAvgExpense = useMemo(() => {
    const start = getRangeStart(range) ?? subMonths(new Date(), 12);
    const days  = Math.max(differenceInDays(new Date(), start), 1);
    return filtered.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0) / days;
  }, [filtered, range]);

  const recurringTx = useMemo(() => filtered.filter((t) => t.isRecurring), [filtered]);

  return { topExpenses, dailyAvgExpense, recurringTx };
}
