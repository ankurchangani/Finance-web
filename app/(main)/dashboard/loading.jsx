// app/dashboard/_components/loading.jsx
import { memo } from "react";

/* ─── Keyframes injected once ─────────────────────────────────────── */
const styles = `
@keyframes bar-slide {
  0%   { width: 0%;   opacity: 1; }
  60%  { width: 85%;  opacity: 1; }
  90%  { width: 95%;  opacity: 1; }
  100% { width: 100%; opacity: 0; }
}
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px 2px rgba(139,92,246,0.7); }
  50%       { box-shadow: 0 0 22px 6px rgba(139,92,246,0.95); }
}
@keyframes spin-ring {
  to { transform: rotate(360deg); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes float-up {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.55); opacity: 0.35; }
  40%           { transform: scale(1.1);  opacity: 1; }
}
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
`;

/* ─── Top Bar (fixed, screen top) ─────────────────────────────────── */
export const TopBarLoader = memo(({ isLoading = true }) => {
  if (!isLoading) return null;
  return (
    <>
      <style>{styles}</style>
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 relative"
          style={{ animation: "bar-slide 2.4s cubic-bezier(0.4,0,0.2,1) forwards" }}
        >
          <div
            className="absolute inset-0 rounded-full bg-violet-400"
            style={{ animation: "glow-pulse 0.85s ease-in-out infinite" }}
          />
          <div
            className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </>
  );
});
TopBarLoader.displayName = "TopBarLoader";

/* ─── Dashboard inline bar (below heading) ─────────────────────────── */
export const DashBarLoader = memo(() => (
  <>
    <style>{styles}</style>
    <div className="w-full h-[3px] mt-2 rounded-full overflow-hidden bg-violet-100 dark:bg-violet-900/30">
      <div
        className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rounded-full relative"
        style={{ animation: "bar-slide 2.2s cubic-bezier(0.4,0,0.2,1) forwards" }}
      >
        <div
          className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/55 to-transparent"
          style={{ animation: "shimmer 1.4s ease-in-out infinite" }}
        />
      </div>
    </div>
  </>
));
DashBarLoader.displayName = "DashBarLoader";

/* ─── Full-page overlay ─────────────────────────────────────────────── */
export const PageLoader = memo(({ isLoading = true, message = "Loading…" }) => {
  if (!isLoading) return null;
  return (
    <>
      <style>{styles}</style>
      <div
        className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white/85 dark:bg-slate-950/88 backdrop-blur-sm"
        style={{ animation: "fade-in 0.2s ease" }}
      >
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900/50" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500"
            style={{ animation: "spin-ring 0.85s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2.5 h-2.5 rounded-full bg-violet-500"
              style={{ animation: "glow-pulse 1s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mt-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400"
              style={{ animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>

        {/* Message */}
        <p
          className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide"
          style={{ animation: "float-up 0.5s 0.1s ease both" }}
        >
          {message}
        </p>
      </div>
    </>
  );
});
PageLoader.displayName = "PageLoader";

/* ─── Inline / Button Spinner ─────────────────────────────────────── */
export const SpinnerLoader = memo(({ size = 20, color = "#8b5cf6" }) => (
  <>
    <style>{styles}</style>
    <span
      className="inline-block rounded-full border-2 border-transparent flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: `${color}55`,
        animation: "spin-ring 0.75s linear infinite",
      }}
    />
  </>
));
SpinnerLoader.displayName = "SpinnerLoader";

/* ─── Skeleton Cards for initial load ────────────────────────────── */
export const SkeletonCard = memo(() => (
  <>
    <style>{styles}</style>
    <div
      className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 p-5 space-y-3"
      style={{ animation: "skeleton-pulse 1.8s ease-in-out infinite" }}
    >
      <div className="flex justify-between items-center">
        <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-20 rounded-full bg-slate-100 dark:bg-slate-700/60" />
      <div className="flex justify-between pt-2">
        <div className="h-3 w-16 rounded-full bg-slate-100 dark:bg-slate-700/60" />
        <div className="h-3 w-16 rounded-full bg-slate-100 dark:bg-slate-700/60" />
      </div>
    </div>
  </>
));
SkeletonCard.displayName = "SkeletonCard";

/* ─── Default export ─────────────────────────────────────────────── */
const Loading = memo(({ variant = "topbar", isLoading = true, message }) => {
  if (variant === "page")    return <PageLoader    isLoading={isLoading} message={message} />;
  if (variant === "spinner") return <SpinnerLoader />;
  if (variant === "dash")    return <DashBarLoader />;
  if (variant === "skeleton") return <SkeletonCard />;
  return <TopBarLoader isLoading={isLoading} />;
});
Loading.displayName = "Loading";

export default Loading;
