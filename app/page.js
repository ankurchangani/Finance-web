"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/hero";
import { motion } from "framer-motion";
import {
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";

const fadeUp = {
  hidden: { opacity: 0, y: 80, rotateX: 15 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      mass: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* ── Stats ── */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-background"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {statsData.map((stat, index) => (
              <motion.div key={index} variants={fadeUp} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-[#a5bacf]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── How It Works ── */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-background"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.h2
            variants={fadeUp}
            className="section-title text-2xl sm:text-3xl md:text-4xl text-center font-bold text-white mb-10 sm:mb-12"
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {howItWorksData.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center p-5 sm:p-6 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-[hsl(220,20%,10%)] hover:shadow-[0_10px_40px_rgba(56,189,248,0.15)]"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                >
                  {step.icon}
                </motion.div>

                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Testimonials ── */}
      <motion.section
        id="testimonials"
        className="py-12 sm:py-16 md:py-20 bg-background"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.h2
            variants={fadeUp}
            className="section-title text-2xl sm:text-3xl md:text-4xl text-center font-bold text-white mb-10 sm:mb-12"
          >
            What Our Users Say
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonialsData.map((testimonial, index) => (
              <motion.div key={index} variants={fadeUp}>
                <Card className="p-4 sm:p-6 cursor-pointer bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,20%)] rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-2 h-full">
                  <CardContent className="pt-3 sm:pt-4">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-cyan-400 flex-shrink-0"
                      />
                      <div className="ml-3 sm:ml-4">
                        <div className="font-semibold text-sm sm:text-base text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {testimonial.quote}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-background"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Take Control of Your Finances?
          </h2>

          <p className="text-sm sm:text-base text-blue-100 mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>

          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34,211,238,0)",
                  "0 0 20px rgba(34,211,238,0.6)",
                  "0 0 0px rgba(34,211,238,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="px-6 sm:px-8 text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-[0_10px_40px_rgba(56,189,248,0.4)] transition-all duration-300"
              >
                Start Free Trial
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
