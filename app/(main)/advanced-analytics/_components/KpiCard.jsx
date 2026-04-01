import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { C } from "./utils";

export function KpiCard({ label, value, sub, icon: Icon, accent, trend, trendLabel, badge }) {
  return (
    <div
      className="relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:border-white/15"
      style={{ background: C.card, borderColor: C.border }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}10, transparent 60%)` }}
      />
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ background: `${accent}18`, borderColor: `${accent}30`, color: accent }}
          >
            <Icon className="w-4 h-4" />
          </div>
          {badge && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full font-montserrat tracking-wider"
              style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
            >
              {badge}
            </span>
          )}
        </div>

        <p className="text-[11px] text-white/40 font-poppins mb-1">{label}</p>
        <p className="text-2xl font-extrabold font-montserrat text-white mb-2">{value}</p>

        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <span className={cn(
              "flex items-center gap-0.5 text-[11px] font-bold font-montserrat",
              trend >= 0 ? "text-emerald-400" : "text-red-400",
            )}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend >= 0 ? "+" : "−"}{Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {sub && <p className="text-[10px] text-white/30 font-poppins">{sub}</p>}
        </div>
        {trendLabel && <p className="text-[10px] text-white/20 font-poppins mt-0.5">{trendLabel}</p>}
      </div>
    </div>
  );
}
