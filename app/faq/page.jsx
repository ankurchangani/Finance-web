"use client";
import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      {
        q: "What is Welth and how does it work?",
        a: "Welth is an AI-powered financial management platform that helps you track, analyze, and optimize your spending in real time. Simply connect your accounts, log transactions, and let our intelligent engine surface insights, budget alerts, and savings opportunities — all from one sleek dashboard.",
      },
      {
        q: "How do I add my first transaction?",
        a: 'Click the "Add Transaction" button in the header. You can manually enter details like type, amount, category, date, and description — or use the AI-powered "Scan Receipt" feature to auto-fill everything instantly from a photo of your receipt.',
      },
      {
        q: "Can I set up recurring transactions?",
        a: 'Yes! When creating a transaction, toggle on "Recurring Transaction" and choose your schedule (daily, weekly, monthly). Welth will automatically log and track these so your dashboard always stays accurate without manual effort.',
      },
    ],
  },
  {
    category: "Dashboard & Analytics",
    icon: "📊",
    items: [
      {
        q: "What does the Dashboard show me?",
        a: "Your Dashboard gives you a real-time financial snapshot: monthly budget progress, recent transactions, a pie chart of expense categories, account balances, and income vs. expense totals. Everything updates live as you add or edit transactions.",
      },
      {
        q: "How is the Monthly Expense Breakdown calculated?",
        a: "The pie chart aggregates all your expenses for the current month, grouped by category (housing, food, travel, healthcare, etc.). Hover over any slice to see the exact amount. You can filter by account using the dropdown on the Recent Transactions panel.",
      },
      {
        q: "Can I view transactions for a specific time period?",
        a: "Absolutely. On the Account detail page, use the time filter (e.g., Last Month, Last 3 Months, This Year) to zoom into any period. The bar chart and transaction table both update instantly to reflect your selected range.",
      },
    ],
  },
  {
    category: "Accounts & Security",
    icon: "🔐",
    items: [
      {
        q: "How do I add a new account?",
        a: 'From the Dashboard, scroll to the Accounts section and click "Add New Account". Enter your account name, type (savings, checking, investment), and starting balance. You can manage multiple accounts and toggle them on or off in your overview.',
      },
      {
        q: "Is my financial data safe with Welth?",
        a: "Security is our top priority. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell your data. Authentication is handled by Clerk, providing enterprise-grade protection including MFA, session management, and anomaly detection.",
      },
      {
        q: "Can I delete or edit a transaction after creating it?",
        a: "Yes. On the Account transactions page, click the ··· menu on any transaction row to edit details or delete it entirely. Changes reflect immediately across your dashboard, budget tracker, and expense charts.",
      },
    ],
  },
  {
    category: "AI Features",
    icon: "🤖",
    items: [
      {
        q: "How does the AI receipt scanner work?",
        a: 'Tap "Scan Receipt with AI" and upload or photograph your receipt. Our vision model extracts the merchant, amount, date, and suggested category automatically. You review, confirm, and save — cutting manual entry time to near zero.',
      },
      {
        q: "Does Welth provide financial advice or recommendations?",
        a: "Welth surfaces data-driven insights — like overspending alerts in a category or positive savings trends — but does not provide regulated financial advice. Always consult a certified financial planner for personalized investment or retirement guidance.",
      },
      {
        q: "What AI model powers Welth's insights?",
        a: "Welth uses a combination of classification models for transaction categorization and large language models for natural language insights and receipt parsing. The system continuously improves based on anonymized, aggregated usage patterns.",
      },
    ],
  },
];

const stats = [
  { val: "50K+", label: "Active Users" },
  { val: "$2B+", label: "Tracked" },
  { val: "99.9%", label: "Uptime" },
  { val: "4.9/5", label: "User Rating" },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  const currentFAQs = faqs[activeCategory].items;
  const globalOffset = faqs
    .slice(0, activeCategory)
    .reduce((s, f) => s + f.items.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* ── Badge ── */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4 sm:mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="font-montserrat text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Help Center
          </span>
        </div>

        {/* ── Title ── */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3 sm:mb-4 font-montserrat">
          <span className="text-cyan-400">Frequently</span> Asked
          <br />
          <span className="text-purple-400">Questions</span>
        </h2>

        <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-lg mb-10 sm:mb-14 font-poppins">
          {"Everything you need to know about managing your finances with Welth. "}
          {"Can't find the answer? Reach out to our support team."}
        </p>

        {/* ── Stats ── */}
        <div className="flex flex-wrap gap-6 sm:gap-10 mb-10 sm:mb-14">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="font-montserrat text-xl sm:text-2xl font-extrabold tracking-tight text-cyan-400">
                {s.val}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-white/40 font-poppins">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 sm:gap-8 items-start">

          {/* Category Sidebar */}
          <div className="flex flex-row flex-wrap md:flex-col gap-2 md:sticky md:top-24">
            {faqs.map((cat, i) => (
              <button
                key={cat.category}
                onClick={() => { setActiveCategory(i); setOpenIndex(null); }}
                className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-left transition-all duration-200 border font-poppins
                  ${activeCategory === i
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
              >
                <span className="text-sm sm:text-base leading-none">{cat.icon}</span>
                <span className="flex-1">{cat.category}</span>
                <span className={`ml-auto font-montserrat text-[11px] px-1.5 py-0.5 rounded-full transition-colors
                  ${activeCategory === i
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "bg-white/5 text-white/40"
                  }`}>
                  {cat.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="flex flex-col gap-3">
            {currentFAQs.map((faq, i) => {
              const globalIdx = globalOffset + i;
              const isOpen = openIndex === globalIdx;

              return (
                <div
                  key={globalIdx}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 bg-[#0f1629]
                    ${isOpen
                      ? "border-cyan-500/30 shadow-[0_0_0_1px_rgba(34,189,253,0.08),0_8px_32px_rgba(0,0,0,0.35)]"
                      : "border-white/[0.07] hover:border-white/[0.12]"
                    }`}
                >
                  {/* Question button */}
                  <button
                    onClick={() => toggle(globalIdx)}
                    className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 text-left"
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <span className={`font-montserrat text-[11px] mt-0.5 min-w-[24px] flex-shrink-0 text-cyan-400 transition-opacity
                        ${isOpen ? "opacity-100" : "opacity-50"}`}>
                        0{i + 1}
                      </span>
                      <span className={`text-sm font-semibold leading-snug transition-colors font-poppins
                        ${isOpen ? "text-white" : "text-white/80"}`}>
                        {faq.q}
                      </span>
                    </div>

                    {/* Chevron icon */}
                    <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all duration-300
                      ${isOpen ? "bg-cyan-500/10 rotate-180" : "bg-white/5"}`}>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-colors ${isOpen ? "stroke-cyan-400" : "stroke-white/40"}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {/* Answer */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden
                    ${isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-4 sm:px-5 pb-5 pl-10 sm:pl-14 pt-3 sm:pt-4 text-sm leading-relaxed text-white/50 border-t border-white/[0.06] font-poppins">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#0f1629] to-[#151d35] p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 font-montserrat">Still have questions?</h3>
            <p className="text-sm text-white/50 font-poppins">
              Our support team is available 24/7 to help you get the most out of Welth.
            </p>
          </div>

          <button className="relative flex-shrink-0 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_4px_20px_rgba(34,189,253,0.3)] hover:shadow-[0_8px_32px_rgba(34,189,253,0.5)] hover:-translate-y-0.5 transition-all duration-200 font-montserrat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contact Support
          </button>
        </div>

      </section>
    </div>
  );
}
