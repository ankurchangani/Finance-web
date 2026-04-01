import { fmt$, fmtPct } from "./utils";

export function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-[hsl(220,20%,11%)] border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-xs font-bold text-white font-montserrat capitalize">{entry.name}</p>
      <p className="text-sm font-extrabold font-montserrat" style={{ color: entry.payload.fill }}>
        {fmt$(entry.value)}
      </p>
      <p className="text-[10px] text-white/40 font-poppins">{fmtPct(entry.percent * 100)}</p>
    </div>
  );
}
