"use client";
// app/dashboard/analytics/_components/SpendingSection.jsx
// 3D SVG Pie Charts — no Recharts, pure math + SVG

import { useState } from "react";
import { PieChart as PieIcon, TrendingDown, TrendingUp, Zap, DollarSign } from "lucide-react";
import { C, PALETTE, INCOME_COLORS, fmt$, fmtPct } from "./utils";
import { SectionHeader, ChartCard } from "./SectionHeader";

// ══════════════════════════════════════════════════════════════════════════════
//  3D PIE MATH
// ══════════════════════════════════════════════════════════════════════════════

/** Convert "clock-angle" degrees (0 = top, clockwise) → SVG radians */
const toRad = (deg) => ((deg - 90) * Math.PI) / 180;

/** Point on an ellipse at clock-angle `a` */
const pt = (cx, cy, rx, ry, a) => ({
  x: cx + rx * Math.cos(toRad(a)),
  y: cy + ry * Math.sin(toRad(a)),
});

/** Darken a #rrggbb hex by `amt` (0-255) → rgb() string */
function darken(hex, amt = 45) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgb(${Math.max(0,(n>>16)-amt)},${Math.max(0,((n>>8)&255)-amt)},${Math.max(0,(n&255)-amt)})`;
}

/** Top face of a solid slice (cx,cy → outer arc) */
function solidTopPath(cx, cy, rx, ry, s, e) {
  const p1 = pt(cx, cy, rx, ry, s), p2 = pt(cx, cy, rx, ry, e);
  const lg = e - s > 180 ? 1 : 0;
  return `M${cx},${cy} L${p1.x},${p1.y} A${rx},${ry} 0 ${lg} 1 ${p2.x},${p2.y} Z`;
}

/** Top face of a donut slice (outer arc → inner arc, reversed) */
function donutTopPath(cx, cy, rx, ry, irx, iry, s, e) {
  const po1 = pt(cx, cy, rx,  ry,  s), po2 = pt(cx, cy, rx,  ry,  e);
  const pi1 = pt(cx, cy, irx, iry, s), pi2 = pt(cx, cy, irx, iry, e);
  const lg = e - s > 180 ? 1 : 0;
  return (
    `M${po1.x},${po1.y} A${rx},${ry} 0 ${lg} 1 ${po2.x},${po2.y} ` +
    `L${pi2.x},${pi2.y} A${irx},${iry} 0 ${lg} 0 ${pi1.x},${pi1.y} Z`
  );
}

/** Visible outer rim: clips to front-facing arc [90°, 270°] */
function outerRimPath(cx, cy, rx, ry, s, e, depth) {
  const cs = Math.max(s, 90), ce = Math.min(e, 270);
  if (cs >= ce) return null;
  const p1 = pt(cx, cy, rx, ry, cs), p2 = pt(cx, cy, rx, ry, ce);
  const lg = ce - cs > 180 ? 1 : 0;
  return (
    `M${p1.x},${p1.y} A${rx},${ry} 0 ${lg} 1 ${p2.x},${p2.y} ` +
    `L${p2.x},${p2.y + depth} A${rx},${ry} 0 ${lg} 0 ${p1.x},${p1.y + depth} Z`
  );
}

/** Visible inner rim (donut hole wall, front arc, reversed direction) */
function innerRimPath(cx, cy, irx, iry, s, e, depth) {
  const cs = Math.max(s, 90), ce = Math.min(e, 270);
  if (cs >= ce) return null;
  const p1 = pt(cx, cy, irx, iry, cs), p2 = pt(cx, cy, irx, iry, ce);
  const lg = ce - cs > 180 ? 1 : 0;
  return (
    `M${p1.x},${p1.y} A${irx},${iry} 0 ${lg} 1 ${p2.x},${p2.y} ` +
    `L${p2.x},${p2.y + depth} A${irx},${iry} 0 ${lg} 0 ${p1.x},${p1.y + depth} Z`
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  Shared Tooltip overlay
// ══════════════════════════════════════════════════════════════════════════════
function SliceTooltip({ slice, total }) {
  if (!slice) return null;
  return (
    <div
      className="absolute top-2 right-2 z-20 pointer-events-none"
      style={{
        background: "hsl(220,20%,10%)",
        border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 14,
        padding: "10px 14px",
        minWidth: 140,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
        animation: "sp-tipFade .18s ease",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: slice.fill }} />
        <span className="text-[11px] font-semibold text-white/60 font-poppins capitalize">{slice.name}</span>
      </div>
      <p className="text-xl font-extrabold font-montserrat" style={{ color: slice.fill }}>
        {fmt$(slice.value)}
      </p>
      <p className="text-[10px] text-white/30 font-poppins mt-0.5">
        {fmtPct((slice.value / total) * 100)} of total
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  3D Pie / Donut SVG Component
// ══════════════════════════════════════════════════════════════════════════════
function Pie3D({
  data,
  palette,
  cx = 165, cy = 95,
  rx = 128, ry = 44,
  depth = 20,
  holeRatio = 0,        // 0 = solid pie, >0 = donut (e.g. 0.38)
  centerLabel = null,   // JSX rendered in donut centre (text only supported via SVG)
}) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [tooltip,   setTooltip]   = useState(null);

  const total  = data?.reduce((s, d) => s + d.value, 0) || 0;
  const irx    = rx * holeRatio;
  const iry    = ry * holeRatio;

  if (!data?.length || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-30">
        <PieIcon className="w-8 h-8 mb-2" />
        <span className="text-xs font-poppins text-white/40">No data</span>
      </div>
    );
  }

  /* Build slices */
  let cum = 0;
  const slices = data.map((d, i) => {
    const start = cum;
    const span  = (d.value / total) * 360;
    const end   = start + span;
    cum = end;
    return { ...d, start, end, mid: (start + end) / 2, i, fill: palette[i % palette.length] };
  });

  /* Painter's algorithm: back → front */
  const sorted = [...slices].sort((a, b) => {
    const ya = cy + ry * Math.sin(toRad(a.mid));
    const yb = cy + ry * Math.sin(toRad(b.mid));
    return ya - yb;
  });

  const vbH = cy * 2 + depth + 22;

  return (
    <div className="relative h-full">
      <SliceTooltip slice={tooltip} total={total} />
      <svg
        viewBox={`0 0 330 ${vbH}`}
        width="100%" height="100%"
        overflow="visible"
        style={{ display: "block" }}
      >
        <defs>
          {slices.map((s) => (
            <radialGradient key={s.i} id={`pie3d_g_${s.i}`} cx="38%" cy="32%" r="68%">
              <stop offset="0%"   stopColor={s.fill} />
              <stop offset="100%" stopColor={darken(s.fill, 26)} />
            </radialGradient>
          ))}
          <radialGradient id="pie3d_shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.32)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Drop shadow ellipse */}
        <ellipse cx={cx} cy={cy + depth + 10} rx={rx - 8} ry={ry - 4}
          fill="url(#pie3d_shadow)" />

        {/* ── Outer rim walls (back → front) ── */}
        {sorted.map((s) => {
          const rim = outerRimPath(cx, cy, rx, ry, s.start, s.end, depth);
          if (!rim) return null;
          const isA = activeIdx === s.i;
          return (
            <path key={`rim-${s.i}`} d={rim}
              fill={darken(s.fill, 42)}
              opacity={activeIdx !== null && !isA ? 0.32 : 1}
              onMouseEnter={() => { setActiveIdx(s.i); setTooltip(s); }}
              onMouseLeave={() => { setActiveIdx(null); setTooltip(null); }}
              style={{ cursor: "pointer" }}
            />
          );
        })}

        {/* ── Inner donut rim walls ── */}
        {holeRatio > 0 && sorted.map((s) => {
          const rim = innerRimPath(cx, cy, irx, iry, s.start, s.end, depth);
          if (!rim) return null;
          const isA = activeIdx === s.i;
          return (
            <path key={`irim-${s.i}`} d={rim}
              fill={darken(s.fill, 58)}
              opacity={activeIdx !== null && !isA ? 0.3 : 0.75}
            />
          );
        })}

        {/* ── Top faces (back → front) ── */}
        {sorted.map((s) => {
          const isA   = activeIdx === s.i;
          const off   = isA ? 6 : 0;
          const ox    = Math.cos(toRad(s.mid)) * off;
          const oy    = Math.sin(toRad(s.mid)) * off;
          const pct   = ((s.end - s.start) / 360) * 100;
          const labR  = holeRatio > 0 ? (rx + irx) / 2 : rx * 0.62;
          const lx    = cx + labR * Math.cos(toRad(s.mid));
          const ly    = cy + (holeRatio > 0 ? (ry + iry) / 2 : ry * 0.62) * Math.sin(toRad(s.mid));

          const topD = holeRatio > 0
            ? donutTopPath(cx, cy, rx, ry, irx, iry, s.start, s.end)
            : solidTopPath(cx, cy, rx, ry, s.start, s.end);

          return (
            <g key={`top-${s.i}`}
              transform={`translate(${ox},${oy})`}
              onMouseEnter={() => { setActiveIdx(s.i); setTooltip(s); }}
              onMouseLeave={() => { setActiveIdx(null); setTooltip(null); }}
              style={{ cursor: "pointer" }}
            >
              <path d={topD}
                fill={`url(#pie3d_g_${s.i})`}
                opacity={activeIdx !== null && !isA ? 0.42 : 1}
                stroke={isA ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)"}
                strokeWidth={isA ? 1.5 : 0.5}
                style={{
                  filter: isA ? `drop-shadow(0 0 14px ${s.fill}95)` : undefined,
                  transition: "filter .2s ease, opacity .2s ease",
                }}
              />
              {pct >= 5 && (
                <text
                  x={lx} y={ly}
                  fill="white" textAnchor="middle" dominantBaseline="central"
                  fontSize={9} fontWeight={800}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {pct.toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}

        {/* ── Donut hole cap ── */}
        {holeRatio > 0 && (
          <>
            <ellipse cx={cx} cy={cy} rx={irx} ry={iry}
              fill="hsl(220,20%,8%)"
              stroke="rgba(255,255,255,0.06)" strokeWidth={0.6} />
            {centerLabel && (
              <text x={cx} y={cy}
                fill="rgba(255,255,255,0.6)" textAnchor="middle" dominantBaseline="central"
                fontSize={10} fontWeight={700}
                style={{ pointerEvents: "none", fontFamily: "var(--font-montserrat)" }}>
                {centerLabel}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  Mini bar-legend
// ══════════════════════════════════════════════════════════════════════════════
function BarLegend({ data, palette }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col gap-1.5 mt-3 px-1">
      {data.slice(0, 7).map((d, i) => {
        const color = palette[i % palette.length];
        const pct   = total ? (d.value / total) * 100 : 0;
        return (
          <div key={i} className="group flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-sm flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
              style={{ background: color }} />
            <span className="text-[11px] font-poppins text-white/45 capitalize truncate flex-1 group-hover:text-white/80 transition-colors">
              {d.name.toLowerCase()}
            </span>
            {/* progress bar */}
            <div className="w-20 h-1 rounded-full overflow-hidden flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full"
                style={{
                  width: `${pct}%`, background: color,
                  transition: "width .8s cubic-bezier(0.4,0,0.2,1)",
                }} />
            </div>
            <span className="text-[11px] font-bold font-montserrat text-white/60 flex-shrink-0 w-14 text-right">
              {fmt$(d.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SpendingSection
// ══════════════════════════════════════════════════════════════════════════════
export function SpendingSection({ categoryData, incomeSources, topExpenses }) {
  const totalExpense = categoryData.reduce((s, d) => s + d.value, 0);
  const totalIncome  = incomeSources.reduce((s, d) => s + d.value, 0);
  const maxTop       = topExpenses?.[0]?.amount || 1;

  return (
    <>
      <style>{`
        @keyframes sp-slideUp  { from{opacity:0;transform:translateY(26px);} to{opacity:1;transform:translateY(0);} }
        @keyframes sp-tipFade  { from{opacity:0;transform:scale(0.95);}      to{opacity:1;transform:scale(1);}     }
        @keyframes sp-barGrow  { from{width:0;} }
        .sp-c1 { animation: sp-slideUp .6s ease both;        }
        .sp-c2 { animation: sp-slideUp .6s ease .12s both;   }
        .sp-c3 { animation: sp-slideUp .6s ease .24s both;   }
        .sp-c4 { animation: sp-slideUp .6s ease .36s both;   }
        .sp-bar{ animation: sp-barGrow .9s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <div className="space-y-6">

        {/* ── Row 1: Two 3D Pies ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Expense Breakdown — solid 3D pie */}
          <div className="sp-c1">
            <ChartCard>
              <SectionHeader
                title="Expense Breakdown"
                subtitle={`Total: ${fmt$(totalExpense)}`}
                icon={TrendingDown}
                accent={C.red}
              />
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[220px] text-white/20">
                  <PieIcon className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm font-poppins">No expenses in this period</p>
                </div>
              ) : (
                <>
                  <div className="h-[200px]">
                    <Pie3D
                      data={categoryData}
                      palette={PALETTE}
                      cx={165} cy={88} rx={126} ry={43} depth={20}
                    />
                  </div>
                  <BarLegend data={categoryData} palette={PALETTE} />
                </>
              )}
            </ChartCard>
          </div>

          {/* Income Sources — 3D donut */}
          <div className="sp-c2">
            <ChartCard>
              <SectionHeader
                title="Income Sources"
                subtitle={`Total: ${fmt$(totalIncome)}`}
                icon={TrendingUp}
                accent={C.emerald}
              />
              {incomeSources.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[220px] text-white/20">
                  <DollarSign className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm font-poppins">No income in this period</p>
                </div>
              ) : (
                <>
                  <div className="h-[200px]">
                    <Pie3D
                      data={incomeSources}
                      palette={INCOME_COLORS}
                      cx={165} cy={88} rx={126} ry={43} depth={20}
                      holeRatio={0.38}
                      centerLabel={`${fmt$(totalIncome)}`}
                    />
                  </div>
                  <BarLegend data={incomeSources} palette={INCOME_COLORS} />
                </>
              )}
            </ChartCard>
          </div>
        </div>

        {/* ── Row 2: Top Expenses ── */}
        <div className="sp-c3">
          <ChartCard>
            <SectionHeader
              title="Top Expenses"
              subtitle="Largest single transactions this period"
              icon={Zap}
              accent={C.amber}
            />

            {(!topExpenses || topExpenses.length === 0) ? (
              <p className="text-sm text-white/25 font-poppins py-6 text-center">
                No expenses found in this period
              </p>
            ) : (
              <div className="space-y-1 mt-1">
                {topExpenses.map((tx, i) => {
                  const color  = PALETTE[i % PALETTE.length];
                  const barPct = (tx.amount / maxTop) * 100;
                  return (
                    <div key={tx.id || i}
                      className="group flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.025] cursor-default"
                      style={{ animationDelay: `${i * 0.06 + 0.36}s` }}
                    >
                      {/* Rank badge */}
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold font-montserrat flex-shrink-0"
                        style={{ background: `${color}18`, color: `${color}aa` }}
                      >
                        {i + 1}
                      </span>

                      {/* Label + animated bar */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium font-poppins text-white/80 truncate capitalize leading-none mb-1.5">
                          {tx.description || tx.category || "Expense"}
                        </p>
                        <div className="h-[3px] w-full rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div
                            className="sp-bar h-full rounded-full"
                            style={{
                              width: `${barPct}%`,
                              background: `linear-gradient(90deg, ${color}, ${darken(color, -20)})`,
                              boxShadow: `0 0 6px ${color}50`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Category chip */}
                      {tx.category && (
                        <span
                          className="text-[9px] font-bold font-montserrat px-2 py-0.5 rounded-full capitalize flex-shrink-0 hidden sm:block"
                          style={{ background: `${color}15`, color: `${color}cc` }}
                        >
                          {tx.category.toLowerCase()}
                        </span>
                      )}

                      {/* Amount */}
                      <span
                        className="text-sm font-extrabold font-montserrat flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                        style={{ color, minWidth: 64, textAlign: "right" }}
                      >
                        {fmt$(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartCard>
        </div>

        {/* ── Row 3: Category Summary Tiles ── */}
        {categoryData.length > 0 && (
          <div className="sp-c4">
            <ChartCard>
              <SectionHeader
                title="Category Summary"
                subtitle="Spending distribution at a glance"
                icon={PieIcon}
                accent={C.purple}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-1">
                {categoryData.slice(0, 8).map((d, i) => {
                  const color = PALETTE[i % PALETTE.length];
                  const pct   = totalExpense ? (d.value / totalExpense) * 100 : 0;
                  return (
                    <div key={i}
                      className="group rounded-xl p-3.5 border cursor-default transition-all duration-300 hover:border-white/15 hover:-translate-y-0.5"
                      style={{
                        background: `${color}0a`,
                        borderColor: `${color}18`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2.5">
                        <span
                          className="w-2 h-2 rounded-full mt-0.5"
                          style={{ background: color }}
                        />
                        <span
                          className="text-[9px] font-extrabold font-montserrat"
                          style={{ color: `${color}cc` }}
                        >
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs font-medium font-poppins text-white/60 capitalize truncate mb-0.5">
                        {d.name.toLowerCase()}
                      </p>
                      <p className="text-sm font-extrabold font-montserrat" style={{ color }}>
                        {fmt$(d.value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        )}

      </div>
    </>
  );
}
