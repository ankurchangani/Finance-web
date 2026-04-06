import { memo } from "react";

// ─── Keyframe Styles ────────────────────────────────────────────────────────
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
  0%, 100% { box-shadow: 0 0 8px 2px rgba(99,102,241,0.7); }
  50%       { box-shadow: 0 0 20px 6px rgba(99,102,241,0.9); }
}
@keyframes spin-ring {
  to { transform: rotate(360deg); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes float-up {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1.1); opacity: 1; }
}
`;

// ─── Top Bar Loader (fixed – screen top) ────────────────────────────────────
export const TopBarLoader = memo(({ isLoading = true }) => {
  if (!isLoading) return null;
  return (
    <>
      <style>{styles}</style>
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-transparent">
        <div
          className="h-full bg-indigo-500 relative"
          style={{ animation: "bar-slide 2.4s cubic-bezier(0.4,0,0.2,1) forwards" }}
        >
          <div
            className="absolute inset-0 bg-indigo-400 rounded-full"
            style={{ animation: "glow-pulse 0.8s ease-in-out infinite" }}
          />
          <div
            className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>
    </>
  );
});

// ─── Dashboard Bar Loader (inline – below heading) ───────────────────────────
export const DashBarLoader = memo(() => (
  <>
    <style>{styles}</style>
    <div className="w-full h-[3px] mt-1 rounded-full overflow-hidden bg-purple-950/30">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 rounded-full relative"
        style={{ animation: "bar-slide 2.4s cubic-bezier(0.4,0,0.2,1) forwards" }}
      >
        <div
          className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
        />
      </div>
    </div>
  </>
));

// ─── Full-Page Overlay Loader ────────────────────────────────────────────────
export const PageLoader = memo(({ isLoading = true, message = "Loading…" }) => {
  if (!isLoading) return null;
  return (
    <>
      <style>{styles}</style>
      <div
        className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/85 backdrop-blur-sm"
        style={{ animation: "fade-in 0.2s ease" }}
      >
        {/* Spinner ring */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500"
            style={{ animation: "spin-ring 0.9s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2.5 h-2.5 rounded-full bg-indigo-500"
              style={{ animation: "glow-pulse 1s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Dot row */}
        <div className="flex gap-1.5 mt-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400"
              style={{ animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>

        {/* Message */}
        <p
          className="mt-4 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400"
          style={{ animation: "float-up 0.5s 0.1s ease both" }}
        >
          {message}
        </p>
      </div>
    </>
  );
});

// ─── Inline / Button Spinner ─────────────────────────────────────────────────
export const SpinnerLoader = memo(({ size = 20, color = "#6366f1" }) => (
  <>
    <style>{styles}</style>
    <span
      className="inline-block rounded-full border-2 border-transparent"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: `${color}55`,
        animation: "spin-ring 0.75s linear infinite",
        flexShrink: 0,
      }}
    />
  </>
));

// ─── Default export: all-in-one ──────────────────────────────────────────────
const Loading = memo(({ variant = "topbar", isLoading = true, message }) => {
  if (variant === "page")    return <PageLoader    isLoading={isLoading} message={message} />;
  if (variant === "spinner") return <SpinnerLoader />;
  if (variant === "dash")    return <DashBarLoader />;
  return <TopBarLoader isLoading={isLoading} />;
});

export default Loading;
