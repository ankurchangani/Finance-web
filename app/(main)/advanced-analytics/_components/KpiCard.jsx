"use client";
// app/dashboard/analytics/_components/KpiCard.jsx

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { C } from "./utils";

/**
 * @param {object}  props
 * @param {string}  props.label
 * @param {string}  props.value
 * @param {string}  [props.sub]
 * @param {React.ElementType} props.icon
 * @param {string}  props.accent
 * @param {number}  [props.trend]
 * @param {string}  [props.trendLabel]
 * @param {string}  [props.badge]
 * @param {number}  [props.delay=0]   animation-delay in seconds for stagger
 */
export function KpiCard({ label, value, sub, icon: Icon, accent, trend, trendLabel, badge, delay = 0 }) {
  return (
    <>
      <style>{`
        @keyframes kpi-in {
          from { opacity:0; transform:translateY(20px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes kpi-shimmer {
          0%   { transform:translateX(-100%) skewX(-15deg); }
          100% { transform:translateX(400%)  skewX(-15deg); }
        }
      `}</style>

      <div
        className="relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-2xl"
        style={{
          background: C.card,
          borderColor: C.border,
          animation: `kpi-in .65s cubic-bezier(.22,1,.36,1) ${delay}s both`,
        }}
      >
        {/* Hover radial glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${accent}14, transparent 65%)` }}
        />

        {/* Top edge highlight on hover */}
        <div
          className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        {/* Shimmer sweep on hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 overflow-hidden"
          style={{ transition: "opacity .4s" }}
        >
          <div
            className="absolute inset-y-0 w-1/4"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}0a, transparent)`,
              animation: "kpi-shimmer 1.2s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Icon + badge row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
              style={{
                background: `${accent}18`,
                borderColor: `${accent}30`,
                color: accent,
                boxShadow: `0 0 0 0 ${accent}40`,
                transition: "box-shadow .3s ease, transform .3s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = `0 0 14px 2px ${accent}40`; }}
              onMouseOut={(e)  => { e.currentTarget.style.boxShadow = `0 0 0 0 ${accent}40`; }}
            >
              <Icon className="w-4 h-4" />
            </div>

            {badge && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full font-montserrat tracking-wider"
                style={{
                  background: `${accent}20`,
                  color: accent,
                  border: `1px solid ${accent}30`,
                }}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-[11px] text-white/40 font-poppins mb-1 tracking-wide">{label}</p>

          {/* Value */}
          <p
            className="text-2xl font-extrabold font-montserrat text-white mb-2 transition-all duration-300"
            style={{ letterSpacing: "-0.02em" }}
          >
            {value}
          </p>

          {/* Trend + sub */}
          <div className="flex items-center gap-2 flex-wrap">
            {trend !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[11px] font-bold font-montserrat",
                  trend >= 0 ? "text-emerald-400" : "text-red-400",
                )}
              >
                {trend >= 0
                  ? <TrendingUp  className="w-3 h-3" />
                  : <TrendingDown className="w-3 h-3" />
                }
                {trend >= 0 ? "+" : "−"}{Math.abs(trend).toFixed(1)}%
              </span>
            )}
            {sub && (
              <p className="text-[10px] text-white/30 font-poppins">{sub}</p>
            )}
          </div>

          {trendLabel && (
            <p className="text-[10px] text-white/18 font-poppins mt-0.5">{trendLabel}</p>
          )}
        </div>
      </div>
    </>
  );
}
