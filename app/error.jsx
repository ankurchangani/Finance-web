"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Route Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#080810] text-slate-100 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl shadow-black/80 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
            Something went wrong!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            An unexpected error occurred while processing your request. Don&apos;t worry, your data is completely safe.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-xs font-mono text-rose-300/90 break-words max-h-32 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 py-5 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button
              variant="outline"
              className="w-full py-5 rounded-xl font-semibold border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
