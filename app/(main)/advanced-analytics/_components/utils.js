// ─── Design Tokens ────────────────────────────────────────────────────────────
export const C = {
  blue:    "#22BDFD",
  purple:  "#7C3AED",
  emerald: "#10B981",
  amber:   "#F59E0B",
  red:     "#EF4444",
  pink:    "#EC4899",
  indigo:  "#6366F1",
  teal:    "#14B8A6",
  bg:      "hsl(220,22%,5%)",
  card:    "hsl(220,20%,8%)",
  border:  "rgba(255,255,255,0.07)",
};

export const PALETTE       = [C.blue, C.purple, C.emerald, C.amber, C.red, C.pink, C.indigo, C.teal];
export const INCOME_COLORS = [C.emerald, C.teal, C.blue, C.indigo];
export const RANGE_OPTIONS = ["7D", "30D", "90D", "6M", "1Y", "ALL"];

export const TOP_CATEGORIES = [
  "housing", "food", "transportation", "entertainment", "shopping", "healthcare",
];

// ─── Currency Formatter (₹ Indian) ───────────────────────────────────────────
export const fmt$ = (n, dec = 0) => {
  const v = Math.abs(parseFloat(n || 0));
  return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
};

export const fmtK = (n) => {
  const v = Math.abs(parseFloat(n || 0));
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)    return `₹${(v / 1_000).toFixed(1)}k`;
  return `₹${Math.round(v)}`;
};

export const fmtPct = (n) => `${parseFloat(n || 0).toFixed(1)}%`;

// ─── Axis Tick Formatters (stable references — do NOT inline) ─────────────────
export const yFmtK  = (v) => fmtK(v);
export const yFmt$k = (v) => {
  const n = Math.abs(parseFloat(v || 0));
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)    return `₹${(n / 1_000).toFixed(0)}k`;
  return `₹${Math.round(n)}`;
};

// ─── Shared Recharts Props ────────────────────────────────────────────────────
export const xAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "var(--font-poppins)" },
  interval: "preserveStartEnd",
};

export const yAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "var(--font-poppins)" },
  width: 60,
};

export const gridProps = {
  strokeDasharray: "3 3",
  stroke: "rgba(255,255,255,0.04)",
  vertical: false,
};

export const legendStyle = {
  fontSize: 11,
  fontFamily: "var(--font-poppins)",
  color: "rgba(255,255,255,0.5)",
  paddingTop: 12,
};