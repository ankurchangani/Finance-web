"use client";

import React, { useEffect, useState } from "react";

export function SitePreloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Start fast smooth progress sequence on mount/refresh
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          setTimeout(() => {
            setIsLoaded(true);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  if (isLoaded) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#080810]/95 backdrop-blur-2xl transition-all duration-500 ease-out select-none ${
        isDone ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm w-full space-y-6">
        {/* Brand Icon with Glowing Ring & OK Badge */}
        <div className="relative flex items-center justify-center">
          {/* Glowing Aura */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 blur-md animate-pulse" />

          <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-center shadow-2xl transition-transform duration-300">
            {isDone ? (
              /* OK Checkmark when finished */
              <div className="flex items-center justify-center animate-in zoom-in-75 duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ) : (
              /* Logo Icon */
              <svg width="42" height="42" viewBox="0 0 18 18" fill="none" className="animate-pulse">
                <path
                  d="M3 14L9 4L15 14"
                  stroke="#22BDFD"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5.5 10H12.5" stroke="#22BDFD" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1
            className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Finovexa
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {isDone ? "System OK — Ready" : "Loading Platform..."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-52 space-y-2">
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-150 ease-out bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(34,189,253,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-1">
            <span className="font-semibold text-slate-300">{isDone ? "OK" : "Loading"}</span>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
