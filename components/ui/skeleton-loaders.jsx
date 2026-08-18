"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ── Generic Shimmer Skeleton ──────────────────────────────────────────────────
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/[0.06] border border-white/[0.04]",
        className
      )}
      {...props}
    />
  );
}

// ── Transaction Table Skeleton ────────────────────────────────────────────────
export function TransactionTableSkeleton() {
  return (
    <div className="w-full space-y-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl">
      {/* Header controls skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
        <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table headers */}
      <div className="hidden md:grid grid-cols-6 gap-4 py-3 px-4 bg-white/[0.02] rounded-xl border border-white/5">
        <Skeleton className="h-4 w-6 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-16 ml-auto rounded" />
      </div>

      {/* Table rows */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]"
          >
            <div className="hidden md:block">
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded md:hidden" />
            </div>
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-28 rounded" />
            <div className="flex items-center justify-between md:justify-end gap-3">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Account Card Skeleton ─────────────────────────────────────────────────────
export function AccountCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-8 w-40 rounded" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  );
}

// ── Stats Card Skeleton ───────────────────────────────────────────────────────
export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-32 rounded" />
          <Skeleton className="h-3 w-28 rounded" />
        </div>
      ))}
    </div>
  );
}

// ── Chart Skeleton ────────────────────────────────────────────────────────────
export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="h-64 w-full flex items-end gap-3 pt-6">
        {[40, 65, 30, 85, 55, 90, 45, 70, 60, 75, 50, 95].map((h, i) => (
          <div key={i} className="flex-1 space-y-2 flex flex-col justify-end h-full">
            <Skeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full Page Dashboard Skeleton ──────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto pt-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      <StatsCardSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ChartSkeleton />
          <TransactionTableSkeleton />
        </div>
        <div className="space-y-6">
          <AccountCardSkeleton />
          <AccountCardSkeleton />
        </div>
      </div>
    </div>
  );
}
