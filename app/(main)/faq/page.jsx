"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      { q: "What is Finovexa and how does it work?", a: "Finovexa is an AI-powered financial management platform that helps you track, analyze, and optimize your spending in real time. Simply connect your accounts, log transactions, and let our intelligent engine surface insights, budget alerts, and savings opportunities — all from one sleek dashboard." },
      { q: "How do I add my first transaction?", a: 'Click the "Add Transaction" button in the header. You can manually enter details like type, amount, category, date, and description — or use the AI-powered "Scan Receipt" feature to auto-fill everything instantly from a photo of your receipt.' },
      { q: "Can I set up recurring transactions?", a: 'Yes! When creating a transaction, toggle on "Recurring Transaction" and choose your schedule (daily, weekly, monthly). Finovexa will automatically log and track these so your dashboard always stays accurate without manual effort.' },
    ],
  },
  {
    category: "Dashboard & Analytics",
    icon: "📊",
    items: [
      { q: "What does the Dashboard show me?", a: "Your Dashboard gives you a real-time financial snapshot: monthly budget progress, recent transactions, a pie chart of expense categories, account balances, and income vs. expense totals. Everything updates live as you add or edit transactions." },
      { q: "How is the Monthly Expense Breakdown calculated?", a: "The pie chart aggregates all your expenses for the current month, grouped by category. Hover over any slice to see the exact amount. You can filter by account using the dropdown on the Recent Transactions panel." },
      { q: "Can I view transactions for a specific time period?", a: "Absolutely. On the Account detail page, use the time filter to zoom into any period. The bar chart and transaction table both update instantly to reflect your selected range." },
    ],
  },
  {
    category: "Accounts & Security",
    icon: "🔐",
    items: [
      { q: "How do I add a new account?", a: 'From the Dashboard, scroll to the Accounts section and click "Add New Account". Enter your account name, type, and starting balance. You can manage multiple accounts and toggle them on or off in your overview.' },
      { q: "Is my financial data safe with Finovexa?", a: "Security is our top priority. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Authentication is handled by Clerk, providing enterprise-grade protection including MFA, session management, and anomaly detection." },
      { q: "Can I delete or edit a transaction after creating it?", a: "Yes. On the Account transactions page, click the ··· menu on any transaction row to edit details or delete it entirely. Changes reflect immediately across your dashboard, budget tracker, and expense charts." },
    ],
  },
  {
    category: "AI Features",
    icon: "🤖",
    items: [
      { q: "How does the AI receipt scanner work?", a: 'Tap "Scan Receipt with AI" and upload or photograph your receipt. Our vision model extracts the merchant, amount, date, and suggested category automatically. You review, confirm, and save — cutting manual entry time to near zero.' },
      { q: "Does Finovexa provide financial advice?", a: "Finovexa surfaces data-driven insights — like overspending alerts in a category or positive savings trends — but does not provide regulated financial advice. Always consult a certified financial planner for personalized guidance." },
      { q: "What AI model powers Finovexa's insights?", a: "Finovexa uses a combination of classification models for transaction categorization and large language models for natural language insights and receipt parsing. The system continuously improves based on anonymized, aggregated usage patterns." },
    ],
  },
];

const stats = [
  { val: "50K+", label: "Active Users" },
  { val: "$2B+", label: "Tracked" },
  { val: "99.9%", label: "Uptime" },
  { val: "4.9/5", label: "Rating" },
];

