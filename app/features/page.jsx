"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import {
    BarChart3, Receipt, Zap,
    ArrowRight, Sparkles, Plus,
    Search, Clock, CheckSquare,
    ChevronDown, Camera,
} from "lucide-react";
import Link from "next/link";
import { featuresData } from "@/data/landing";

// ─── Variants ──────────────────────────────────────────────────────────────
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function FeatureCard({ feature }) {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 260, damping: 26 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 260, damping: 26 });

    const onMove = (e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mouseX.set((e.clientX - r.left) / r.width - 0.5);
        mouseY.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };

    return (
        <motion.div
            ref={ref}
            variants={fadeUp}
            onMouseMove={onMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
            className="relative group h-full"
        >
            {/* Glow bloom */}
            <motion.div
                className={`absolute -inset-1 rounded-2xl -z-10 blur-xl ${feature.bgClass}`}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.05 : 0.95 }}
                transition={{ duration: 0.3 }}
            />

            <div className={`
                relative h-full overflow-hidden rounded-2xl border cursor-default
                bg-[hsl(220,20%,8%)] transition-all duration-300
                ${feature.hoverBorder} border-[hsl(220,15%,14%)]
                ${hovered ? `shadow-2xl ${feature.glowClass}` : ""}
            `}>
                {/* Top shimmer line */}
                <motion.div
                    className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${feature.topLine}`}
                    animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.2 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "center" }}
                />

                {/* Inner bg glow */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${feature.innerGlow}`} />

                <div className="p-5 sm:p-6 relative z-10 flex flex-col h-full">
                    {/* Icon + Badge row */}
                    <div className="flex items-start justify-between mb-4 sm:mb-5">
                        <motion.div
                            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${feature.bgClass} border ${feature.borderClass} ${feature.colorClass}`}
                            animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 6 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <feature.Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.div>

                        <motion.span
                            className={`text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border tracking-wide font-montserrat ${feature.badgeColor}`}
                            animate={{ y: hovered ? -1 : 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {feature.badge}
                        </motion.span>
                    </div>

                    {/* Content */}
                    <h3 className="text-sm sm:text-[15px] font-bold text-white mb-2 sm:mb-2.5 leading-snug font-montserrat">
                        {feature.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-400 mb-4 sm:mb-5 flex-1 font-poppins">
                        {feature.description}
                    </p>

                    {/* Stat row */}
                    <div className={`flex items-center gap-2 pt-3 sm:pt-4 border-t ${feature.borderClass}`}>
                        <motion.div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${feature.dotColor}`}
                            animate={{ scale: hovered ? [1, 1.6, 1] : 1 }}
                            transition={{ duration: 0.8, repeat: hovered ? Infinity : 0, repeatDelay: 0.9 }}
                        />
                        <span className={`text-[11px] font-semibold font-montserrat ${feature.statColor}`}>
                            {feature.stat}
                        </span>
                        <motion.div
                            className={`ml-auto transition-colors duration-200 ${hovered ? feature.colorClass : "text-slate-600"}`}
                            animate={{ x: hovered ? 3 : 0, opacity: hovered ? 1 : 0.4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ArrowRight className="w-3.5 h-3.5" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── SECTION 1: Features Grid ────────────────────────────────────────────────
function Section1Features() {
    return (
        <motion.section
            className="relative py-16 sm:py-24 bg-[hsl(220,20%,6%)] overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            variants={stagger}
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-20 w-[300px] sm:w-[520px] h-[300px] sm:h-[520px] rounded-full bg-blue-500 blur-[80px] opacity-[0.09] animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-emerald-500 blur-[80px] opacity-[0.08] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute -bottom-16 left-1/3 w-[200px] sm:w-[320px] h-[200px] sm:h-[320px] rounded-full bg-violet-600 blur-[80px] opacity-[0.07] animate-pulse" style={{ animationDelay: "4s" }} />
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "radial-gradient(circle, rgb(148 163 184) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
                />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[hsl(220,20%,6%)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[hsl(220,20%,6%)] to-transparent" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {/* Label */}
                <motion.div variants={fadeUp} className="flex justify-center mb-4 sm:mb-5">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 font-montserrat">
                        <Sparkles className="w-3 h-3" />
                        Platform Features
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-[2.85rem] font-extrabold leading-[1.1] tracking-tight text-white font-montserrat mb-3 sm:mb-4">
                    Everything you need to{" "}
                    <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                        manage your finances
                    </span>
                </motion.h2>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 py-6 sm:py-7">
                    {featuresData.map((f, i) => <FeatureCard key={i} feature={f} />)}
                </div>

                {/* Bottom CTA */}
                <motion.div variants={fadeUp} className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-4 sm:gap-8 px-5 sm:px-7 py-3 sm:py-4 rounded-2xl bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,14%)]">
                        {[["50K+", "Active Users"], ["$2B+", "Tracked"], ["4.9★", "Rating"]].map(([v, l], i) => (
                            <div key={i} className="text-center">
                                <div className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-montserrat">{v}</div>
                                <div className="text-[10px] mt-0.5 text-slate-500 font-poppins">{l}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

// ─── SECTION 2: Dashboard Preview ────────────────────────────────────────────
function Section2Dashboard() {
    return (
        <motion.section
            className="relative bg-[hsl(220,20%,6%)] overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            variants={stagger}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-600 blur-[100px] opacity-[0.06]" />
                <div className="absolute bottom-0 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-cyan-500 blur-[100px] opacity-[0.05]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-10 sm:mb-16">
                    <motion.div variants={fadeUp}>
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-montserrat mb-4 sm:mb-5">
                            <BarChart3 className="w-3 h-3" />
                            Live Dashboard
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white font-montserrat mb-3 sm:mb-4">
                            Your complete{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                financial command center
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5 sm:mb-6 font-poppins">
                            Monitor all your accounts, track every transaction, and visualise spending breakdowns in real time — all from one unified dashboard.
                        </p>
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { v: "$119K", l: "Total Balance", c: "text-blue-400" },
                                { v: "$66.2K", l: "Monthly Income", c: "text-emerald-400" },
                                { v: "$22.5K", l: "Expenses", c: "text-red-400" },
                            ].map((s, i) => (
                                <div key={i} className="rounded-xl p-2.5 sm:p-3 bg-[hsl(220,20%,9%)] border border-[hsl(220,15%,14%)]">
                                    <div className={`text-base sm:text-lg font-extrabold font-montserrat ${s.c}`}>{s.v}</div>
                                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 font-poppins">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: mock account card */}
                    <motion.div variants={fadeUp} className="relative mt-6 lg:mt-0">
                        <div className="relative rounded-2xl border border-[hsl(220,15%,14%)] bg-[hsl(220,20%,8%)] p-5 sm:p-6 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1 font-poppins">Default Account</div>
                                        <div className="text-sm font-semibold text-white font-montserrat">Monthly Budget</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 text-xs font-bold font-montserrat">N</div>
                                </div>
                                {/* Budget bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-slate-400 mb-2 font-poppins">
                                        <span>$13,071.11 spent</span>
                                        <span className="text-slate-500">of $80,000.00</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[hsl(220,15%,14%)] overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "16.3%" }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                                        />
                                    </div>
                                    <div className="text-right text-[10px] text-slate-500 mt-1 font-poppins">16.3% used</div>
                                </div>
                            </div>
                        </div>
                        {/* Add account card */}
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-dashed border-[hsl(220,15%,20%)] bg-[hsl(220,20%,7%)] flex flex-col items-center justify-center gap-1 shadow-xl">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                            <span className="text-[9px] text-slate-500 text-center leading-tight font-poppins">Add New Account</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}

// ─── SECTION 3: Transaction Page Preview ─────────────────────────────────────
function Section3Transactions() {
    const txRows = [
        { date: "Feb 20, 2026", desc: "Received salary", cat: "Salary", catColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/25", amt: "+$5,951.79", amtColor: "text-emerald-400", rec: "One-time" },
        { date: "Feb 20, 2026", desc: "Paid for healthcare", cat: "Healthcare", catColor: "bg-red-500/20 text-red-400 border-red-500/25", amt: "-$558.23", amtColor: "text-red-400", rec: "One-time" },
        { date: "Feb 20, 2026", desc: "Paid for housing", cat: "Housing", catColor: "bg-orange-500/20 text-orange-400 border-orange-500/25", amt: "-$1,121.02", amtColor: "text-red-400", rec: "One-time" },
    ];

    return (
        <motion.section
            className="relative py-16 sm:py-24 bg-[hsl(220,20%,6%)] overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            variants={stagger}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-violet-600 blur-[100px] opacity-[0.06]" />
                <div className="absolute bottom-10 right-0 w-[250px] sm:w-[380px] h-[250px] sm:h-[380px] rounded-full bg-pink-600 blur-[100px] opacity-[0.05]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* Left text */}
                    <motion.div variants={fadeUp} className="lg:pt-8">
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 font-montserrat mb-4 sm:mb-5">
                            <Zap className="w-3 h-3" />
                            Smart Transactions
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white font-montserrat mb-3 sm:mb-4">
                            Add & track every{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                                transaction instantly
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 sm:mb-8 font-poppins">
                            Scan receipts with AI, log manual transactions, or set up recurring payments — all in seconds. Every cent tracked, every pattern understood.
                        </p>

                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { icon: Camera, title: "AI Receipt Scan", desc: "Snap a photo, AI extracts all data automatically", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
                                { icon: Receipt, title: "Recurring Transactions", desc: "Set up automatic recurring income or expense entries", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
                                { icon: BarChart3, title: "Category Analytics", desc: "Auto-categorised with AI for instant spending insights", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    className="flex gap-3 items-start p-3 sm:p-4 rounded-xl bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,14%)] hover:border-[hsl(220,15%,20%)] transition-colors duration-300"
                                >
                                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${item.color}`}>
                                        <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white font-montserrat mb-0.5">{item.title}</div>
                                        <div className="text-xs text-slate-400 leading-relaxed font-poppins">{item.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Mock UI */}
                    <motion.div variants={fadeUp} className="space-y-3 sm:space-y-4">

                        {/* Add Transaction form mock */}
                        <div className="rounded-2xl border border-[hsl(220,15%,14%)] bg-[hsl(220,20%,8%)] overflow-hidden">
                            <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4">
                                <h3 className="text-lg sm:text-xl font-extrabold font-montserrat mb-3 sm:mb-4">
                                    <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Add Transaction</span>
                                </h3>
                                <button className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold font-montserrat flex items-center justify-center gap-2 mb-3 sm:mb-4 hover:opacity-90 transition-opacity">
                                    <Camera className="w-4 h-4" /> Scan Receipt with AI
                                </button>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="rounded-lg border border-[hsl(220,15%,16%)] bg-[hsl(220,20%,10%)] px-3 py-2 sm:py-2.5 flex items-center justify-between">
                                        <span className="text-sm text-slate-400 font-poppins">Expense</span>
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        <div className="rounded-lg border border-[hsl(220,15%,16%)] bg-[hsl(220,20%,10%)] px-3 py-2 sm:py-2.5">
                                            <span className="text-sm text-slate-500 font-poppins">0.00</span>
                                        </div>
                                        <div className="rounded-lg border border-[hsl(220,15%,16%)] bg-[hsl(220,20%,10%)] px-3 py-2 sm:py-2.5 flex items-center justify-between">
                                            <span className="text-sm text-slate-400 truncate font-poppins">nikunj ($119K)</span>
                                            <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-[hsl(220,15%,16%)] bg-[hsl(220,20%,10%)] px-3 py-2 sm:py-2.5 flex items-center justify-between">
                                        <span className="text-sm text-slate-500 font-poppins">Select category</span>
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 grid grid-cols-2 gap-2 sm:gap-3">
                                <button className="py-2 sm:py-2.5 rounded-xl border border-[hsl(220,15%,18%)] text-sm font-semibold text-slate-300 font-montserrat hover:bg-white/5 transition-colors">Cancel</button>
                                <Link href="/transaction/create">
                                    <button className="w-full py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white font-montserrat transition-colors">
                                        Create Transaction
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Transaction list preview — hidden on very small screens, shown sm+ */}
                        <div className="rounded-2xl border border-[hsl(220,15%,14%)] bg-[hsl(220,20%,8%)] overflow-hidden hidden sm:block">
                            {/* Search + filters */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(220,15%,12%)]">
                                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,14%)]">
                                    <Search className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-xs text-slate-500 font-poppins">Search transactions...</span>
                                </div>
                                <div className="flex gap-1.5">
                                    {["All Types", "All Transactions"].map((f, i) => (
                                        <div key={i} className="px-2 py-1.5 rounded-lg bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,14%)] flex items-center gap-1 text-[10px] text-slate-400 font-poppins">
                                            {f} <ChevronDown className="w-2.5 h-2.5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Rows */}
                            {txRows.map((tx, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(220,15%,10%)] hover:bg-white/[0.015] transition-colors">
                                    <CheckSquare className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] text-slate-400 font-poppins">{tx.date}</div>
                                        <div className="text-xs font-medium text-white truncate font-poppins">{tx.desc}</div>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 font-montserrat ${tx.catColor}`}>
                                        {tx.cat}
                                    </span>
                                    <span className={`text-xs font-semibold flex-shrink-0 font-montserrat ${tx.amtColor}`}>{tx.amt}</span>
                                    <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0 font-poppins">
                                        <Clock className="w-2.5 h-2.5" /> {tx.rec}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats bar */}
                        <div className="rounded-2xl border border-[hsl(220,15%,14%)] bg-[hsl(220,20%,8%)] p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <span className="text-xs font-semibold text-slate-400 font-montserrat">Transaction Overview — Last Month</span>
                                <span className="text-[10px] text-slate-500 font-poppins hidden sm:block">182 Transactions</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
                                {[
                                    { l: "Total Income", v: "$66,205.05", c: "text-emerald-400" },
                                    { l: "Total Expenses", v: "$22,548.42", c: "text-red-400" },
                                    { l: "Net", v: "$43,656.63", c: "text-blue-400" },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="text-[10px] text-slate-500 mb-0.5 font-poppins">{s.l}</div>
                                        <div className={`text-xs sm:text-sm font-extrabold font-montserrat ${s.c}`}>{s.v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 sm:gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-poppins">
                                    <span className="w-2 h-2 rounded-sm inline-block bg-blue-500" />Income
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-poppins">
                                    <span className="w-2 h-2 rounded-sm inline-block bg-red-400" />Expenses
                                </span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </motion.section>
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
