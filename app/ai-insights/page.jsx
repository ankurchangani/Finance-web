"use client";

import { useState, useEffect } from "react";
import { generateInsights, getUserTransactions, getUserAccounts, translateInsights } from "./actions";
import InsightCard from "./components/InsightCard";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
];

// ─── Stats Bar ─────────────────────────────────────────────
function StatsBar({ transactions }) {
  const income = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const net = income - expenses;
  const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : 0;

  const stats = [
    { label: "Income", value: `₹${income.toLocaleString("en-IN")}`, gradient: "from-emerald-400 to-teal-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Expenses", value: `₹${expenses.toLocaleString("en-IN")}`, gradient: "from-rose-400 to-pink-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Net", value: `${net < 0 ? "-" : "+"}₹${Math.abs(net).toLocaleString("en-IN")}`, gradient: net >= 0 ? "from-violet-400 to-blue-400" : "from-orange-400 to-red-400", bg: net >= 0 ? "bg-violet-500/10" : "bg-orange-500/10", border: net >= 0 ? "border-violet-500/20" : "border-orange-500/20" },
    { label: "Savings Rate", value: `${savingsRate}%`, gradient: "from-cyan-400 to-blue-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-2xl border ${stat.border} ${stat.bg} p-4 text-center group hover:scale-[1.02] transition-transform duration-200`}>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-semibold mb-1.5">{stat.label}</p>
          <p className={`text-sm sm:text-base font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Account Selector ──────────────────────────────────────
function AccountSelector({ accounts, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onSelect("all")} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${selectedId === "all" ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30" : "border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-violet-300"}`}>
        All Accounts
      </button>
      {accounts.map((acc) => (
        <button key={acc.id} onClick={() => onSelect(acc.id)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${selectedId === acc.id ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30" : "border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-violet-300"}`}>
          {acc.name}
          {acc.isDefault && <span className="ml-1.5 text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full">default</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Language Toggle ────────────────────────────────────────
function LanguageToggle({ selected, onChange, loading }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-semibold mr-1">Language</span>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          disabled={loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border disabled:opacity-40 ${
            selected === lang.code
              ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-900/30"
              : "border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-violet-300"
          }`}
        >
          <span>{lang.flag}</span>
          {lang.label}
          {loading && selected === lang.code && (
            <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Section Wrapper ────────────────────────────────────────
function Section({ title, subtitle, icon, children, badge }) {
  return (
    <div className="mb-10">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{title}</h2>
            {subtitle && <p className="text-gray-600 text-xs mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Category Breakdown ─────────────────────────────────────
function CategoryBreakdown({ transactions }) {
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const byCategory = expenses.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (sorted.length === 0) return <p className="text-gray-600 text-sm">No expense data available.</p>;
  const COLORS = ["from-rose-500 to-pink-500", "from-orange-500 to-amber-500", "from-violet-500 to-purple-500", "from-blue-500 to-cyan-500", "from-teal-500 to-emerald-500", "from-indigo-500 to-blue-500"];
  return (
    <div className="space-y-3">
      {sorted.map(([cat, amount], i) => {
        const pct = total > 0 ? (amount / total) * 100 : 0;
        return (
          <div key={cat}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300 text-xs capitalize font-medium">{cat}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-[10px]">{pct.toFixed(1)}%</span>
                <span className="text-gray-300 text-xs font-semibold">₹{amount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${COLORS[i % COLORS.length]} transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Monthly Trend ──────────────────────────────────────────
function MonthlyTrend({ transactions }) {
  const monthMap = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthMap[key]) monthMap[key] = { label, income: 0, expense: 0 };
    if (t.type === "INCOME") monthMap[key].income += t.amount;
    else monthMap[key].expense += t.amount;
  });
  const months = Object.values(monthMap).sort((a, b) => a.label.localeCompare(b.label)).slice(-3);
  if (months.length === 0) return <p className="text-gray-600 text-sm">No data available.</p>;
  const maxVal = Math.max(...months.flatMap((m) => [m.income, m.expense])) || 1;
  return (
    <div className="flex items-end gap-4 h-32">
      {months.map((m) => (
        <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full flex items-end gap-1 h-20">
            <div className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-700" style={{ height: `${(m.income / maxVal) * 100}%`, minHeight: "4px" }} />
            <div className="flex-1 rounded-t-lg bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-700" style={{ height: `${(m.expense / maxVal) * 100}%`, minHeight: "4px" }} />
          </div>
          <span className="text-gray-500 text-[10px] font-medium">{m.label}</span>
        </div>
      ))}
      <div className="flex flex-col gap-1.5 pb-5">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /><span className="text-[10px] text-gray-500">Income</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-rose-400" /><span className="text-[10px] text-gray-500">Expense</span></div>
      </div>
    </div>
  );
}

// ─── Top Transactions ───────────────────────────────────────
function TopTransactions({ transactions }) {
  const top = [...transactions].filter((t) => t.type === "EXPENSE").sort((a, b) => b.amount - a.amount).slice(0, 5);
  if (top.length === 0) return <p className="text-gray-600 text-sm">No transactions found.</p>;
  return (
    <div className="space-y-2">
      {top.map((t, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs w-4 font-bold">{i + 1}.</span>
            <div>
              <p className="text-gray-200 text-xs font-medium capitalize">{t.description || t.category}</p>
              <p className="text-gray-600 text-[10px] capitalize">{t.category}</p>
            </div>
          </div>
          <span className="text-rose-400 text-xs font-bold">-₹{t.amount.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Health Score ───────────────────────────────────────────
function HealthScore({ transactions }) {
  const income = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const score = Math.min(100, Math.max(0, Math.round(savingsRate * 2)));
  const getColor = (s) => s >= 70 ? "from-emerald-400 to-teal-400" : s >= 40 ? "from-yellow-400 to-amber-400" : "from-rose-400 to-red-400";
  const getLabel = (s) => s >= 70 ? "Excellent 🎉" : s >= 40 ? "Good 👍" : "Needs Work ⚠️";
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#sg)" strokeWidth="3" strokeDasharray={`${score} 100`} strokeLinecap="round" className="transition-all duration-1000" />
          <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171"} /><stop offset="100%" stopColor={score >= 70 ? "#2dd4bf" : score >= 40 ? "#f59e0b" : "#ef4444"} /></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-extrabold bg-gradient-to-r ${getColor(score)} bg-clip-text text-transparent`}>{score}</span>
        </div>
      </div>
      <div>
        <p className={`text-lg font-bold bg-gradient-to-r ${getColor(score)} bg-clip-text text-transparent`}>{getLabel(score)}</p>
        <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-xs">
          {score >= 70 ? "You're saving well. Keep up the great financial discipline!" : score >= 40 ? "Decent savings rate. Small cuts in spending can boost this further." : "Expenses are high relative to income. Focus on reducing top spending categories."}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${getColor(score)} rounded-full`} style={{ width: `${score}%` }} />
          </div>
          <span className="text-gray-600 text-[10px]">Score: {score}/100</span>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Tips ─────────────────────────────────────────────
function QuickTips({ transactions }) {
  const income = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const tips = [
    { icon: "🎯", text: "50/30/20 Rule: 50% needs, 30% wants, 20% savings", color: "border-violet-500/20 bg-violet-500/5" },
    { icon: "📱", text: "Track every transaction — awareness reduces spending by avg 15%", color: "border-blue-500/20 bg-blue-500/5" },
    { icon: "🔄", text: "Automate savings on salary day before spending starts", color: "border-emerald-500/20 bg-emerald-500/5" },
    { icon: "📊", text: `Ideal monthly savings target: ₹${(income * 0.2).toLocaleString("en-IN")}`, color: "border-cyan-500/20 bg-cyan-500/5" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tips.map((tip, i) => (
        <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${tip.color}`}>
          <span className="text-xl flex-shrink-0">{tip.icon}</span>
          <p className="text-gray-300 text-xs leading-relaxed">{tip.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function AIInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [displayInsights, setDisplayInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    async function loadData() {
      try {
        const [accs, txns] = await Promise.all([getUserAccounts(), getUserTransactions()]);
        setAccounts(accs || []);
        setAllTransactions(txns || []);
        const defaultAcc = accs?.find((a) => a.isDefault);
        if (defaultAcc) setSelectedAccountId(defaultAcc.id);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingData(false);
      }
    }
    loadData();
  }, []);

  const filteredTransactions = selectedAccountId === "all"
    ? allTransactions
    : allTransactions.filter((t) => t.accountId === selectedAccountId);

  const handleGenerate = async () => {
    if (filteredTransactions.length === 0) { setError("No transactions found for this account in the last 3 months."); return; }
    setLoading(true); setError(null); setInsights([]); setDisplayInsights([]); setLanguage("en");
    try {
      const result = await generateInsights(filteredTransactions);
      if (!result.success) { setError(result.data); return; }
      const arr = result.data.split("\n").filter((line) => line.trim() !== "" && line.trim().length > 10);
      setInsights(arr); setDisplayInsights(arr); setGenerated(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const handleLanguageChange = async (lang) => {
    if (lang === language) return;
    if (insights.length === 0) { setLanguage(lang); return; }
    if (lang === "en") { setLanguage("en"); setDisplayInsights(insights); return; }
    setTranslating(true); setLanguage(lang);
    try {
      const result = await translateInsights(insights, lang);
      if (result.success) setDisplayInsights(result.data);
      else setDisplayInsights(insights);
    } catch { setDisplayInsights(insights); }
    finally { setTranslating(false); }
  };

  const handleAccountSelect = (id) => {
    setSelectedAccountId(id); setInsights([]); setDisplayInsights([]); setGenerated(false); setError(null); setLanguage("en");
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden my-32">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">



        {fetchingData ? (
          <div className="animate-pulse space-y-6 ">
            <div className="grid grid-cols-4 gap-3">{[0,1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5" />)}</div>
            <div className="h-8 w-48 rounded-xl bg-white/5" />
          </div>
        ) : (
          <>
            {/* SECTION 2 — Accounts */}
            {accounts.length > 0 && (
              <Section title="Select Account" icon="💳" subtitle="Filter insights by specific account">
                <AccountSelector accounts={accounts} selectedId={selectedAccountId} onSelect={handleAccountSelect} />
              </Section>
            )}

            {/* SECTION 3 — Financial Overview */}
            <Section title="Financial Overview" icon="📊" subtitle={`${filteredTransactions.length} transactions · last 3 months`}>
              <StatsBar transactions={filteredTransactions} />
            </Section>

            {/* SECTION 4 — Monthly Trend */}
            {filteredTransactions.length > 0 && (
              <Section title="Monthly Trend" icon="📈" subtitle="Income vs Expenses — last 3 months">
                <MonthlyTrend transactions={filteredTransactions} />
              </Section>
            )}

            {/* SECTION 5 — Category Breakdown */}
            {filteredTransactions.length > 0 && (
              <Section title="Spending by Category" icon="🗂️" subtitle="Where your money is going this period">
                <CategoryBreakdown transactions={filteredTransactions} />
              </Section>
            )}

            {/* SECTION 6 — Top Expenses */}
            {filteredTransactions.length > 0 && (
              <Section title="Top 5 Expenses" icon="💸" subtitle="Your biggest spending transactions">
                <TopTransactions transactions={filteredTransactions} />
              </Section>
            )}

            {/* SECTION 7 — Health Score */}
            {filteredTransactions.length > 0 && (
              <Section title="Financial Health Score" icon="❤️" subtitle="Based on your income vs expense ratio" badge="Live">
                <HealthScore transactions={filteredTransactions} />
              </Section>
            )}

            {/* SECTION 8 — Quick Tips */}
            <Section title="Financial Tips" icon="💡" subtitle="Universal money principles to follow">
              <QuickTips transactions={filteredTransactions} />
            </Section>
          </>
        )}

        {/* SECTION 9 (was 8) — AI Insights with Language Toggle */}
        <Section title="AI Insights" icon="🧠" subtitle="Personalized advice generated by Gemini" badge="AI">

          {generated && <LanguageToggle selected={language} onChange={handleLanguageChange} loading={translating} />}

          <button
            onClick={handleGenerate}
            disabled={loading || fetchingData}
            className="relative group mb-8 flex items-center gap-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-7 py-4 rounded-2xl font-semibold text-white shadow-xl shadow-violet-900/40 transition-all duration-300 hover:scale-105 active:scale-100"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {loading
              ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Analyzing...</>
              : <><span className="text-lg">✨</span>{generated ? "Regenerate Insights" : "Generate AI Insights"}</>
            }
          </button>

          {translating && (
            <div className="mb-5 flex items-center gap-2 text-violet-400 text-sm">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
              Translating to {LANGUAGES.find(l => l.code === language)?.label}...
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/8 px-5 py-4 text-rose-300 text-sm flex items-start gap-3">
              <span className="text-lg mt-0.5">⚠️</span><p>{error}</p>
            </div>
          )}

          {displayInsights.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  {LANGUAGES.find(l => l.code === language)?.label} · {displayInsights.length} insights
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {displayInsights.map((item, index) => (
                  <InsightCard key={`${language}-${index}`} text={item} index={index} />
                ))}
              </div>
            </div>
          )}

          {!loading && displayInsights.length === 0 && !error && (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Your insights will appear here</p>
              <p className="text-gray-700 text-xs">
                {filteredTransactions.length > 0 ? `Click above to analyze ${filteredTransactions.length} transactions` : "Add transactions to get AI insights"}
              </p>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
