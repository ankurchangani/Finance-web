"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LOADING_STATUSES = [
  "Initializing Financial AI Core...",
  "Loading Secure Encrypted Ledger...",
  "Syncing Real-Time Analytics...",
  "Optimizing Smart Recommendations...",
  "Finovexa Ready",
];

export function SitePreloader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(LOADING_STATUSES[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const progressLineRef = useRef(null);
  const percentageRef = useRef(null);
  const statusRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);

  useEffect(() => {
    // Only run initial loader once per session or on page refresh
    const hasLoadedThisSession = sessionStorage.getItem("finovexa_preloader_seen");
    if (hasLoadedThisSession) {
      setIsLoaded(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("finovexa_preloader_seen", "true");
        setIsLoaded(true);
      },
    });

    // 1. Initial entrance of logo & rings
    tl.fromTo(
      logoRef.current,
      { scale: 0.7, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
    );

    tl.fromTo(
      [ring1Ref.current, ring2Ref.current],
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.6, duration: 0.8, stagger: 0.2, ease: "power2.out" },
      "-=0.6"
    );

    // Rotating ambient rings
    gsap.to(ring1Ref.current, {
      rotate: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
    });
    gsap.to(ring2Ref.current, {
      rotate: -360,
      duration: 16,
      repeat: -1,
      ease: "none",
    });

    // 2. Animate counter 0 -> 100
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        const currentVal = Math.floor(counterObj.val);
        setProgress(currentVal);

        // Update status text based on progress thresholds
        if (currentVal < 25) setStatusText(LOADING_STATUSES[0]);
        else if (currentVal < 55) setStatusText(LOADING_STATUSES[1]);
        else if (currentVal < 80) setStatusText(LOADING_STATUSES[2]);
        else if (currentVal < 98) setStatusText(LOADING_STATUSES[3]);
        else setStatusText(LOADING_STATUSES[4]);

        if (progressLineRef.current) {
          progressLineRef.current.style.width = `${currentVal}%`;
        }
      },
    });

    // 3. Exit Animation
    tl.to(
      [logoRef.current, percentageRef.current, statusRef.current, ring1Ref.current, ring2Ref.current],
      {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.in",
      }
    );

    tl.to(
      curtainLeftRef.current,
      {
        xPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      },
      "-=0.1"
    );

    tl.to(
      curtainRightRef.current,
      {
        xPercent: 100,
        duration: 0.7,
        ease: "power4.inOut",
      },
      "<"
    );

    tl.to(containerRef.current, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.2,
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Left & Right Split Curtains */}
      <div
        ref={curtainLeftRef}
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#050814] border-r border-[#22BDFD]/20 z-10"
      />
      <div
        ref={curtainRightRef}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#050814] border-l border-[#22BDFD]/20 z-10"
      />

      {/* Main Center Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center">
        {/* Glowing Background Orbs */}
        <div
          ref={ring1Ref}
          className="absolute w-72 h-72 rounded-full pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(34, 189, 253, 0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          ref={ring2Ref}
          className="absolute w-96 h-96 rounded-full pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Animated Brand Logo */}
        <div ref={logoRef} className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(34,189,253,0.5)] border border-[#22BDFD]/40"
            style={{
              background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 50%, #6366f1 100%)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 14L9 4L15 14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M5.5 10H12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight"
            style={{
              fontFamily: "var(--font-montserrat)",
              background: "linear-gradient(135deg, #ffffff 20%, #22BDFD 60%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Finovexa
          </h1>
          <span className="text-xs sm:text-sm text-cyan-300/70 font-semibold tracking-widest uppercase mt-1">
            AI Financial Platform
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-80 space-y-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-md">
            <div
              ref={progressLineRef}
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #22BDFD 0%, #3b82f6 50%, #a855f7 100%)",
                boxShadow: "0 0 15px rgba(34,189,253,0.8)",
              }}
            />
          </div>

          {/* Percentage & Status Text */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span ref={statusRef} className="text-cyan-400 font-sans font-medium">
              {statusText}
            </span>
            <span ref={percentageRef} className="font-bold text-white text-sm">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
