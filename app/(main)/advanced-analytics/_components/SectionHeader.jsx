"use client";

import { cn } from "@/lib/utils";
import { C } from "./utils";

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, icon: Icon, accent = C.blue }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}25`, color: accent }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white font-montserrat leading-none">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/35 font-poppins mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── ChartCard ────────────────────────────────────────────────────────────────
export function ChartCard({ children, className }) {
  return (
    <div
      className={cn("rounded-2xl p-5 border transition-all duration-300 hover:border-white/12", className)}
      style={{ background: C.card, borderColor: C.border }}
    >
      {children}
    </div>
  );
}