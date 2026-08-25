"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";
import { Sparkles, ArrowRight, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          imageWrapperRef.current,
          { opacity: 0, y: 50, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power2.out" },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // ⚡ Silky Smooth 60fps Mouse Movement with requestAnimationFrame
  const handleMouseMove = (e) => {
    if (!imageWrapperRef.current || !imageRef.current) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      gsap.to(imageRef.current, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-[#080810] text-slate-100 overflow-hidden"
    >
      {/* Background Glow Spheres */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/20 via-violet-600/20 to-purple-600/10 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto text-center max-w-7xl relative z-10">
        {/* Floating AI Pill Badge */}
        <div ref={badgeRef} className="inline-flex items-center justify-center mb-6">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(34,189,253,0.2)] text-cyan-300 text-xs sm:text-sm font-semibold backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen AI Financial Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
        </div>

        {/* Hero Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.06] tracking-tight pb-4 sm:pb-6 bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent"
        >
          Manage Your Finances <br className="hidden sm:block" />
          with <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed font-normal"
        >
          An AI-driven platform that automatically categorizes transactions, analyzes cashflow, and predicts future savings to supercharge your wealth.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-white shadow-[0_0_35px_rgba(34,189,253,0.4)] hover:shadow-[0_0_50px_rgba(34,189,253,0.6)] transition-all duration-300 rounded-xl group hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </Link>

          <Link href="/features">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-bold border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-xl transition-all duration-300 backdrop-blur-md"
            >
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 mb-14 font-medium">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Bank-Grade Encryption
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
            <Zap className="w-4 h-4 text-purple-400" /> Instant Setup
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Trial
          </span>
        </div>

        {/* Hero Image Container with Smooth 3D Tilt & Floating AI Badges */}
        <div
          ref={imageWrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-5xl mx-auto perspective-1000 transform-gpu"
        >
          {/* Floating Widget 1 - Top Left */}
          <div className="hidden lg:flex absolute -top-6 -left-8 z-30 items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl shadow-black/80 animate-bounce-slow">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Monthly Income</p>
              <p className="text-sm font-extrabold text-emerald-400">+₹54,200 <span className="text-[10px] text-emerald-300 font-normal">(+14%)</span></p>
            </div>
          </div>

          {/* Floating Widget 2 - Bottom Right */}
          <div className="hidden lg:flex absolute -bottom-6 -right-8 z-30 items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-violet-500/30 backdrop-blur-xl shadow-2xl shadow-black/80">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Recommendation</p>
              <p className="text-sm font-extrabold text-violet-300">Saved ₹12,500 this month 🎉</p>
            </div>
          </div>

          <div
            ref={imageRef}
            className="relative rounded-3xl p-2.5 bg-gradient-to-b from-cyan-500/30 via-violet-500/20 to-transparent border border-cyan-500/30 shadow-[0_30px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-transform duration-200 ease-out transform-gpu"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Finovexa Dashboard Preview"
              className="rounded-2xl mx-auto w-full h-auto border border-slate-700/60 shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
