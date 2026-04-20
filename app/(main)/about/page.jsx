"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button3D from "@/components/Button3d";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function useReveal(ref, opts = {}) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { y: opts.y ?? 50, opacity: 0, rotateX: opts.rotateX ?? 0 },
      { y: 0, opacity: 1, rotateX: 0,
        duration: opts.duration ?? 0.8, ease: opts.ease ?? "power3.out", delay: opts.delay ?? 0,
        scrollTrigger: { trigger: ref.current, start: "top 84%", toggleActions: "play none none reverse" } }
    );
  }, []);
}

const AboutPage = () => {
  const heroCardRef = useRef(null);
  const heroIconRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const whoTextRef = useRef(null);
  const whoImgRef = useRef(null);
  const featGridRef = useRef(null);
  const howRef = useRef(null);
  const ctaRef = useRef(null);

  useReveal(heroCardRef, { y: 70, rotateX: 14, duration: 1 });
  useReveal(missionRef, { delay: 0 });
  useReveal(visionRef, { delay: 0.12 });
  useReveal(whoTextRef, { y: 40 });
  useReveal(whoImgRef, { y: 40, delay: 0.1 });
  useReveal(ctaRef, { y: 30 });

  // Float loop for brain icon
  useEffect(() => {
    if (!heroIconRef.current) return;
    gsap.to(heroIconRef.current, { y: -12, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }, []);

  // Feature grid stagger
  useEffect(() => {
    if (!featGridRef.current) return;
    const cards = featGridRef.current.querySelectorAll("[data-card]");
    gsap.fromTo(cards,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.09, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: featGridRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
    );
  }, []);

  // Steps stagger
  useEffect(() => {
    if (!howRef.current) return;
    const steps = howRef.current.querySelectorAll("[data-step]");
    gsap.fromTo(steps,
      { y: 50, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: "back.out(1.4)",
        scrollTrigger: { trigger: howRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
    );
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>

      {/* ── Hero AI Section ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "linear-gradient(180deg,hsl(222,47%,4%) 0%,hsl(222,47%,6%) 100%)" }}>
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,rgba(56,189,248,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Glow */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(14,165,233,0.10) 0%,transparent 65%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div ref={heroCardRef} className="relative max-w-3xl mx-auto will-change-transform" style={{ transformPerspective: 800 }}>
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%,rgba(14,165,233,0.18) 0%,transparent 65%)", filter: "blur(32px)" }} />

            <div className="relative rounded-3xl p-8 sm:p-12 text-center"
              style={{
                background: "rgba(10,16,38,0.90)",
                border: "1px solid rgba(56,189,248,0.14)",
                boxShadow: "0 20px 80px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}>
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.04) 0%,transparent 50%)" }} />

              <div ref={heroIconRef} className="flex items-center justify-center mb-6 will-change-transform">
                <Brain className="w-14 h-14 sm:w-20 sm:h-20 text-cyan-400" style={{ filter: "drop-shadow(0 0 16px rgba(34,211,238,0.50))" }} />
              </div>

              <div className="flex items-center justify-center space-x-4 mb-5">
                {[
                  { size: "w-10 h-10", border: "rgba(14,165,233,0.50)", ping: true },
                  { size: "w-14 h-14", border: "rgba(99,102,241,0.55)", ping: false },
                  { size: "w-10 h-10", border: "rgba(14,165,233,0.50)", ping: true, delay: true },
                ].map((ring, i) => (
                  <div
                    key={i}
                    className={`${ring.size} rounded-full`}
                    style={{
                      background: "rgba(14,165,233,0.06)",
                      border: `1.5px solid ${ring.border}`,
                      animation: ring.ping
                        ? "ping 2s cubic-bezier(0,0,0.2,1) infinite"
                        : "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                      animationDelay: ring.delay ? "0.35s" : "0s",
                    }}
                  />
                ))}
              </div>

              <p className="text-lg sm:text-xl text-white/80 font-semibold mb-3"
                style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
                AI-Powered Financial Intelligence
              </p>
              <p className="text-sm text-blue-200/45 max-w-xl mx-auto leading-relaxed"
                style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
                Advanced machine learning algorithms analyze your spending patterns and provide personalized insights to help you make smarter financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-16 grid sm:grid-cols-2 gap-5 sm:gap-8 max-w-7xl mx-auto">
        <GlassCard
          ref={missionRef}
          label="Our Mission"
          labelGradient="linear-gradient(135deg,#38bdf8,#60a5fa)"
          glowColor="rgba(14,165,233,0.15)"
          borderHover="rgba(56,189,248,0.25)"
          text="Our mission is to simplify money management using automation, AI insights and a user-friendly experience so everyone can take control of their finances."
        />
        <GlassCard
          ref={visionRef}
          label="Our Vision"
          labelGradient="linear-gradient(135deg,#818cf8,#c084fc)"
          glowColor="rgba(99,102,241,0.15)"
          borderHover="rgba(99,102,241,0.25)"
          text="We envision a world where AI acts as your personal financial advisor — helping you make smarter decisions and achieve financial freedom."
        />
      </section>

      {/* ── Who We Are ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-8"
          style={{
            fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
            background: "linear-gradient(135deg,#e0f2fe 0%,#38bdf8 60%,#818cf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
          Who We Are
        </h2>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div ref={whoImgRef} className="w-full overflow-hidden rounded-2xl will-change-transform"
            style={{ border: "1px solid rgba(56,189,248,0.10)", boxShadow: "0 8px 40px rgba(14,165,233,0.08)" }}>
            <Image
              src="/about.jpg" alt="About Finovexa"
              width={600} height={400}
              className="rounded-2xl w-full h-52 sm:h-64 md:h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div ref={whoTextRef} className="space-y-4">
            {[
              "We are a new-generation fintech team focused on building intelligent financial tools powered by Artificial Intelligence.",
              "Our platform is designed for students, professionals, freelancers and businesses who want complete visibility and control.",
              "We provide intelligent insights, smart alerts and personalized recommendations.",
            ].map((text, i) => (
              <p key={i}
                className="text-sm sm:text-base lg:text-[15px] text-blue-200/45 leading-relaxed hover:text-blue-200/70 transition-colors duration-300"
                style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-center mb-10 text-white/85"
          style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
          Everything you need to manage your finances
        </h2>

        <div ref={featGridRef}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 p-5 sm:p-8 rounded-2xl"
          style={{ background: "rgba(10,16,38,0.70)", border: "1px solid rgba(56,189,248,0.09)" }}>
          {[
            { name: "Expense & Income Tracking", color: "#38bdf8" },
            { name: "AI Receipt Scanner", color: "#818cf8" },
            { name: "Smart Analytics Dashboard", color: "#34d399" },
            { name: "Recurring Transactions", color: "#60a5fa" },
            { name: "Monthly Budget Planning", color: "#c084fc" },
            { name: "Secure Cloud Storage", color: "#f472b6" },
          ].map((item, i) => (
            <div
              key={i}
              data-card
              className="group relative p-5 sm:p-6 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ background: "rgba(8,12,28,0.80)", border: "1px solid rgba(56,189,248,0.08)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${item.color}33`;
                e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 className="text-sm sm:text-base font-semibold mb-2 transition-colors"
                style={{ color: item.color, fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
                {item.name}
              </h3>
              <p className="text-xs text-blue-200/35 group-hover:text-blue-200/55 transition-colors"
                style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
                Powerful tools to manage and monitor your financial activity easily.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-center mb-10 text-white/85"
          style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
          How It Works
        </h2>
        <div ref={howRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 text-center">
          {["Create Account", "Add Transactions", "Analyze Reports", "Improve Spending"].map((step, i) => (
            <StepCard key={i} step={step} num={i + 1} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-14 sm:py-20 px-4 sm:px-6 text-center will-change-transform">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 text-white/90"
          style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
          Start Managing Your Finances Smarter Today
        </h2>
        <p className="text-blue-200/45 text-sm sm:text-base mb-8 max-w-sm mx-auto"
          style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
          Take full control of your income, expenses and savings with AI.
        </p>
        <Link href="/dashboard">
          <Button3D variant="primary" size="lg">Get Started Free</Button3D>
        </Link>
      </section>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

const GlassCard = React.forwardRef(({ label, labelGradient, glowColor, borderHover, text }, ref) => {
  const onEnter = (e) => gsap.to(e.currentTarget, { y: -6, scale: 1.02, duration: 0.28, ease: "power2.out" });
  const onLeave = (e) => gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" });

  return (
    <div
      ref={ref}
      className="relative group rounded-2xl p-6 sm:p-8 cursor-pointer will-change-transform"
      style={{ background: "rgba(10,16,38,0.80)", border: "1px solid rgba(56,189,248,0.10)", boxShadow: "0 4px 24px rgba(14,165,233,0.06)" }}
      onMouseEnter={(e) => {
        onEnter(e);
        e.currentTarget.style.borderColor = borderHover;
        e.currentTarget.style.boxShadow = `0 12px 48px ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        onLeave(e);
        e.currentTarget.style.borderColor = "rgba(56,189,248,0.10)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(14,165,233,0.06)";
      }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at top left,${glowColor} 0%,transparent 60%)` }} />
      <h2
        className="relative text-xl sm:text-2xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)", background: labelGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
      >
        {label}
      </h2>
      <p className="relative text-sm sm:text-[15px] text-blue-200/45 leading-relaxed"
        style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{text}</p>
    </div>
  );
});
GlassCard.displayName = "GlassCard";

function StepCard({ step, num }) {
  const ref = useRef(null);
  const onEnter = () => gsap.to(ref.current, { y: -8, scale: 1.05, duration: 0.26, ease: "power2.out" });
  const onLeave = () => gsap.to(ref.current, { y: 0, scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" });

  return (
    <div
      ref={ref}
      data-step
      className="group p-4 sm:p-6 rounded-xl text-center cursor-pointer will-change-transform relative"
      style={{ background: "rgba(10,16,38,0.80)", border: "1px solid rgba(56,189,248,0.09)" }}
      onMouseEnter={(e) => {
        onEnter();
        e.currentTarget.style.borderColor = "rgba(56,189,248,0.24)";
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(14,165,233,0.12)";
      }}
      onMouseLeave={(e) => {
        onLeave();
        e.currentTarget.style.borderColor = "rgba(56,189,248,0.09)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="text-2xl sm:text-3xl font-extrabold mb-3"
        style={{
          fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
          background: "linear-gradient(135deg,#38bdf8,#818cf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}
      >
        {num}
      </div>
      <h3 className="text-sm sm:text-base text-blue-200/55 group-hover:text-white/80 transition-colors"
        style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{step}</h3>
    </div>
  );
}

export default AboutPage;