"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.2 }
    }
};

const AboutPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);
    return (
        <div className="min-h-screen bg-background">
            <section ref={sectionRef} className="relative py-20 sm:py-32 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
                <motion.div
                    animate={{ opacity: 0.3, y: -50, rotateX: 15 }}
                    transition={{ duration: 1, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent" />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        animates={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}

                        className={`text-center mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                    </motion.div>
                    
                    <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl rounded-full" />

                            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-gray-700/50 shadow-2xl transform perspective-1000 hover:scale-105 transition-transform duration-500">
                                <div className="flex items-center justify-center mb-8">
                                    <Brain className="w-16 h-16 sm:w-24 sm:h-24 text-cyan-400 animate-pulse" />
                                </div>

                                <div className="text-center space-y-4">
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-400 animate-ping" />
                                        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 animate-pulse" />
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-400 animate-ping delay-300" />
                                    </div>

                                    <p className="text-xl sm:text-2xl text-gray-300 font-medium">
                                        AI-Powered Financial Intelligence
                                    </p>
                                    <p className="text-gray-400 max-w-2xl mx-auto">
                                        Advanced machine learning algorithms analyze your spending patterns and provide personalized insights to help you make smarter financial decisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-10"
            >
                <motion.div variants={fadeUp} className="group relative cursor-pointer rounded-2xl p-8 bg-white/5 border border-white/10 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.15),transparent_60%)]"></div>
                    <h2 className="relative text-2xl font-semibold text-blue-400 group-hover:text-cyan-300 transition">
                        Our Mission
                    </h2>
                    <p className="relative mt-4 text-gray-400">
                        Our mission is to simplify money management using automation, AI insights and a user-friendly experience so everyone can take control of their finances.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="group relative cursor-pointer rounded-2xl p-8 bg-white/5 border border-white/10 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.2),transparent_60%)]"></div>
                    <h2 className="relative text-2xl font-semibold text-purple-400 group-hover:text-fuchsia-300 transition">
                        Our Vision
                    </h2>
                    <p className="relative mt-4 text-gray-400">
                        We envision a world where AI acts as your personal financial advisor helping you make smarter decisions and achieve financial freedom.
                    </p>
                </motion.div>
            </motion.section>

            <motion.section
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="py-16 px-6 md:px-20 bg-background"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 section-title text-white">
                    Who We Are
                </h2>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    <div className="w-full overflow-hidden rounded-2xl group">
                        <Image src="/about.jpg" alt="About Image" width={600} height={400} className="rounded-2xl w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-1 cursor-pointer" />
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-400 text-lg leading-relaxed hover:text-gray-200 transition duration-300">
                            We are a new-generation fintech team focused on building intelligent financial tools powered by Artificial Intelligence.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed hover:text-gray-200 transition duration-300">
                            Our platform is designed for students, professionals, freelancers and businesses who want complete visibility and control.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed hover:text-gray-200 transition duration-300">
                            We provide intelligent insights, smart alerts and personalized recommendations.
                        </p>
                    </div>
                </div>
            </motion.section>

            <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="py-16 px-6 md:px-20"
            >
                <h2 className="text-3xl font-bold text-center mb-12 section-title text-white">
                    Everything you need to manage your finances
                </h2>

                <div className="grid md:grid-cols-3 gap-8 border border-gray-700/50 rounded-xl p-8 bg-gray-900/40 backdrop-blur-sm shadow-2xl">
                    {["Expense & Income Tracking", "AI Receipt Scanner", "Smart Analytics Dashboard", "Recurring Transactions", "Monthly Budget Planning", "Secure Cloud Storage"].map((item, index) => (
                        <motion.div key={index} variants={fadeUp} className="group relative cursor-pointer bg-white/5 p-6 rounded-xl border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500/60 hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]">
                            <h3 className="text-lg font-semibold text-blue-400 group-hover:text-blue-300">{item}</h3>
                            <p className="text-gray-400 mt-2 group-hover:text-gray-200">Powerful tools to manage and monitor your financial activity easily.</p>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-xl border border-blue-500/20 blur-xl"></div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="py-20 px-6 md:px-20 bg-gradient-to-b from-black to-gray-900"
            >
                <h2 className="text-3xl font-bold text-center mb-12 section-title text-white">
                    How It Works
                </h2>

                <div className="grid md:grid-cols-4 gap-8 text-center">
                    {["Create Account", "Add Transactions", "Analyze Reports", "Improve Spending"].map((step, index) => (
                        <motion.div key={index} variants={fadeUp} className="group cursor-pointer bg-white/5 p-6 rounded-xl border border-white/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:border-purple-500/50 hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]">
                            <div className="text-3xl font-bold text-purple-400 mb-4 group-hover:text-purple-300">{index + 1}</div>
                            <h3 className="text-lg text-gray-200 group-hover:text-white">{step}</h3>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-xl border border-purple-500/20 blur-xl"></div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }} className="py-16 px-6 md:px-20 text-center">
                <h2 className="text-4xl font-bold text-white section-title">
                    Start Managing Your Finances Smarter Today
                </h2>
                <p className="text-gray-400 mt-4">
                    Take full control of your income, expenses and savings with AI.
                </p>

                <Link href="/dashboard">
                    <Button className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">
                        Get Started Free
                    </Button>
                </Link>
            </motion.section>
        </div>
    );
};
export default AboutPage;

