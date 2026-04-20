"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

/**
 * Button3D — premium GSAP-animated 3D button
 * Variants: "primary" | "ghost" | "outline" | "indigo"
 * Sizes: "sm" | "md" | "lg"
 */
const Button3D = React.forwardRef(
  ({ children, className, variant = "primary", size = "md", disabled = false, onClick, ...props }, ref) => {
    const btnRef = useRef(null);
    const glowRef = useRef(null);
    const shimmerRef = useRef(null);
    const resolvedRef = ref || btnRef;

    useEffect(() => {
      const el = resolvedRef.current;
      const glow = glowRef.current;
      const shimmer = shimmerRef.current;
      if (!el || disabled) return;

      gsap.set(el, { transformPerspective: 800, transformStyle: "preserve-3d" });

      const onEnter = () => {
        gsap.to(el, { y: -5, rotateX: 6, scale: 1.045, boxShadow: shadowMap[variant].hover, duration: 0.32, ease: "power3.out" });
        if (glow) gsap.to(glow, { opacity: 1, scale: 1.18, duration: 0.38, ease: "power2.out" });
        if (shimmer) gsap.fromTo(shimmer, { x: "-130%", opacity: 0.9 }, { x: "230%", opacity: 0, duration: 0.62, ease: "power2.inOut" });
      };
      const onLeave = () => {
        gsap.to(el, { y: 0, rotateX: 0, scale: 1, boxShadow: shadowMap[variant].default, duration: 0.48, ease: "elastic.out(1,0.5)" });
        if (glow) gsap.to(glow, { opacity: 0, scale: 0.9, duration: 0.32 });
      };
      const onDown = () => gsap.to(el, { scale: 0.96, y: 1, rotateX: 2, duration: 0.1, ease: "power2.in" });
      const onUp = () => gsap.to(el, { scale: 1.045, y: -5, rotateX: 6, duration: 0.28, ease: "elastic.out(1,0.4)" });

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
    }, [variant, disabled]);

    return (
      <button
        ref={resolvedRef}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden select-none",
          "font-semibold tracking-wide cursor-pointer outline-none will-change-transform",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        {...props}
      >
        <span ref={glowRef} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
          style={{ background: glowMap[variant], filter: "blur(18px)", transform: "scale(0.9)" }} />
        <span ref={shimmerRef} className="pointer-events-none absolute top-0 left-0 h-full w-1/3 opacity-0 rounded-[inherit]"
          style={{ background: "linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.22) 50%,transparent 80%)", transform: "skewX(-15deg)" }} />
        <span className="pointer-events-none absolute bottom-0 inset-x-0 h-[3px] rounded-b-[inherit]"
          style={{ background: edgeMap[variant] }} />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
Button3D.displayName = "Button3D";
export default Button3D;

const variantClass = {
  primary:
    "text-white bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 " +
    "border border-cyan-400/30 " +
    "shadow-[0_4px_24px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]",
  ghost:
    "bg-[rgba(34,211,238,0.06)] border border-cyan-400/20 text-cyan-300 " +
    "hover:bg-[rgba(34,211,238,0.12)] hover:text-cyan-200",
  outline:
    "bg-transparent border border-blue-500/40 text-blue-300 " +
    "hover:bg-blue-500/10 hover:text-blue-200",
  indigo:
    "text-white bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 " +
    "border border-indigo-400/30 " +
    "shadow-[0_4px_24px_rgba(99,102,241,0.30),inset_0_1px_0_rgba(255,255,255,0.10)]",
};

const sizeClass = {
  sm: "h-8 px-4 text-xs rounded-lg gap-1.5",
  md: "h-10 px-6 text-sm rounded-xl gap-2",
  lg: "h-12 px-8 text-base rounded-xl gap-2.5",
};

const glowMap = {
  primary: "linear-gradient(135deg,rgba(34,211,238,0.55) 0%,rgba(59,130,246,0.45) 60%,rgba(99,102,241,0.35) 100%)",
  ghost:   "radial-gradient(circle,rgba(34,211,238,0.28) 0%,transparent 70%)",
  outline: "radial-gradient(circle,rgba(59,130,246,0.28) 0%,transparent 70%)",
  indigo:  "linear-gradient(135deg,rgba(99,102,241,0.50) 0%,rgba(168,85,247,0.40) 100%)",
};

const edgeMap = {
  primary: "linear-gradient(90deg,rgba(34,211,238,0.55) 0%,rgba(99,102,241,0.45) 50%,rgba(168,85,247,0.35) 100%)",
  ghost:   "rgba(34,211,238,0.22)",
  outline: "rgba(59,130,246,0.28)",
  indigo:  "linear-gradient(90deg,rgba(99,102,241,0.55) 0%,rgba(168,85,247,0.45) 100%)",
};

const shadowMap = {
  primary: {
    default: "0 4px 24px rgba(34,211,238,0.28),inset 0 1px 0 rgba(255,255,255,0.12)",
    hover:   "0 10px 40px rgba(34,211,238,0.50),0 4px 20px rgba(59,130,246,0.35),inset 0 1px 0 rgba(255,255,255,0.16)",
  },
  ghost: {
    default: "0 2px 14px rgba(34,211,238,0.10)",
    hover:   "0 8px 28px rgba(34,211,238,0.24)",
  },
  outline: {
    default: "0 2px 14px rgba(59,130,246,0.12)",
    hover:   "0 8px 28px rgba(59,130,246,0.28)",
  },
  indigo: {
    default: "0 4px 24px rgba(99,102,241,0.30),inset 0 1px 0 rgba(255,255,255,0.10)",
    hover:   "0 10px 40px rgba(99,102,241,0.52),0 4px 20px rgba(168,85,247,0.32),inset 0 1px 0 rgba(255,255,255,0.14)",
  },
};