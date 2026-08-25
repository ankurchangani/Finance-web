"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, LayoutDashboard } from "lucide-react";

export default function MainRouteError({ error, reset }) {
  useEffect(() => {
    console.error("Main Route Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center my-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-100">Unable to load section</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            There was a temporary issue fetching data for this section.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 py-5 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button
              variant="outline"
              className="w-full py-5 rounded-xl font-semibold border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
