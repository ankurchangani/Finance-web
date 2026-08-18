"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Entrance animation sequence
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
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
          { opacity: 0, y: 60, scale: 0.92, rotateX: 20 },
          { opacity: 1, y: 0, scale: 1, rotateX: 12, duration: 1, ease: "power2.out" },
          "-=0.5"
        );

      // Scroll reactive tilt effect for image
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        if (imageRef.current) {
          const rotateAmount = Math.max(0, 12 - scrollPosition * 0.04);
          const translateYAmount = Math.min(40, scrollPosition * 0.08);
          gsap.to(imageRef.current, {
            rotateX: rotateAmount,
            y: translateYAmount,
            duration: 0.3,
            ease: "power1.out",
          });
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Interactive 3D mouse move tilt on banner
  const handleMouseMove = (e) => {
    if (!imageWrapperRef.current) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(imageRef.current, {
      rotateY: x * 0.02,
      rotateX: 10 - y * 0.02,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 12,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden"
    >
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto text-center max-w-7xl relative z-10">
        {/* Floating AI Pill Badge */}
        <div ref={badgeRef} className="inline-flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-cyan-500/30 shadow-[0_0_20px_rgba(34,189,253,0.15)] text-cyan-300 text-xs sm:text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen AI Financial Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
        </div>

        {/* Hero Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] tracking-tight pb-4 sm:pb-6 gradient-title animate-gradient"
        >
          Manage Your Finances <br className="hidden sm:block" />
          with Intelligence
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed"
        >
          An AI-powered financial platform that tracks spending, analyzes cashflow,
          and delivers real-time smart predictions to supercharge your wealth.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(34,189,253,0.35)] hover:shadow-[0_0_45px_rgba(34,189,253,0.6)] transition-all duration-300 rounded-xl group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/features">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-white/10 hover:border-cyan-500/40 bg-white/[0.02] hover:bg-white/[0.06] text-gray-200 rounded-xl transition-all duration-300"
            >
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-400 mb-12">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Bank-Grade Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" /> Instant Setup
          </span>
        </div>

        {/* Hero Image Container with GSAP 3D Tilt */}
        <div
          ref={imageWrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="perspective-1000 overflow-visible"
        >
          <div
            ref={imageRef}
            className="relative rounded-2xl p-2 bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_30px_100px_rgba(34,189,253,0.25)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Finovexa Dashboard Preview"
              className="rounded-xl mx-auto w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-auto border border-white/10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
