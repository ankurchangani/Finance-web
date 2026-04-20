"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart3, Receipt, Zap, Sparkles, Plus,
  Search, Clock, CheckSquare, ChevronDown,
  Camera, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Button3D from "@/components/Button3d";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const featuresData = [
  {
    Icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Instant visual breakdowns of your income, expenses, and savings trends with live-updating charts.",
    badge: "Live",
    stat: "Updates every second",
    gradient: "from-cyan-400 to-blue-500",
    glow: "rgba(34,211,238,0.18)",
    border: "rgba(34,211,238,0.14)",
    iconBg: "rgba(34,211,238,0.10)",
    badgeColor: "#22d3ee",
  },
  {
    Icon: Camera,
    title: "AI Receipt Scanner",
    description: "Point your camera at any receipt. Our vision model extracts merchant, amount, date, and category instantly.",
    badge: "AI-Powered",
    stat: "99.3% accuracy",
    gradient: "from-blue-400 to-indigo-500",
    glow: "rgba(59,130,246,0.18)",
    border: "rgba(59,130,246,0.14)",
    iconBg: "rgba(59,130,246,0.10)",
    badgeColor: "#60a5fa",
  },
  {
    Icon: Receipt,
    title: "Recurring Transactions",
    description: "Set up automatic recurring payments or income entries once, and never miss a beat again.",
    badge: "Smart",
    stat: "Auto-schedules",
    gradient: "from-indigo-400 to-violet-500",
    glow: "rgba(99,102,241,0.18)",
    border: "rgba(99,102,241,0.14)",
    iconBg: "rgba(99,102,241,0.10)",
    badgeColor: "#818cf8",
  },
  {
    Icon: Zap,
    title: "Instant Categorization",
    description: "Transactions are intelligently categorized the moment they're logged — no manual sorting.",
    badge: "Instant",
    stat: "50+ categories",
    gradient: "from-cyan-400 to-blue-500",
    glow: "rgba(34,211,238,0.18)",
    border: "rgba(34,211,238,0.14)",
    iconBg: "rgba(34,211,238,0.10)",
    badgeColor: "#22d3ee",
  },
  {
    Icon: Sparkles,
    title: "AI Insights Engine",
    description: "Pattern detection, anomaly alerts, and personalized savings suggestions tailored to your habits.",
    badge: "Intelligent",
    stat: "Daily insights",
    gradient: "from-violet-400 to-purple-500",
    glow: "rgba(168,85,247,0.18)",
    border: "rgba(168,85,247,0.14)",
    iconBg: "rgba(168,85,247,0.10)",
    badgeColor: "#c084fc",
  },
  {
    Icon: BarChart3,
    title: "Multi-Account View",
    description: "Manage checking, savings, and investment accounts side-by-side in a single unified dashboard.",
    badge: "Unified",
    stat: "Unlimited accounts",
    gradient: "from-blue-400 to-indigo-500",
    glow: "rgba(59,130,246,0.18)",
    border: "rgba(59,130,246,0.14)",
    iconBg: "rgba(59,130,246,0.10)",
    badgeColor: "#60a5fa",
  },
];