// ── Accordion Item ─────────────────────────────────────────────────────────
function AccordionItem({ faq, index, globalIdx, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const contentRef = useRef(null);
  const itemRef = useRef(null);
  const chevronRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    const content = contentRef.current;
    if (!body || !content) return;
    if (isOpen) {
      gsap.fromTo(body, { height: 0, opacity: 0 }, { height: content.scrollHeight, opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(chevronRef.current, { rotate: 180, duration: 0.32, ease: "power2.out" });
    } else {
      gsap.to(body, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in" });
      gsap.to(chevronRef.current, { rotate: 0, duration: 0.28, ease: "power2.in" });
    }
  }, [isOpen]);

  useEffect(() => {
    gsap.fromTo(itemRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: index * 0.07,
        scrollTrigger: { trigger: itemRef.current, start: "top 90%", toggleActions: "play none none reverse" } }
    );
  }, [index]);

  return (
    <div
      ref={itemRef}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen ? "rgba(10,16,40,0.95)" : "rgba(8,12,28,0.80)",
        border: isOpen ? "1px solid rgba(56,189,248,0.22)" : "1px solid rgba(56,189,248,0.07)",
        boxShadow: isOpen ? "0 6px 32px rgba(14,165,233,0.10), 0 0 0 1px rgba(56,189,248,0.06)" : "none",
      }}
    >
      <button onClick={() => onToggle(globalIdx)} className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left">
        <div className="flex items-start gap-3">
          <span
            className="text-[11px] mt-0.5 min-w-[24px] flex-shrink-0 transition-opacity duration-200"
            style={{ color: isOpen ? "#38bdf8" : "rgba(56,189,248,0.30)", fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}
          >
            0{index + 1}
          </span>
          <span
            className="text-sm font-semibold leading-snug transition-colors duration-200"
            style={{ color: isOpen ? "#e0f2fe" : "rgba(186,230,255,0.60)", fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}
          >
            {faq.q}
          </span>
        </div>
        <span
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300"
          style={{ background: isOpen ? "rgba(14,165,233,0.12)" : "rgba(56,189,248,0.05)" }}
        >
          <svg ref={chevronRef} width="13" height="13" viewBox="0 0 24 24" fill="none"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ stroke: isOpen ? "#38bdf8" : "rgba(56,189,248,0.30)" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div ref={contentRef} className="px-5 pb-5 pl-14 border-t" style={{ borderColor: "rgba(56,189,248,0.08)" }}>
          <p className="text-sm leading-relaxed text-blue-200/45 pt-4" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main FAQ Section ───────────────────────────────────────────────────────
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);
  const currentFAQs = faqs[activeCategory].items;
  const globalOffset = faqs.slice(0, activeCategory).reduce((s, f) => s + f.items.length, 0);

  useEffect(() => {
    if (headerRef.current?.children) {
      gsap.fromTo(
        Array.from(headerRef.current.children),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
      );
    }
    if (statsRef.current?.children) {
      gsap.fromTo(
        Array.from(statsRef.current.children),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 88%", toggleActions: "play none none reverse" } }
      );
    }
    gsap.fromTo(ctaRef.current, { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 90%", toggleActions: "play none none reverse" } }
    );
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(14,165,233,0.04)", filter: "blur(100px)" }} />
        <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] rounded-full" style={{ background: "rgba(99,102,241,0.04)", filter: "blur(100px)" }} />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">

        {/* Header block */}
        <div ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ border: "1px solid rgba(34,211,238,0.22)", background: "rgba(34,211,238,0.06)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: "0 0 8px #22d3ee" }} />
            <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400"
              style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
              Help Center
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
            <span className="text-white/90">Frequently</span>{" "}
            <span
              style={{ background: "linear-gradient(135deg,#38bdf8 0%,#818cf8 55%,#c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Asked Questions
            </span>
          </h2>

          <p className="text-blue-200/45 text-sm sm:text-base leading-relaxed max-w-lg mb-10"
            style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
            Everything you need to know about managing your finances with Finovexa.
            Can't find the answer? Reach out to our support team.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="flex flex-wrap gap-8 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
                  background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{s.val}</span>
              <span className="text-[11px] uppercase tracking-widest text-blue-300/35"
                style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-6 sm:gap-8 items-start">

          {/* Sidebar */}
          <div className="flex flex-row flex-wrap md:flex-col gap-2 md:sticky md:top-24">
            {faqs.map((cat, i) => (
              <CategoryBtn
                key={cat.category}
                cat={cat}
                active={activeCategory === i}
                onClick={() => { setActiveCategory(i); setOpenIndex(null); }}
              />
            ))}
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-2">
            {currentFAQs.map((faq, i) => {
              const globalIdx = globalOffset + i;
              return (
                <AccordionItem
                  key={globalIdx}
                  faq={faq}
                  index={i}
                  globalIdx={globalIdx}
                  isOpen={openIndex === globalIdx}
                  onToggle={toggle}
                />
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mt-14 relative overflow-hidden rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{
            background: "linear-gradient(135deg,rgba(10,16,38,0.95) 0%,rgba(14,20,48,0.95) 100%)",
            border: "1px solid rgba(56,189,248,0.12)",
            boxShadow: "0 8px 40px rgba(14,165,233,0.08)",
          }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 70%)", filter: "blur(28px)" }} />
          <div className="relative">
            <h3 className="text-lg font-bold mb-1.5 text-white/85"
              style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)" }}>
              Still have questions?
            </h3>
            <p className="text-sm text-blue-200/40" style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
              Our support team is available 24/7 to help you get the most out of Finovexa.
            </p>
          </div>
          <ContactBtn />
        </div>
      </section>
    </div>
  );
}

function CategoryBtn({ cat, active, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => !active && gsap.to(el, { x: 4, duration: 0.2, ease: "power2.out" });
    const onLeave = () => gsap.to(el, { x: 0, duration: 0.35, ease: "elastic.out(1,0.6)" });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); };
  }, [active]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium text-left transition-colors duration-200 will-change-transform"
      style={{
        background: active ? "rgba(14,165,233,0.09)" : "transparent",
        border: active ? "1px solid rgba(56,189,248,0.22)" : "1px solid transparent",
        color: active ? "#38bdf8" : "rgba(148,196,255,0.42)",
        fontFamily: "var(--font-poppins,'Poppins',sans-serif)",
      }}
    >
      <span className="text-base leading-none">{cat.icon}</span>
      <span className="flex-1">{cat.category}</span>
      <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-full"
        style={{
          background: active ? "rgba(14,165,233,0.14)" : "rgba(56,189,248,0.05)",
          color: active ? "#38bdf8" : "rgba(56,189,248,0.35)",
          fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
        }}>
        {cat.items.length}
      </span>
    </button>
  );
}

function ContactBtn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => gsap.to(el, { y: -3, scale: 1.04, duration: 0.25, ease: "power2.out" });
    const onLeave = () => gsap.to(el, { y: 0, scale: 1, duration: 0.42, ease: "elastic.out(1,0.5)" });
    const onDown = () => gsap.to(el, { scale: 0.97, duration: 0.1 });
    const onUp = () => gsap.to(el, { scale: 1.04, duration: 0.2 });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <button
      ref={ref}
      className="relative flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white will-change-transform"
      style={{
        background: "linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)",
        boxShadow: "0 4px 22px rgba(14,165,233,0.30), inset 0 1px 0 rgba(255,255,255,0.12)",
        fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Contact Support
    </button>
  );
}