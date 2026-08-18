"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function GSAPProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({
        nullTargetWarn: false,
      });
    }
  }, []);

  return <>{children}</>;
}
