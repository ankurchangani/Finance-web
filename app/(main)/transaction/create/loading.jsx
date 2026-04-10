export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">

      {/* ✅ Top progress bar — fixed to top of viewport */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted overflow-hidden">
        <div
          className="h-full bg-violet-500"
          style={{
            animation: "loading-bar 1.4s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%;  margin-left: 0%; }
          50%  { width: 70%; margin-left: 10%; }
          100% { width: 0%;  margin-left: 100%; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-5 py-8">

        {/* Header skeleton */}
        <div className="mb-8 flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 animate-pulse" />
            <div className="h-10 w-52 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 animate-pulse" />
          </div>
          <div className="h-3.5 w-44 rounded bg-muted animate-pulse" />
        </div>

        {/* Form card */}
        <div className="rounded-2xl border bg-card shadow-sm px-6 py-6 space-y-5">

          {/* Receipt scanner skeleton */}
          <div className="w-full h-[76px] rounded-xl border-2 border-dashed border-violet-100 dark:border-violet-800/50 bg-violet-50/40 dark:bg-violet-950/10 animate-pulse" />

          {/* Type toggle skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-muted animate-pulse" />
            <div className="h-12 w-full rounded-xl border bg-muted/30 p-1 flex gap-2 animate-pulse">
              <div className="flex-1 h-full rounded-lg bg-muted/60" />
              <div className="flex-1 h-full rounded-lg bg-muted/60" />
            </div>
          </div>

          {/* Amount skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            <div className="h-14 w-full rounded-lg border-2 bg-muted/30 animate-pulse" />
          </div>

          {/* Account skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            <div className="h-11 w-full rounded-lg border bg-muted/30 animate-pulse" />
          </div>

          {/* Category skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            <div className="h-11 w-full rounded-lg border bg-muted/30 animate-pulse" />
          </div>

          {/* Date + Description */}
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-14 rounded bg-muted animate-pulse" />
                <div className="h-11 w-full rounded-lg border bg-muted/30 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Recurring toggle skeleton */}
          <div className="flex items-center justify-between rounded-xl border-2 border-muted/60 p-4 animate-pulse">
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-52 rounded bg-muted/60" />
            </div>
            <div className="h-6 w-11 rounded-full bg-muted" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-full rounded-lg border bg-muted/30 animate-pulse" />
            <div className="h-11 w-full rounded-lg bg-violet-100 dark:bg-violet-900/30 animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
}
