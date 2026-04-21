export default function AIInsightsLoading() {
  return (
    <div className="min-h-screen" style={{ background: "hsl(220,22%,5%)" }}>
      <style>{`
        @keyframes sk-pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
        .sk { animation: sk-pulse 1.6s ease-in-out infinite; }
        .d1 { animation-delay:.1s } .d2 { animation-delay:.2s }
        .d3 { animation-delay:.3s } .d4 { animation-delay:.4s }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-3">
            <div className="h-5 w-32 rounded-full sk bg-[#22BDFD]/20" />
            <div className="h-10 w-72 rounded-xl sk bg-white/10" />
            <div className="h-3.5 w-48 rounded-full sk d1 bg-white/[0.06]" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-40 rounded-xl sk d2 bg-white/[0.06] border border-white/[0.07]" />
            <div className="h-9 w-52 rounded-xl sk d1 bg-white/[0.06] border border-white/[0.07]" />
          </div>
        </div>

        {/* Section nav */}
        <div className="h-12 w-full rounded-2xl sk bg-white/[0.05] border border-white/[0.07]" />

        {/* KPI cards row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => (
            <div key={i} className={`rounded-2xl p-5 border sk d${i} space-y-3`}
              style={{ background:"hsl(220,20%,8%)", borderColor:"rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between">
                <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
                <div className="h-5 w-14 rounded-full bg-white/[0.04]" />
              </div>
              <div className="h-3 w-20 rounded-full bg-white/[0.06]" />
              <div className="h-7 w-28 rounded-lg bg-white/[0.08]" />
              <div className="h-3 w-16 rounded-full bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* KPI cards row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className={`rounded-2xl p-5 border sk d${i} space-y-3`}
              style={{ background:"hsl(220,20%,8%)", borderColor:"rgba(255,255,255,0.07)" }}>
              <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
              <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
              <div className="h-7 w-20 rounded-lg bg-white/[0.08]" />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-2xl p-5 border sk d2 space-y-4"
          style={{ background:"hsl(220,20%,8%)", borderColor:"rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/[0.06]" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-44 rounded-full bg-white/[0.08]" />
              <div className="h-3 w-28 rounded-full bg-white/[0.05]" />
            </div>
          </div>
          <div className="flex items-end gap-2 h-[200px]">
            {[55,80,45,90,60,75,40,85,65,70,50,88].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-md sk d${i%4}`}
                style={{ height:`${h}%`, background:"rgba(34,189,253,0.12)" }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}