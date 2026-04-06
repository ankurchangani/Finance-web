  // "use client";
  // // app/dashboard/_components/monthly-chart.jsx

  // import { useMemo, useState } from "react";
  // import {
  //   BarChart, Bar, AreaChart, Area,
  //   XAxis, YAxis, CartesianGrid, Tooltip,
  //   Legend, ResponsiveContainer, Cell,
  // } from "recharts";
  // import {
  //   Select, SelectContent, SelectItem,
  //   SelectTrigger, SelectValue,
  // } from "@/components/ui/select";
  // import { cn } from "@/lib/utils";

  // /* ── Custom tooltip ─────────────────────────────────────────────── */
  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (!active || !payload?.length) return null;
  //   return (
  //     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-2xl">
  //       <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{label}</p>
  //       {payload.map((p, i) => (
  //         <div key={i} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
  //           <div className="flex items-center gap-2">
  //             <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
  //             <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{p.name}</span>
  //           </div>
  //           <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
  //             ${Number(p.value).toLocaleString()}
  //           </span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // /* ── Custom 3D-effect bar shape ─────────────────────────────────── */
  // const Bar3D = (props) => {
  //   const { x, y, width, height, fill } = props;
  //   if (!height || height <= 0) return null;
  //   const topH = Math.min(6, height * 0.12);
  //   const sideW = Math.min(6, width * 0.18);
  //   return (
  //     <g>
  //       {/* Front face */}
  //       <rect x={x} y={y} width={width} height={height} fill={fill} rx={3} />
  //       {/* Top face (lighter) */}
  //       <polygon
  //         points={`${x},${y} ${x + width},${y} ${x + width + sideW},${y - topH} ${x + sideW},${y - topH}`}
  //         fill={`${fill}CC`}
  //         opacity={0.85}
  //       />
  //       {/* Right side face (darker) */}
  //       <polygon
  //         points={`${x + width},${y} ${x + width},${y + height} ${x + width + sideW},${y + height - topH} ${x + width + sideW},${y - topH}`}
  //         fill={`${fill}88`}
  //         opacity={0.7}
  //       />
  //     </g>
  //   );
  // };

  // export function MonthlyChart({ data }) {
  //   const [chartType, setChartType] = useState("bar3d");
  //   const [activeBar, setActiveBar] = useState(null);

  //   const formatted = useMemo(() =>
  //     (data || []).map((d) => {
  //       const [y, m] = d.label.split("-");
  //       const date = new Date(Number(y), Number(m) - 1);
  //       return {
  //         ...d,
  //         label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
  //       };
  //     }),
  //   [data]);

  //   const totals = useMemo(() =>
  //     formatted.reduce((acc, d) => ({
  //       income:  acc.income  + (d.income  || 0),
  //       expense: acc.expense + (d.expense || 0),
  //     }), { income: 0, expense: 0 }),
  //   [formatted]);

  //   const axisProps = {
  //     axisLine: false,
  //     tickLine: false,
  //     tick: { fontSize: 11, fill: "#94a3b8" },
  //   };
  //   const gridProps = {
  //     strokeDasharray: "3 3",
  //     stroke: "rgba(148,163,184,0.15)",
  //     vertical: false,
  //   };

  //   return (
  //     <div className="rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/50 p-5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300">
  //       {/* Header */}
  //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
  //         <div>
  //           <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
  //             Monthly Overview
  //           </p>
  //           <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
  //             Income vs Expenses
  //           </h3>
  //         </div>
  //         <Select value={chartType} onValueChange={setChartType}>
  //           <SelectTrigger className="w-[130px] h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700">
  //             <SelectValue />
  //           </SelectTrigger>
  //           <SelectContent>
  //             <SelectItem value="bar3d">3D Bar Chart</SelectItem>
  //             <SelectItem value="bar">Bar Chart</SelectItem>
  //             <SelectItem value="area">Area Chart</SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </div>

  //       {/* Totals */}
  //       <div className="flex gap-6 mb-5 flex-wrap">
  //         {[
  //           { label: "Total Income", value: totals.income, color: "text-emerald-500", bg: "bg-emerald-500" },
  //           { label: "Total Expenses", value: totals.expense, color: "text-red-500", bg: "bg-red-500" },
  //           {
  //             label: "Net",
  //             value: totals.income - totals.expense,
  //             color: totals.income - totals.expense >= 0 ? "text-emerald-500" : "text-red-500",
  //             bg: totals.income - totals.expense >= 0 ? "bg-emerald-500" : "bg-red-500",
  //           },
  //         ].map((item) => (
  //           <div key={item.label} className="flex items-center gap-2">
  //             <div className={cn("w-2 h-2 rounded-full", item.bg)} />
  //             <div>
  //               <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</p>
  //               <p className={cn("text-sm font-black tabular-nums", item.color)}>
  //                 ${Math.abs(item.value).toLocaleString()}
  //               </p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Chart */}
  //       <div className="h-[270px]">
  //         <ResponsiveContainer width="100%" height="100%">
  //           {chartType === "area" ? (
  //             <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
  //               <defs>
  //                 <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
  //                   <stop offset="5%"  stopColor="#10B981" stopOpacity={0.35} />
  //                   <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
  //                 </linearGradient>
  //                 <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
  //                   <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.35} />
  //                   <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
  //                 </linearGradient>
  //               </defs>
  //               <CartesianGrid {...gridProps} />
  //               <XAxis dataKey="label" {...axisProps} />
  //               <YAxis {...axisProps} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
  //               <Tooltip content={<CustomTooltip />} />
  //               <Area type="monotone" dataKey="income"  name="Income"  stroke="#10B981" fill="url(#incG)" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3 }} activeDot={{ r: 5 }} />
  //               <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" fill="url(#expG)" strokeWidth={2.5} dot={{ fill: "#EF4444", r: 3 }} activeDot={{ r: 5 }} />
  //             </AreaChart>
  //           ) : (
  //             <BarChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
  //               <CartesianGrid {...gridProps} />
  //               <XAxis dataKey="label" {...axisProps} />
  //               <YAxis {...axisProps} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
  //               <Tooltip content={<CustomTooltip />} />
  //               <Bar
  //                 dataKey="income"
  //                 name="Income"
  //                 fill="#10B981"
  //                 radius={chartType === "bar" ? [4, 4, 0, 0] : undefined}
  //                 shape={chartType === "bar3d" ? <Bar3D fill="#10B981" /> : undefined}
  //                 maxBarSize={40}
  //               />
  //               <Bar
  //                 dataKey="expense"
  //                 name="Expense"
  //                 fill="#EF4444"
  //                 radius={chartType === "bar" ? [4, 4, 0, 0] : undefined}
  //                 shape={chartType === "bar3d" ? <Bar3D fill="#EF4444" /> : undefined}
  //                 maxBarSize={40}
  //               />
  //             </BarChart>
  //           )}
  //         </ResponsiveContainer>
  //       </div>

  //       {/* Legend */}
  //       <div className="flex items-center gap-5 mt-4 justify-center">
  //         {[{ label: "Income", color: "#10B981" }, { label: "Expense", color: "#EF4444" }].map((l) => (
  //           <div key={l.label} className="flex items-center gap-1.5">
  //             <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
  //             <span className="text-xs text-slate-400 dark:text-slate-500">{l.label}</span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
