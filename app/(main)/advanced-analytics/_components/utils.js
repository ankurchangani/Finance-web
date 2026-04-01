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

export const SECTIONS = [
  { id: "overview",  label: "Overview",  icon: "BarChart3"  },
  { id: "cashflow",  label: "Cash Flow", icon: "Activity"   },
  { id: "spending",  label: "Spending",  icon: "PieIcon"    },
  { id: "trends",    label: "Trends",    icon: "TrendingUp" },
  { id: "insights",  label: "Insights",  icon: "Zap"        },
];

export const TOP_CATEGORIES = [
  "housing", "food", "transportation", "entertainment", "shopping", "healthcare",
];

// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmt$   = (n, dec = 2) => `$${Math.abs(parseFloat(n || 0)).toFixed(dec)}`;
export const fmtK   = (n) => {
  const v = Math.abs(parseFloat(n || 0));
  return v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`;
};
export const fmtPct = (n) => `${parseFloat(n || 0).toFixed(1)}%`;

// ─── Stable Axis Tick Formatters ──────────────────────────────────────────────
export const yFmtK  = (v) => fmtK(v);
export const yFmt$k = (v) => `$${v >= 1000 ? Math.floor(v / 1000) + "k" : v}`;

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
};
