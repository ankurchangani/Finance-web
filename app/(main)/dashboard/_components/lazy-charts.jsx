"use client";

// ── Lazy-loaded chart components — use dynamic() to code-split ───────────────
// Import these in server components or page files like:
//   import { LazyMonthlyChart, LazyCategoryPieChart } from "./lazy-charts";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/skeleton-loaders";

// ── Monthly bar/area chart ───────────────────────────────────────────────────
export const LazyMonthlyChart = dynamic(
  () => import("./monthly-chart").then((m) => m.MonthlyChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

// ── Category pie chart ───────────────────────────────────────────────────────
export const LazyCategoryPieChart = dynamic(
  () => import("./category-pie-chart").then((m) => m.CategoryPieChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

// ── Account overview chart ───────────────────────────────────────────────────
export const LazyAccountChart = dynamic(
  () => import("./account-chart").then((m) => m.AccountChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

// ── Advanced analytics (very heavy) ─────────────────────────────────────────
export const LazyAdvancedAnalytics = dynamic(
  () => import("./advanced-analytics-client").then((m) => m.AdvancedAnalyticsClient),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);
