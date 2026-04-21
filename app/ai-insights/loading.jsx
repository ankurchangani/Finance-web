export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[110px]" />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .sk {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 25%,
            rgba(255,255,255,0.07) 50%,
            rgba(255,255,255,0.03) 75%
          );
          background-size: 600px 100%;
          animation: shimmer 1.8s infinite linear;
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 mt-24 space-y-12">

        {/* ── Section: Select Account ── */}
        <div>
          <SectionHeader iconBg="bg-violet-500/10" iconBorder="border-violet-500/20" titleW="w-36" subW="w-48" />
          <div className="flex flex-wrap gap-2 mt-5">
            {["w-28", "w-24", "w-32", "w-20"].map((w, i) => (
              <div key={i} className={`h-9 ${w} rounded-xl sk border border-white/5`} />
            ))}
          </div>
        </div>

        {/* ── Section: Financial Overview ── */}
        <div>
          <SectionHeader iconBg="bg-blue-500/10" iconBorder="border-blue-500/20" titleW="w-44" subW="w-56" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { border: "border-emerald-500/20 bg-emerald-500/5", vw: "w-28" },
              { border: "border-rose-500/20 bg-rose-500/5",     vw: "w-24" },
              { border: "border-violet-500/20 bg-violet-500/5", vw: "w-20" },
              { border: "border-cyan-500/20 bg-cyan-500/5",     vw: "w-16" },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl border ${s.border} p-4 text-center space-y-2`}>
                <div className="h-2.5 w-16 rounded-full sk mx-auto" />
                <div className={`h-5 ${s.vw} rounded-lg sk mx-auto`} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Monthly Trend ── */}
        <div>
          <SectionHeader iconBg="bg-teal-500/10" iconBorder="border-teal-500/20" titleW="w-36" subW="w-52" />
          <div className="flex items-end gap-4 h-32 mt-5">
            {[65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end gap-1 h-20">
                  <div className="flex-1 rounded-t-lg sk" style={{ height: `${h}%`, minHeight: "4px" }} />
                  <div className="flex-1 rounded-t-lg sk" style={{ height: `${100 - h}%`, minHeight: "4px" }} />
                </div>
                <div className="h-2.5 w-10 rounded-full sk" />
              </div>
            ))}
            <div className="flex flex-col gap-1.5 pb-5 space-y-2">
              <div className="h-2.5 w-14 rounded-full sk" />
              <div className="h-2.5 w-14 rounded-full sk" />
            </div>
          </div>
        </div>

        {/* ── Section: Spending by Category ── */}
        <div>
          <SectionHeader iconBg="bg-pink-500/10" iconBorder="border-pink-500/20" titleW="w-48" subW="w-44" />
          <div className="space-y-3 mt-5">
            {[80, 60, 45, 35, 25, 15].map((pct, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <div className="h-3 w-20 rounded-full sk" />
                  <div className="flex gap-3">
                    <div className="h-2.5 w-10 rounded-full sk" />
                    <div className="h-3 w-16 rounded-full sk" />
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full sk" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Top 5 Expenses ── */}
        <div>
          <SectionHeader iconBg="bg-rose-500/10" iconBorder="border-rose-500/20" titleW="w-32" subW="w-52" />
          <div className="space-y-2 mt-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-4 rounded sk" />
                  <div>
                    <div className="h-3 w-28 rounded-full sk mb-1.5" />
                    <div className="h-2.5 w-16 rounded-full sk" />
                  </div>
                </div>
                <div className="h-3.5 w-16 rounded-lg sk" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Financial Health Score ── */}
        <div>
          <SectionHeader iconBg="bg-red-500/10" iconBorder="border-red-500/20" titleW="w-52" subW="w-48" badge />
          <div className="flex items-center gap-6 mt-5">
            <div className="w-24 h-24 rounded-full sk flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-28 rounded-lg sk" />
              <div className="h-3 w-full rounded-full sk" />
              <div className="h-3 w-3/4 rounded-full sk" />
              <div className="h-1.5 w-24 rounded-full sk mt-2" />
            </div>
          </div>
        </div>

        {/* ── Section: Financial Tips ── */}
        <div>
          <SectionHeader iconBg="bg-yellow-500/10" iconBorder="border-yellow-500/20" titleW="w-36" subW="w-44" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg sk flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-full rounded-full sk" />
                  <div className="h-3 w-3/4 rounded-full sk" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: AI Insights ── */}
        <div>
          <SectionHeader iconBg="bg-violet-500/10" iconBorder="border-violet-500/20" titleW="w-28" subW="w-56" badge />

          {/* Generate button skeleton */}
          <div className="h-14 w-52 rounded-2xl sk mt-5 mb-8" />

          {/* Insight cards skeleton */}
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl border border-violet-500/10 bg-violet-500/5 p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl sk flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-16 rounded-full sk" />
                  <div className="h-3 w-full rounded-full sk" />
                  <div className="h-3 w-5/6 rounded-full sk" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Reusable Section Header Skeleton ──
function SectionHeader({ iconBg, iconBorder, titleW, subW, badge = false }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} border ${iconBorder} flex-shrink-0 sk`} />
        <div className="space-y-1.5">
          <div className={`h-4 ${titleW} rounded-lg sk`} />
          <div className={`h-3 ${subW} rounded-full sk`} />
        </div>
      </div>
      {badge && (
        <div className="h-6 w-16 rounded-full sk" />
      )}
    </div>
  );
}