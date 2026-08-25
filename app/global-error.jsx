"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Layout Error caught by boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#080810] text-slate-100 min-h-screen flex items-center justify-center p-6 antialiased">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl shadow-black text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Critical System Error
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical error occurred while loading the application shell.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
