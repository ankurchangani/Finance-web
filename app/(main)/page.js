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
} from "@/data/landing";
import { ArrowRight, Star } from "lucide-react";

const LandingPage = () => {
  const containerRef = useRef(null);
  const statsRef = useRef([]);
  const stepsRef = useRef([]);
  const testimonialsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Stats Cards Animation
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "#stats-section",
            start: "top 85%",
          },
        }
      );

      // 2. How It Works Steps
      gsap.fromTo(
        stepsRef.current,
        { opacity: 0, y: 50, rotateY: -10 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#how-it-works-section",
            start: "top 80%",
          },
        }
      );

      // 3. Testimonials Cards
      gsap.fromTo(
        testimonialsRef.current,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#testimonials-section",
            start: "top 80%",
          },
        }
      );

      // 4. CTA Box Pulse & Reveal
      gsap.fromTo(
        "#cta-box",
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
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
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      <HeroSection />

      {/* ── Stats Section ── */}
      <section
        id="stats-section"
        className="py-12 sm:py-16 md:py-24 bg-background relative border-y border-white/[0.05]"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                ref={(el) => (statsRef.current[index] = el)}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-cyan-500/10 hover:border-cyan-500/30 transition-colors shadow-lg backdrop-blur-sm"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,189,253,0.4)]">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-400 tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section
        id="how-it-works-section"
        className="py-16 sm:py-20 md:py-28 bg-background relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4">
            How Finovexa Works
          </h2>
          <p className="text-center text-gray-400 max-w-xl mx-auto mb-14 text-sm sm:text-base">
            Get automated intelligence for your accounts in three seamless steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            {howItWorksData.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className="group relative text-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all duration-300 shadow-xl"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_30px_rgba(34,189,253,0.2)] group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                <span className="inline-block text-xs font-bold text-cyan-400 tracking-widest uppercase mb-2">
                  Step 0{index + 1}
                </span>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
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
        className="py-16 sm:py-20 md:py-28 bg-background relative border-t border-white/[0.05]"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4">
            Loved by Smart Investors
          </h2>
          <p className="text-center text-gray-400 max-w-xl mx-auto mb-14 text-sm sm:text-base">
            See how professionals and users scale their savings with Finovexa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                ref={(el) => (testimonialsRef.current[index] = el)}
              >
                <Card className="p-6 bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-2 h-full shadow-lg">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed italic">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 border border-cyan-400/40 object-cover"
                      />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-gray-400">
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
      <section id="cta-section" className="py-16 sm:py-24 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div
            id="cta-box"
            className="rounded-3xl p-8 sm:p-14 text-center bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/30 shadow-[0_0_60px_rgba(34,189,253,0.15)] relative overflow-hidden"
          >
            {/* Glow orb */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Ready to Master Your Financial Future?
            </h2>

            <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of individuals using Finovexa to track expenses, automate savings, and optimize cashflow.
            </p>

            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white shadow-[0_0_35px_rgba(34,189,253,0.4)] transition-all duration-300 rounded-xl group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
