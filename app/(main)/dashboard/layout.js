import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import Link from "next/link";
import { BarChart2, ArrowUpRight } from "lucide-react";


export default function Layout() {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold tracking-tight gradient-title">
          Dashboard
        </h1>

        <Link
          href="/advanced-analytics"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full
            border border-purple-300/40 text-purple-900
            dark:border-purple-400/25 dark:text-purple-300
            text-sm font-medium
            hover:bg-purple-500/8 hover:border-purple-400/60
            dark:hover:bg-purple-400/10 dark:hover:border-purple-400/50
            transition-all duration-200 hover:-translate-y-px"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          View Analytics
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}