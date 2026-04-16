// app/(route)/ai-insights/loading.jsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden my-32">

      {/* ── Background glows (matches real page) ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[110px]" />
      </div>

      {/* ── Top progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden" style={{ background: "rgba(139,92,246,0.15)" }}>
        <div
          className="h-full"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #6366f1, #06b6d4)",
            animation: "ai-bar 2s cubic-bezier(0.4,0,0.2,1) infinite",
          }}
        />
      </div>
      
      <style>{`
        @keyframes ai-bar {
          0%   { width: 0%;   margin-left: 0%;  opacity: 1; }
          60%  { width: 80%;  margin-left: 5%;  opacity: 1; }
          95%  { width: 95%;  margin-left: 3%;  opacity: 1; }
          100% { width: 100%; margin-left: 0%;  opacity: 0; }
        }
        @keyframes sk {
          0%,100% { opacity: 0.35; }
          50%      { opacity: 0.7;  }
        }
        .sk  { animation: sk 1.8s ease-in-out infinite; }
        .d1  { animation-delay: 0.08s; }
        .d2  { animation-delay: 0.16s; }
        .d3  { animation-delay: 0.24s; }
        .d4  { animation-delay: 0.32s; }
        .d5  { animation-delay: 0.40s; }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* ── Section: Account selector ── */}
        <SkSection icon lines={[{ w: "w-32" }, { w: "w-48" }]}>
          <div className="flex flex-wrap gap-2">
            {["w-24", "w-28", "w-20"].map((w, i) => (
              <div key={i} className={`sk d${i+1} h-8 ${w} rounded-xl bg-white/6 border border-white/8`} />
            ))}
          </div>
        </SkSection>

        {/* ── Section: Financial Overview (4 stat cards) ── */}
        <SkSection icon lines={[{ w: "w-40" }, { w: "w-56" }]}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { vw: "w-20", delay: "" },
              { vw: "w-16", delay: "d1" },
              { vw: "w-24", delay: "d2" },
              { vw: "w-14", delay: "d3" },
            ].map((c, i) => (
              <div key={i} className={`sk ${c.delay} rounded-2xl border border-white/6 bg-white/3 p-4 space-y-2 text-center`}>
                <div className="h-2.5 w-16 rounded-full bg-white/10 mx-auto" />
                <div className={`h-5 ${c.vw} rounded-lg bg-white/15 mx-auto`} />
              </div>
            ))}
          </div>
        </SkSection>

        {/* ── Section: Monthly Trend (bar chart) ── */}
        <SkSection icon lines={[{ w: "w-32" }, { w: "w-52" }]}>
          <div className="flex items-end gap-4 h-32">
            {[65, 80, 55].map((h, i) => (
              <div key={i} className={`sk d${i+1} flex-1 flex flex-col items-center gap-1.5`}>
                <div className="w-full flex items-end gap-1 h-20">
                  <div className="flex-1 rounded-t-lg bg-emerald-600/20" style={{ height: `${h}%` }} />
                  <div className="flex-1 rounded-t-lg bg-rose-600/20" style={{ height: `${100 - h}%` }} />
                </div>
                <div className="h-2 w-10 rounded-full bg-white/8" />
              </div>
            ))}
            <div className="flex flex-col gap-2 pb-5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600/30" />
                <div className="h-2 w-10 rounded-full bg-white/8" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-600/30" />
                <div className="h-2 w-10 rounded-full bg-white/8" />
              </div>
            </div>
          </div>
        </SkSection>

        {/* ── Section: Category Breakdown (progress bars) ── */}
        <SkSection icon lines={[{ w: "w-44" }, { w: "w-60" }]}>
          <div className="space-y-3">
            {[70, 50, 40, 30, 20].map((pct, i) => (
              <div key={i} className={`sk d${i % 4 + 1} space-y-1`}>
                <div className="flex justify-between">
                  <div className="h-2.5 w-20 rounded-full bg-white/10" />
                  <div className="h-2.5 w-12 rounded-full bg-white/8" />
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-violet-500/25" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SkSection>

        {/* ── Section: Top 5 Expenses ── */}
        <SkSection icon lines={[{ w: "w-28" }, { w: "w-48" }]}>
          <div className="space-y-2">
            {["d1","d2","d3","d4","d5"].map((d, i) => (
              <div key={i} className={`sk ${d} flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/5`}>
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-3 rounded-full bg-white/10" />
                  <div className="space-y-1">
                    <div className="h-2.5 w-24 rounded-full bg-white/12" />
                    <div className="h-2 w-16 rounded-full bg-white/7" />
                  </div>
                </div>
                <div className="h-3 w-14 rounded-full bg-rose-500/20" />
              </div>
            ))}
          </div>
        </SkSection>

        {/* ── Section: Health Score ── */}
        <SkSection icon lines={[{ w: "w-40" }, { w: "w-56" }]} badge>
          <div className="flex items-center gap-6">
            {/* Circle */}
            <div className="sk w-24 h-24 rounded-full border-4 border-white/8 flex-shrink-0 relative">
              <div className="absolute inset-3 rounded-full bg-white/5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-28 rounded-lg bg-white/10" />
              <div className="h-2.5 w-full rounded-full bg-white/7" />
              <div className="h-2.5 w-3/4 rounded-full bg-white/5" />
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-24 bg-white/8 rounded-full" />
                <div className="h-2 w-16 rounded-full bg-white/6" />
              </div>
            </div>
          </div>
        </SkSection>

        {/* ── Section: Quick Tips (2×2 grid) ── */}
        <SkSection icon lines={[{ w: "w-28" }, { w: "w-44" }]}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["d1","d2","d3","d4"].map((d, i) => (
              <div key={i} className={`sk ${d} flex items-start gap-3 p-4 rounded-xl border border-white/6 bg-white/2`}>
                <div className="w-8 h-8 rounded-lg bg-white/8 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-full rounded-full bg-white/10" />
                  <div className="h-2.5 w-4/5 rounded-full bg-white/7" />
                </div>
              </div>
            ))}
          </div>
        </SkSection>

        {/* ── Section: AI Insights ── */}
        <SkSection icon lines={[{ w: "w-24" }, { w: "w-52" }]} badge>
          {/* Generate button skeleton */}
          <div className="sk d1 h-12 w-52 rounded-2xl mb-8 bg-gradient-to-r from-violet-600/30 to-blue-600/30 border border-violet-500/20" />

          {/* Insight cards skeleton */}
          <div className="grid md:grid-cols-2 gap-4">
            {["","d1","d2","d3"].map((d, i) => (
              <div key={i} className={`sk ${d} rounded-2xl p-[1px]`} style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))" }}>
                <div className="bg-[#0d0d14] rounded-2xl p-5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-violet-900/30 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-16 rounded-full bg-violet-900/40" />
                    <div className="h-3 w-full rounded-full bg-white/8" />
                    <div className="h-3 w-4/5 rounded-full bg-white/6" />
                    <div className="h-3 w-3/5 rounded-full bg-white/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SkSection>

      </div>
    </div>
  );
}

/* ── Reusable Section Skeleton ── */
function SkSection({ icon, lines = [], badge, children }) {
  return (
    <div className="mb-2">
      {/* Section header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="sk w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex-shrink-0" />
          <div className="space-y-1.5">
            {lines.map((l, i) => (
              <div key={i} className={`sk d${i+1} h-${i === 0 ? "3.5" : "2.5"} ${l.w} rounded-full bg-white/${i === 0 ? "10" : "6"}`} />
            ))}
          </div>
        </div>
        {badge && <div className="sk h-5 w-10 rounded-full bg-violet-500/15 border border-violet-500/20" />}
      </div>
      {children}
    </div>
  );
}