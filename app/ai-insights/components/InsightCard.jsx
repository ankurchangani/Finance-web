"use client";

import { useEffect, useState } from "react";

const CATEGORY_MAP = [
  { keys: ["food", "dining", "restaurant", "groceries"], icon: "🍽️", color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/20", accent: "text-orange-400" },
  { keys: ["travel", "transport", "flight", "fuel"], icon: "✈️", color: "from-sky-500/20 to-blue-500/20", border: "border-sky-500/20", accent: "text-sky-400" },
  { keys: ["shopping", "clothing", "purchase"], icon: "🛍️", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20", accent: "text-pink-400" },
  { keys: ["utilities", "electricity", "internet", "water", "bill"], icon: "💡", color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/20", accent: "text-yellow-400" },
  { keys: ["salary", "income", "earning", "freelance"], icon: "💰", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20", accent: "text-emerald-400" },
  { keys: ["entertainment", "movie", "streaming", "game"], icon: "🎬", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/20", accent: "text-purple-400" },
  { keys: ["health", "medical", "pharmacy", "gym"], icon: "❤️", color: "from-red-500/20 to-rose-500/20", border: "border-red-500/20", accent: "text-red-400" },
  { keys: ["saving", "invest", "budget"], icon: "📈", color: "from-teal-500/20 to-cyan-500/20", border: "border-teal-500/20", accent: "text-teal-400" },
  { keys: ["housing", "rent", "mortgage"], icon: "🏠", color: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/20", accent: "text-indigo-400" },
  // Gujarati keywords
  { keys: ["ખોરાક", "ભોજન", "ખર્ચ"], icon: "🍽️", color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/20", accent: "text-orange-400" },
  { keys: ["બચત", "રોકાણ"], icon: "📈", color: "from-teal-500/20 to-cyan-500/20", border: "border-teal-500/20", accent: "text-teal-400" },
  // Hindi keywords
  { keys: ["खर्च", "भोजन", "खाना"], icon: "🍽️", color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/20", accent: "text-orange-400" },
  { keys: ["बचत", "निवेश"], icon: "📈", color: "from-teal-500/20 to-cyan-500/20", border: "border-teal-500/20", accent: "text-teal-400" },
];

const DEFAULT_STYLE = {
  icon: "✦",
  color: "from-violet-500/20 to-blue-500/20",
  border: "border-violet-500/20",
  accent: "text-violet-400",
};

function getStyle(text) {
  const lower = text.toLowerCase();
  for (const item of CATEGORY_MAP) {
    if (item.keys.some((key) => lower.includes(key))) return item;
  }
  return DEFAULT_STYLE;
}

export default function InsightCard({ text, index }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index, text]);

  const style = getStyle(text);
  const cleanText = text.replace(/^[•\-\*\d\.]\s*/, "").trim();

  return (
    <div
      className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 py-32"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative rounded-2xl border ${style.border} bg-gradient-to-br ${style.color} backdrop-blur-sm p-5 h-full flex gap-4 items-start transition-all duration-300 ${hovered ? "scale-[1.02] shadow-lg" : ""}`}>
        {/* Top edge line */}
        <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${style.accent}`} />

        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl border ${style.border} bg-[#0d0d14]/60 flex items-center justify-center text-xl transition-transform duration-200 ${hovered ? "scale-110" : ""}`}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] font-bold ${style.accent} uppercase tracking-[0.15em] mb-1.5 block`}>
            Insight #{index + 1}
          </span>
          <p className="text-gray-200 text-sm leading-relaxed">{cleanText}</p>
        </div>
      </div>
    </div>
  );
}
