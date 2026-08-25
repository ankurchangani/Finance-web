"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

export default function GSAPProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({
        nullTargetWarn: false,
      });

      // Initialize Lenis Smooth Scroll integrated with GSAP Ticker & ScrollTrigger
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const updateRaf = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateRaf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.destroy();
        gsap.ticker.remove(updateRaf);
      };
    }
  }, []);

  return <>{children}</>;
}