// ── 3D tilt hook ──────────────────────────────────────────────────────────
function use3DTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: x * 14, rotateX: -y * 14, scale: 1.03, duration: 0.32, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.55, ease: "elastic.out(1,0.5)" });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
}

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = React.useState(false);
  use3DTilt(cardRef);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0, rotateX: 18 },
      {
        y: 0, opacity: 1, rotateX: 0, duration: 0.72, ease: "power3.out",
        delay: index * 0.08,
        scrollTrigger: { trigger: cardRef.current, start: "top 88%", toggleActions: "play none none reverse" },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative group will-change-transform rounded-2xl overflow-hidden cursor-default"
      style={{ transformStyle: "preserve-3d" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow bloom behind card */}
      <div
        className="absolute -inset-1 rounded-2xl -z-10 blur-xl transition-opacity duration-400"
        style={{
          background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div
        className="relative h-full rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(14,20,40,0.95) 0%, rgba(8,12,28,0.98) 100%)",
          border: `1px solid ${hovered ? feature.border : "rgba(56,189,248,0.08)"}`,
          boxShadow: hovered
            ? `0 12px 50px ${feature.glow}, 0 2px 0 rgba(255,255,255,0.04) inset`
            : "0 4px 20px rgba(0,0,0,0.4)",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Top shimmer line */}
        <div
          className="absolute top-0 inset-x-0 h-px transition-all duration-400"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.badgeColor}, transparent)`,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scaleX(1)" : "scaleX(0.15)",
            transformOrigin: "center",
          }}
        />

        <div className="p-5 sm:p-6 relative z-10 flex flex-col h-full">
          {/* Icon + Badge */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: feature.iconBg,
                border: `1px solid ${feature.border}`,
                color: feature.badgeColor,
                boxShadow: hovered ? `0 0 16px ${feature.glow}` : "none",
              }}
            >
              <feature.Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full border tracking-wide"
              style={{
                background: `${feature.iconBg}`,
                border: `1px solid ${feature.border}`,
                color: feature.badgeColor,
                fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
              }}
            >
              {feature.badge}
            </span>
          </div>

          <h3
            className="text-sm sm:text-[15px] font-bold text-white/90 mb-2 leading-snug"
            style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
          >
            {feature.title}
          </h3>
          <p
            className="text-xs sm:text-[13px] leading-relaxed text-blue-200/40 mb-4 flex-1"
            style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}
          >
            {feature.description}
          </p>

          <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${feature.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: feature.badgeColor }} />
            <span
              className="text-[11px] font-semibold"
              style={{ color: feature.badgeColor, fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
            >
              {feature.stat}
            </span>
            <ArrowRight
              className="ml-auto w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-1"
              style={{ color: hovered ? feature.badgeColor : "rgba(100,130,180,0.30)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section 1: Features Grid ──────────────────────────────────────────────
function Section1Features() {
  const titleRef = useRef(null);
  const labelRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      [labelRef.current, titleRef.current],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.14, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 86%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      statsRef.current,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 90%", toggleActions: "play none none reverse" } }
    );
  }, []);

  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[380px] h-[380px] rounded-full" style={{ background: "rgba(14,165,233,0.06)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 -right-24 w-[320px] h-[320px] rounded-full" style={{ background: "rgba(99,102,241,0.05)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-16 left-1/3 w-[280px] h-[280px] rounded-full" style={{ background: "rgba(168,85,247,0.04)", filter: "blur(70px)" }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(56,189,248,1) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Label */}
        <div ref={labelRef} className="flex justify-center mb-4">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase text-cyan-400"
            style={{
              background: "rgba(34,211,238,0.07)",
              border: "1px solid rgba(34,211,238,0.20)",
              fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
            }}
          >
            <Sparkles className="w-3 h-3" /> Platform Features
          </span>
        </div>

        {/* Title */}
        <h2
          ref={titleRef}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4"
          style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
        >
          <span className="text-white/90">Everything you need to</span>{" "}
          <br className="hidden sm:block" />
          <span
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #60a5fa 45%, #818cf8 80%, #c084fc 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            manage your finances
          </span>
        </h2>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 py-8">
          {featuresData.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="mt-12 flex justify-center">
          <div
            className="flex items-center gap-8 sm:gap-14 px-7 py-4 rounded-2xl"
            style={{
              background: "rgba(14,20,40,0.80)",
              border: "1px solid rgba(56,189,248,0.12)",
              boxShadow: "0 4px 30px rgba(14,165,233,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {[["50K+", "Active Users"], ["$2B+", "Tracked"], ["4.9★", "Rating"]].map(([v, l], i) => (
              <div key={i} className="text-center">
                <div
                  className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
                >
                  {v}
                </div>
                <div className="text-[10px] mt-0.5 text-blue-300/40" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Dashboard Preview ───────────────────────────────────────────
function Section2Dashboard() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: leftRef.current, start: "top 78%", toggleActions: "play none none reverse" },
    });
    tl.fromTo(leftRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(rightRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

    ScrollTrigger.create({
      trigger: barRef.current, start: "top 85%",
      onEnter: () => gsap.to(barRef.current, { width: "16.3%", duration: 1.4, ease: "power3.out" }),
      onLeaveBack: () => gsap.to(barRef.current, { width: "0%", duration: 0.5 }),
    });
  }, []);

  const statCards = [
    { v: "$119K", l: "Total Balance", c: "#38bdf8" },
    { v: "$66.2K", l: "Monthly Income", c: "#34d399" },
    { v: "$22.5K", l: "Expenses", c: "#f87171" },
  ];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(59,130,246,0.05)", filter: "blur(90px)" }} />
        <div className="absolute bottom-0 left-10 w-[340px] h-[340px] rounded-full" style={{ background: "rgba(34,211,238,0.04)", filter: "blur(90px)" }} />
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div ref={leftRef}>
            <span
              className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase text-cyan-400 mb-5"
              style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.18)", fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
            >
              <BarChart3 className="w-3 h-3" /> Live Dashboard
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white/90 mb-4"
              style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
            >
              Your complete{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8 0%,#818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                financial command center
              </span>
            </h2>
            <p className="text-blue-200/45 text-sm leading-relaxed mb-6" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
              Monitor all your accounts, track every transaction, and visualise spending breakdowns in real time — all from one unified dashboard.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {statCards.map((s, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: "rgba(14,20,40,0.85)", border: "1px solid rgba(56,189,248,0.10)" }}>
                  <div className="text-base font-extrabold" style={{ color: s.c, fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>{s.v}</div>
                  <div className="text-[10px] text-blue-300/35 mt-0.5" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mock card */}
          <div ref={rightRef} className="relative mt-6 lg:mt-0">
            <div className="relative rounded-2xl p-5 sm:p-6 overflow-hidden"
              style={{ background: "rgba(10,16,38,0.90)", border: "1px solid rgba(56,189,248,0.12)", boxShadow: "0 8px 40px rgba(14,165,233,0.10)" }}>
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.04) 0%,transparent 60%)" }} />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-blue-300/40 mb-1" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>Default Account</div>
                  <div className="text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>Monthly Budget</div>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.22)" }}>N</div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-blue-300/40 mb-2" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
                  <span>$13,071.11 spent</span>
                  <span className="text-blue-300/25">of $80,000.00</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(14,20,40,0.9)" }}>
                  <div ref={barRef} className="h-full rounded-full" style={{
                    width: "0%",
                    background: "linear-gradient(90deg,#0ea5e9 0%,#818cf8 100%)",
                    boxShadow: "0 0 12px rgba(14,165,233,0.45)",
                  }} />
                </div>
                <div className="text-right text-[10px] text-blue-300/30 mt-1" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>16.3% used</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center gap-1"
              style={{ background: "rgba(8,12,28,0.95)", border: "1px dashed rgba(56,189,248,0.18)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
              <Plus className="w-4 h-4 text-blue-400/50" />
              <span className="text-[9px] text-blue-300/35 text-center leading-tight" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>Add New Account</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Transactions Preview ───────────────────────────────────────
function Section3Transactions() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: leftRef.current, start: "top 80%", toggleActions: "play none none reverse" },
    });
    tl.fromTo(leftRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: "power3.out" })
      .fromTo(rightRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, "-=0.55");
  }, []);

  const txRows = [
    { date: "Feb 20, 2026", desc: "Received salary", cat: "Salary", catStyle: { background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" }, amt: "+$5,951.79", amtColor: "#34d399" },
    { date: "Feb 20, 2026", desc: "Paid for healthcare", cat: "Healthcare", catStyle: { background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.22)", color: "#f87171" }, amt: "-$558.23", amtColor: "#f87171" },
    { date: "Feb 20, 2026", desc: "Paid for housing", cat: "Housing", catStyle: { background: "rgba(251,146,60,0.10)", border: "1px solid rgba(251,146,60,0.22)", color: "#fb923c" }, amt: "-$1,121.02", amtColor: "#f87171" },
  ];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[380px] h-[380px] rounded-full" style={{ background: "rgba(99,102,241,0.05)", filter: "blur(90px)" }} />
        <div className="absolute bottom-10 right-0 w-[320px] h-[320px] rounded-full" style={{ background: "rgba(168,85,247,0.04)", filter: "blur(90px)" }} />
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left */}
          <div ref={leftRef} className="lg:pt-6">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase text-violet-400 mb-5"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.20)", fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
            >
              <Zap className="w-3 h-3" /> Smart Transactions
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white/90 mb-4"
              style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
            >
              Add & track every{" "}
              <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                transaction instantly
              </span>
            </h2>
            <p className="text-blue-200/40 text-sm leading-relaxed mb-8" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
              Scan receipts with AI, log manual transactions, or set up recurring payments — all in seconds. Every cent tracked, every pattern understood.
            </p>
            <div className="space-y-3">
              {[
                { icon: Camera, title: "AI Receipt Scan", desc: "Snap a photo, AI extracts all data automatically", color: "#c084fc", border: "rgba(168,85,247,0.20)", bg: "rgba(168,85,247,0.08)" },
                { icon: Receipt, title: "Recurring Transactions", desc: "Set up automatic recurring income or expense entries", color: "#f472b6", border: "rgba(244,114,182,0.20)", bg: "rgba(244,114,182,0.08)" },
                { icon: BarChart3, title: "Category Analytics", desc: "Auto-categorised with AI for instant spending insights", color: "#60a5fa", border: "rgba(96,165,250,0.20)", bg: "rgba(96,165,250,0.08)" },
              ].map((item, i) => (
                <div key={i}
                  className="flex gap-3 items-start p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "rgba(10,16,38,0.80)", border: "1px solid rgba(56,189,248,0.09)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: item.bg, border: `1px solid ${item.border}`, color: item.color }}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/85 mb-0.5" style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>{item.title}</div>
                    <div className="text-xs text-blue-200/40" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mock UI */}
          <div ref={rightRef} className="space-y-3">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(10,16,38,0.90)", border: "1px solid rgba(56,189,248,0.12)", boxShadow: "0 8px 40px rgba(14,165,233,0.08)" }}>
              <div className="px-5 pt-5 pb-4">
                <h3 className="text-lg font-extrabold mb-4"
                  style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)", background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Add Transaction
                </h3>
                <button className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 mb-4 transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#f97316 0%,#ec4899 100%)", boxShadow: "0 4px 20px rgba(249,115,22,0.25)" }}>
                  <Camera className="w-4 h-4" /> Scan Receipt with AI
                </button>
                <div className="space-y-2">
                  {["Expense", "0.00", "Select category"].map((ph, i) => (
                    <div key={i} className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                      style={{ background: "rgba(8,12,28,0.80)", border: "1px solid rgba(56,189,248,0.09)" }}>
                      <span className="text-sm text-blue-200/35" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{ph}</span>
                      <ChevronDown className="w-4 h-4 text-blue-300/25" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                <button className="py-2.5 rounded-xl text-sm font-semibold text-blue-300/60 transition-all hover:bg-blue-400/08"
                  style={{ border: "1px solid rgba(56,189,248,0.12)" }}>Cancel</button>
                <Link href="/transaction/create">
                  <Button3D variant="primary" size="sm" className="w-full justify-center">Create Transaction</Button3D>
                </Link>
              </div>
            </div>

            {/* Transaction list */}
            <div className="rounded-2xl overflow-hidden hidden sm:block"
              style={{ background: "rgba(10,16,38,0.90)", border: "1px solid rgba(56,189,248,0.10)" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(56,189,248,0.07)" }}>
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(8,12,28,0.80)", border: "1px solid rgba(56,189,248,0.08)" }}>
                  <Search className="w-3.5 h-3.5 text-blue-300/30" />
                  <span className="text-xs text-blue-200/30" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>Search transactions…</span>
                </div>
              </div>
              {txRows.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b hover:bg-blue-400/[0.025] transition-colors"
                  style={{ borderColor: "rgba(56,189,248,0.05)" }}>
                  <CheckSquare className="w-3.5 h-3.5 text-blue-300/20 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-blue-200/30">{tx.date}</div>
                    <div className="text-xs font-medium text-white/70 truncate">{tx.desc}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ ...tx.catStyle, fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
                    {tx.cat}
                  </span>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: tx.amtColor, fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>{tx.amt}</span>
                  <div className="hidden lg:flex items-center gap-1 text-[10px] text-blue-200/25">
                    <Clock className="w-2.5 h-2.5" /> One-time
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AllFeatureSections() {
  return (
    <>
      <Section1Features />
      <Section2Dashboard />
      <Section3Transactions />
    </>
  );
}