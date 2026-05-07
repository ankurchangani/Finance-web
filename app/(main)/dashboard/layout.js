// app/dashboard/layout.jsx

"use client";

import { Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { BarChart2, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { RouteChangeLoader } from "./_components/route-change-loader";
import DashboardLoading from "./loading";

function ViewAnalyticsBtn() {
  const btnRef = useRef(null);
  const iconBarRef = useRef(null);
  const arrowRef = useRef(null);
  const glowRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(btnRef.current,
      { opacity: 0, x: 30, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out(1.7)" }
    );
  }, []);

  const handleMouseEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.06,
      y: -3,
      boxShadow: "0 8px 30px rgba(139,92,246,0.25), 0 2px 8px rgba(0,0,0,0.1)",
      borderColor: "rgba(139,92,246,0.6)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(glowRef.current, {
      opacity: 1,
      duration: 0.3,
    });
    // BarChart2 bars animate up
    gsap.to(iconBarRef.current, {
      scale: 1.25,
      rotate: -8,
      color: "#7c3aed",
      duration: 0.35,
      ease: "back.out(2)",
    });
    // Arrow shoots up-right
    gsap.to(arrowRef.current, {
      x: 3,
      y: -3,
      scale: 1.2,
      color: "#7c3aed",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(textRef.current, {
      color: "#7c3aed",
      letterSpacing: "0.03em",
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      borderColor: "rgba(226,232,240,1)",
      duration: 0.4,
      ease: "power2.inOut",
    });
    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.4,
    });
    gsap.to(iconBarRef.current, {
      scale: 1,
      rotate: 0,
      color: "#64748b",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(arrowRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      color: "#64748b",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(textRef.current, {
      color: "#64748b",
      letterSpacing: "0em",
      duration: 0.4,
    });
  };

  const handleClick = () => {
    // Click pulse
    gsap.to(btnRef.current, {
      scale: 0.94,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
    // Arrow shoots far then comes back
    gsap.to(arrowRef.current, {
      x: 6,
      y: -6,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        gsap.fromTo(arrowRef.current,
          { x: -4, y: 4, opacity: 0 },
          { x: 3, y: -3, opacity: 1, duration: 0.25, ease: "power2.out" }
        );
      },
    });
  };

  return (
    <Link href="/advanced-analytics">
      <div
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full self-start sm:self-auto border text-sm font-semibold cursor-pointer overflow-hidden"
        style={{
          background: "white",
          borderColor: "rgba(226,232,240,1)",
          color: "#64748b",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* Glow background */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            opacity: 0,
            background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.06) 50%, rgba(34,189,253,0.05) 100%)",
          }}
        />

        <span ref={iconBarRef} className="relative z-10 flex items-center" style={{ color: "#64748b" }}>
          <BarChart2 className="w-4 h-4" />
        </span>

        <span ref={textRef} className="relative z-10" style={{ color: "#64748b" }}>
          View Analytics
        </span>

        <span ref={arrowRef} className="relative z-10 flex items-center" style={{ color: "#64748b" }}>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function DashboardHeader() {
  const overviewRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(overviewRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 20, skewX: -3 },
      { opacity: 1, y: 0, skewX: 0, duration: 0.5, ease: "power3.out" },
      "-=0.2"
    )
    .fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <p
          ref={overviewRef}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-500 dark:text-violet-400 mb-1.5"
        >
          Overview
        </p>
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-none"
        >
          Dashboard
        </h1>
        <div
          ref={lineRef}
          className="mt-2.5 h-[3px] w-20 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400"
        />
      </div>

      <ViewAnalyticsBtn />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <>
      <RouteChangeLoader />

      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-20 sm:py-20 md:py-24 lg:py-28 xl:py-32 max-w-7xl mx-auto">

          <DashboardHeader />

          <Suspense
            fallback={
              <div className="space-y-4">
                <DashboardLoading />
                <div className="h-32 rounded-2xl bg-white dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-700/50" />
              </div>
            }
          >
            {children}
          </Suspense>

        </div>
      </div>
    </>
  );
}