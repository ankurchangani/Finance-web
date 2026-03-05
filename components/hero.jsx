"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageAnim = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="container mx-auto text-center max-w-7xl">

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[105px] pb-4 sm:pb-6 font-bold leading-tight gradient-title animate-gradient"
        >
          Manage Your Finances <br className="hidden sm:block" />
          with Intelligence
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[hsl(210,20%,65%)] mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2"
        >
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center"
        >
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="primary"
                className="px-6 sm:px-8 text-sm sm:text-base"
              >
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          variants={imageAnim}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-10 md:mt-12 overflow-hidden hero-image-wrapper"
        >
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-auto"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
