"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/hero";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  howItWorksData,
  statsData,
  testimonialsData,
  featuresData,
} from "@/data/landing";
import { ArrowRight, Star, Sparkles } from "lucide-react";

const LandingPage = () => {
  const containerRef = useRef(null);
  const statsRef = useRef([]);
  const featuresRef = useRef([]);
  const stepsRef = useRef([]);
  const testimonialsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Stats Animation
      if (statsRef.current.length > 0) {
        gsap.fromTo(
          statsRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: "#stats-section",
              start: "top 85%",
            },
          }
        );
      }

      // 2. Features Animation
      if (featuresRef.current.length > 0) {
        gsap.fromTo(
          featuresRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#features-section",
              start: "top 80%",
            },
          }
        );
      }

      // 3. How It Works Steps
      if (stepsRef.current.length > 0) {
        gsap.fromTo(
          stepsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#how-it-works-section",
              start: "top 80%",
            },
          }
        );
      }

      // 4. Testimonials Animation
      if (testimonialsRef.current.length > 0) {
        gsap.fromTo(
          testimonialsRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#testimonials-section",
              start: "top 80%",
            },
          }
        );
      }

      // 5. CTA Box Animation
      gsap.fromTo(
        "#cta-box",
        { opacity: 0, scale: 0.96, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#cta-section",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080810] text-slate-100 overflow-hidden font-sans">
      <HeroSection />

      {/* ── Stats Section ── */}
      <section
        id="stats-section"
        className="py-12 sm:py-16 md:py-20 bg-[#080810] relative border-y border-slate-800/80"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                ref={(el) => (statsRef.current[index] = el)}
                className="text-center p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-xl backdrop-blur-xl group hover:scale-[1.02]"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-400 tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Features Section ── */}
      <section
        id="features-section"
        className="py-16 sm:py-24 md:py-32 bg-[#080810] relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Everything You Need
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Engineered for Wealth Creation
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Powerful AI technology designed to track every transaction, predict future cashflows, and maximize net savings effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuresData.map((feature, index) => {
              const IconComp = feature.Icon;
              return (
                <div
                  key={index}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className="group relative"
                >
                  <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-xl space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${feature.bgClass} ${feature.borderClass} border ${feature.colorClass}`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                          {feature.badge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                      <span className={`${feature.statColor} font-bold`}>{feature.stat}</span>
                      <span className="text-slate-500 flex items-center gap-1 group-hover:text-slate-300 transition-colors">
                        Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section
        id="how-it-works-section"
        className="py-16 sm:py-24 md:py-28 bg-[#080810] relative border-t border-slate-800/80"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              How Finovexa Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Get automated financial intelligence for your accounts in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className="group relative text-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 shadow-xl"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_30px_rgba(34,189,253,0.15)] group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                <span className="inline-block text-xs font-extrabold text-cyan-400 tracking-widest uppercase mb-2">
                  Step 0{index + 1}
                </span>

                <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section
        id="testimonials-section"
        className="py-16 sm:py-24 md:py-28 bg-[#080810] relative border-t border-slate-800/80"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Loved by Smart Investors
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              See how professionals and users scale their savings with Finovexa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                ref={(el) => (testimonialsRef.current[index] = el)}
              >
                <Card className="p-7 bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 h-full shadow-xl">
                  <CardContent className="p-0 space-y-5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    <div className="flex items-center gap-3.5 pt-3 border-t border-slate-800/80">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={44}
                        height={44}
                        className="rounded-full w-11 h-11 border border-cyan-400/40 object-cover"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-100">
                          {testimonial.name}
                        </div>
                        <div className="text-xs font-medium text-slate-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section id="cta-section" className="py-16 sm:py-24 bg-[#080810] relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div
            id="cta-box"
            className="rounded-3xl p-8 sm:p-14 text-center bg-gradient-to-r from-violet-950/40 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 shadow-[0_0_80px_rgba(34,189,253,0.15)] relative overflow-hidden backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Ready to Master Your Financial Future?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of smart individuals using Finovexa to track expenses, automate savings, and optimize cashflow.
            </p>

            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-white shadow-[0_0_35px_rgba(34,189,253,0.4)] transition-all duration-300 rounded-xl group hover:scale-[1.02]"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
