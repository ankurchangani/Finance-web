"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* ── Inner component that uses useSearchParams ── */
function LoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(null);
  const timer = useRef(null);
  const finishTimeout = useRef(null);
  const safetyTimeout = useRef(null);

  const currentPath = pathname + searchParams.toString();

  const startLoader = useCallback(() => {
    clearInterval(timer.current);
    clearTimeout(finishTimeout.current);
    clearTimeout(safetyTimeout.current);

    setVisible(true);
    setWidth((prev) => (prev > 0 && prev < 30 ? prev : 18));

    let currentW = 18;
    timer.current = setInterval(() => {
      currentW += Math.random() * 12 + 6;
      if (currentW >= 85) {
        currentW = 85;
        clearInterval(timer.current);
      }
      setWidth(currentW);
    }, 120);

    // Safety timeout in case navigation fails/is cancelled
    safetyTimeout.current = setTimeout(() => {
      clearInterval(timer.current);
      setWidth(100);
      setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
    }, 8000);
  }, []);

  const completeLoader = useCallback(() => {
    clearInterval(timer.current);
    clearTimeout(safetyTimeout.current);

    setWidth(100);
    finishTimeout.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setWidth(0);
      }, 200);
    }, 280);
  }, []);

  // ── Intercept internal link clicks for INSTANT visual feedback ──
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore anchor jumps, protocols, blank targets, or modified clicks (ctrl/cmd/shift)
      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      try {
        const dest = new URL(anchor.href, window.location.href);
        // Only internal links
        if (dest.origin !== window.location.origin) return;

        // Skip if clicking current route
        if (
          dest.pathname === window.location.pathname &&
          dest.search === window.location.search
        ) {
          return;
        }

        // Trigger loader immediately on click!
        startLoader();
      } catch {
        // Safe ignore
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [startLoader]);

  // ── Finish loader when route actually changes ──
  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = currentPath;
      return;
    }

    if (prevPath.current !== currentPath) {
      prevPath.current = currentPath;
      completeLoader();
    }
  }, [currentPath, completeLoader]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timer.current);
      clearTimeout(finishTimeout.current);
      clearTimeout(safetyTimeout.current);
    };
  }, []);

  if (!visible && width === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease-out",
      }}
    >
      <div
        className="h-full relative overflow-hidden"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, #22BDFD, #8B5CF6, #06B6D4, #3B82F6)",
          borderRadius: "0 999px 999px 0",
          transition:
            width === 100
              ? "width 0.18s ease-out"
              : "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 14px rgba(34, 189, 253, 0.8), 0 0 4px rgba(139, 92, 246, 0.6)",
        }}
      >
        {/* Animated shimmer beam */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{ animation: "shimmer 1s ease-in-out infinite" }}
        />
        {/* Glow bead at leading edge */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-white/40 blur-[2px] rounded-full" />
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
