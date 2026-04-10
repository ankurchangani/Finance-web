// app/dashboard/loading.jsx
// Next.js automatically shows this file while the dashboard page is fetching data.
// No isLoading prop needed — Next.js mounts/unmounts this component automatically.

export default function AdvancedAnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">

      {/* ── Top progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-muted overflow-hidden">
        <div className="h-full relative" style={{
          background: "linear-gradient(90deg, #8b5cf6, #6366f1, #06b6d4)",
          animation: "dash-bar 2s cubic-bezier(0.4,0,0.2,1) infinite",
        }}>
          {/* shimmer overlay */}
          <span className="absolute inset-0 w-20" style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            animation: "dash-shimmer 1.4s ease-in-out infinite",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes dash-bar {
          0%   { width: 0%;   margin-left: 0%;   opacity: 1; }
          60%  { width: 80%;  margin-left: 5%;   opacity: 1; }
          95%  { width: 95%;  margin-left: 3%;   opacity: 1; }
          100% { width: 100%; margin-left: 0%;   opacity: 0; }
        }
        @keyframes dash-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(2000%); }
        }
        @keyframes sk-pulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }
        .sk { animation: sk-pulse 1.6s ease-in-out infinite; }
        .sk-d1 { animation-delay: 0.1s; }
        .sk-d2 { animation-delay: 0.2s; }
        .sk-d3 { animation-delay: 0.3s; }
        .sk-d4 { animation-delay: 0.4s; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="space-y-2">
            <div className="h-9 w-48 rounded-xl sk bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30" />
            <div className="h-4 w-36 rounded-lg sk sk-d1 bg-muted" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 rounded-lg sk sk-d2 bg-muted/60 border" />
            <div className="h-9 w-32 rounded-lg sk sk-d1 bg-violet-100 dark:bg-violet-900/30" />
          </div>
        </div>

        {/* ── Stat cards row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { w: "w-20", aw: "w-28", delay: "" },
            { w: "w-24", aw: "w-20", delay: "sk-d1" },
            { w: "w-16", aw: "w-24", delay: "sk-d2" },
            { w: "w-20", aw: "w-16", delay: "sk-d3" },
          ].map((card, i) => (
            <div key={i} className={`rounded-2xl border bg-card p-5 space-y-3 sk ${card.delay}`}>
              <div className="flex items-center justify-between">
                <div className={`h-3.5 ${card.w} rounded-full bg-muted`} />
                <div className="h-8 w-8 rounded-lg bg-muted/60" />
              </div>
              <div className={`h-8 ${card.aw} rounded-lg bg-muted/80`} />
              <div className="h-3 w-20 rounded-full bg-muted/50" />
            </div>
          ))}
        </div>

        {/* ── Main content: chart + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Chart area */}
          <div className="lg:col-span-2 rounded-2xl border bg-card p-5 space-y-4 sk sk-d1">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-36 rounded-lg bg-muted" />
                <div className="h-3 w-24 rounded-full bg-muted/60" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-lg bg-muted/50 border" />
                <div className="h-7 w-16 rounded-lg bg-muted/50 border" />
              </div>
            </div>
            {/* Chart bars */}
            <div className="flex items-end gap-2 h-44 pt-4">
              {[55, 80, 45, 90, 60, 75, 40, 85, 65, 70, 50, 88].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                  <div
                    className="w-full rounded-t-md bg-violet-100 dark:bg-violet-900/30 sk"
                    style={{ height: `${h}%`, animationDelay: `${i * 0.04}s` }}
                  />
                </div>
              ))}
            </div>
            {/* X-axis labels */}
            <div className="flex gap-2">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                <div key={m} className="flex-1 h-2.5 rounded-full bg-muted/40" />
              ))}
            </div>
          </div>

          {/* Sidebar: account cards */}
          <div className="space-y-3 sk-d2">
            <div className="h-4 w-28 rounded-lg bg-muted sk" />
            {[
              { bw: "w-20", delay: "" },
              { bw: "w-16", delay: "sk-d1" },
              { bw: "w-24", delay: "sk-d2" },
            ].map((ac, i) => (
              <div key={i} className={`rounded-2xl border bg-card p-4 space-y-2.5 sk ${ac.delay}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted/60" />
                    <div className="h-3.5 w-20 rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-14 rounded-full bg-muted/50" />
                </div>
                <div className={`h-6 ${ac.bw} rounded-lg bg-muted/80`} />
                <div className="flex gap-4">
                  <div className="h-3 w-16 rounded-full bg-muted/40" />
                  <div className="h-3 w-16 rounded-full bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="rounded-2xl border bg-card p-5 space-y-4 sk sk-d2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 rounded-lg bg-muted" />
            <div className="h-7 w-16 rounded-lg bg-muted/50 border" />
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 pb-2 border-b">
            {["w-12", "w-20", "w-16", "w-14"].map((w, i) => (
              <div key={i} className={`h-3 ${w} rounded-full bg-muted/50`} />
            ))}
          </div>

          {/* Rows */}
          {[
            { icon: "bg-green-100 dark:bg-green-900/30", delay: "" },
            { icon: "bg-red-100 dark:bg-red-900/30",   delay: "sk-d1" },
            { icon: "bg-blue-100 dark:bg-blue-900/30",  delay: "sk-d2" },
            { icon: "bg-amber-100 dark:bg-amber-900/30",delay: "sk-d3" },
            { icon: "bg-violet-100 dark:bg-violet-900/30", delay: "sk-d4" },
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-4 gap-4 items-center py-1 sk ${row.delay}`}>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex-shrink-0 ${row.icon}`} />
                <div className="h-3 w-16 rounded-full bg-muted" />
              </div>
              <div className="h-3 w-20 rounded-full bg-muted/60" />
              <div className="h-5 w-14 rounded-full bg-muted/40" />
              <div className="h-4 w-16 rounded-lg bg-muted/70 justify-self-end" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}