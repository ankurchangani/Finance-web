import { DashBarLoader } from "./loading";
import { Suspense } from "react";
import Link from "next/link";
import { BarChart2, ArrowUpRight } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight gradient-title">
            Dashboard
          </h1>

          {/* 👇 Loader sits right below "Dashboard" text */}
          <Suspense fallback={<DashBarLoader />}>
            {/* empty — just to trigger the bar on page load */}
            <span />
          </Suspense>
        </div>

        <Link
          href="/advanced-analytics"
          className="
            inline-flex items-center justify-center gap-1.5
            w-full sm:w-auto
            px-4 py-2 rounded-full
            border border-purple-300/40 text-purple-900
            dark:border-purple-400/25 dark:text-purple-300
            text-sm font-medium
            hover:bg-purple-500/8 hover:border-purple-400/60
            dark:hover:bg-purple-400/10 dark:hover:border-purple-400/50
            transition-all duration-200 hover:-translate-y-px
          "
        >
          <BarChart2 className="w-4 h-4" />
          View Analytics
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Page content ── */}
      <Suspense fallback={<DashBarLoader />}>
        {children}
      </Suspense>

    </div>
  );
}
