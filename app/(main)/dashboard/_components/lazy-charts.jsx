"use client";
// app/dashboard/_components/lazy-charts.jsx
// Code-split heavy chart components

import dynamic from "next/dynamic";
import { SkeletonCard } from "./loading";

export const LazyMonthlyChart = dynamic(
  () => import("./monthly-chart").then((m) => m.MonthlyChart),
  { loading: () => <SkeletonCard />, ssr: false }
);

export const LazyDashboardOverview = dynamic(
  () => import("./transaction-overview").then((m) => m.DashboardOverview),
  { loading: () => <div className="grid gap-5 md:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>, ssr: false }
);
