"use client";

import { fmtK } from "./utils";

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl px-4 py-3 shadow-2xl min-w-[140px]"
      style={{
        background: "hsl(220,22%,12%)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      {label && (
        <p className="text-[10px] text-white/40 font-poppins mb-2 uppercase tracking-widest">{label}</p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: p.color || p.stroke || p.fill }}
            />
            <span className="text-xs text-white/55 font-poppins capitalize">{p.name}</span>
          </div>
          <span className="text-xs font-bold font-montserrat text-white">
            {fmtK(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}