// app/dashboard/layout.jsx

import { Suspense } from "react";
import Link from "next/link";
import { BarChart2, ArrowUpRight } from "lucide-react";
import { RouteChangeLoader } from "./_components/route-change-loader";
import { DashBarLoader } from "./loading";

export default function DashboardLayout({ children }) {
  return (
    <>
      <RouteChangeLoader />

      <div className="min-h-screen bg-slate-50 dark:bg-[hsl(222,22%,7%)]">
        <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-500 dark:text-violet-400 mb-1.5">
                Overview
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Dashboard
              </h1>
              <div className="mt-2.5 h-[3px] w-20 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />
            </div>

            <Link
              href="/advanced-analytics"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full self-start sm:self-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md hover:border-violet-400 dark:hover:border-violet-500 hover:-translate-y-0.5 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
            >
              <BarChart2 className="w-4 h-4" />
              View Analytics
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Page content */}
          <Suspense
            fallback={
              <div className="space-y-4">
                <DashBarLoader />
                <div className="h-32 rounded-2xl bg-white dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-700/50" />
              </div>
            }
          >
            {children}
          </Suspense>

        </div>
      </div>
    </>
  );
}
