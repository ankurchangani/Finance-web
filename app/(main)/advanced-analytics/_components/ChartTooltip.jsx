import { fmtK } from "./utils";

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[hsl(220,20%,11%)] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl min-w-[140px]">
      <p className="text-[10px] text-white/40 font-poppins mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
            <span className="text-xs text-white/60 font-poppins capitalize">{p.name}</span>
          </div>
          <span className="text-xs font-bold font-montserrat text-white">{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
