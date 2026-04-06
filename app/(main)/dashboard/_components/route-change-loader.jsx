"use client";
// app/dashboard/_components/route-change-loader.jsx
// FIX: useSearchParams() needs Suspense boundary — wrapped internally
// Usage: <RouteChangeLoader /> anywhere in layout (no Suspense needed from parent)

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* ── Inner component that uses useSearchParams ── */
function LoaderInner() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth]     = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(null);
  const timer    = useRef(null);
  const finish   = useRef(null);

  const currentPath = pathname + searchParams.toString();

  useEffect(() => {
    // Skip initial mount
    if (prevPath.current === null) {
      prevPath.current = currentPath;
      return;
    }
    if (prevPath.current === currentPath) return;
    prevPath.current = currentPath;

    // Clear any running animation
    clearInterval(timer.current);
    clearTimeout(finish.current);

    // Start fresh
    setVisible(true);
    setWidth(8);

    let w = 8;
    timer.current = setInterval(() => {
      w += Math.random() * 12 + 4;
      if (w >= 82) { w = 82; clearInterval(timer.current); }
      setWidth(w);
    }, 100);

    // Snap to 100% after route is done, then hide
    finish.current = setTimeout(() => {
      clearInterval(timer.current);
      setWidth(100);
      setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 380);
    }, 550);

    return () => {
      clearInterval(timer.current);
      clearTimeout(finish.current);
    };
  }, [currentPath]);

  if (!visible && width === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <div
        className="h-full relative overflow-hidden"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, #8B5CF6, #3B82F6, #06B6D4)",
          borderRadius: "0 999px 999px 0",
          transition: width === 100
            ? "width 0.25s ease-out"
            : "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 10px rgba(139,92,246,0.6)",
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ animation: "shimmer 1.2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}

/* ── Exported component — wraps in Suspense ── */
export function RouteChangeLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderInner />
    </Suspense>
  );
}
