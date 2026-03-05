"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Menu, X, Sparkles, ChevronRight } from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

const NAV_LINKS = ["Features", "About", "FAQ"];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const overlayRef = useRef(null);
  const sidebarRef = useRef(null);
  const linksRef = useRef([]);
  const loginRef = useRef(null);
  const decorRef = useRef([]);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  // ================= GSAP SIDEBAR ANIMATION =================
  useEffect(() => {
    const overlay = overlayRef.current;
    const sidebar = sidebarRef.current;
    const links = linksRef.current.filter(Boolean);
    const login = loginRef.current;
    const decors = decorRef.current.filter(Boolean);

    if (!overlay || !sidebar) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      gsap.fromTo(overlay,
        { opacity: 0, pointerEvents: "none" },
        { opacity: 1, pointerEvents: "all", duration: 0.35, ease: "power2.out" }
      );

      gsap.fromTo(sidebar,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power4.out" }
      );

      gsap.fromTo(decors,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, delay: 0.2, ease: "back.out(1.7)" }
      );

      gsap.fromTo(links,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.12, duration: 0.5, delay: 0.3, ease: "power3.out" }
      );

      if (login) {
        gsap.fromTo(login,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.6, ease: "power3.out" }
        );
      }

    } else {
      document.body.style.overflow = "";

      gsap.to([...links, login].filter(Boolean), {
        x: 40, opacity: 0, stagger: 0.05, duration: 0.2,
      });

      gsap.to(sidebar, {
        x: "100%", opacity: 0, duration: 0.4, ease: "power3.in",
      });

      gsap.to(overlay, {
        opacity: 0, pointerEvents: "none", duration: 0.35, delay: 0.1,
      });
    }

    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeSidebar(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full background z-50 border-b border-white/10">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Welth Logo"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center gap-6 text-white">
            <SignedOut>
              <Link href="/features" className="hover:text-[#22BDFD] transition-colors">Features</Link>
              <Link href="/about" className="hover:text-[#22BDFD] transition-colors">About</Link>
              <Link href="/faq" className="hover:text-[#22BDFD] transition-colors">FAQ</Link>
            </SignedOut>
          </div>

          {/* ================= DESKTOP RIGHT ================= */}
          <div className="hidden md:flex items-center gap-3">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="glass" className="flex items-center gap-2">
                  <LayoutDashboard size={18} /> Dashboard
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button variant="primary" className="flex items-center gap-2">
                  <PenBox size={18} /> Add
                </Button>
              </Link>
              <Link href="/ai-insights">
                <Button variant="glass" className="flex items-center gap-2">
                  <Sparkles size={18} /> AI Insights
                </Button>
              </Link>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="primary">Login</Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* ================= MOBILE RIGHT ================= */}
          <div className="md:hidden flex items-center gap-3">
            <SignedIn>
              <Link href="/ai-insights">
                <div className="inline-flex items-center justify-center rounded-md h-9 w-9
                  bg-white/5 border border-white/10 text-white/80 hover:text-white
                  hover:bg-[#22BDFD]/20 hover:border-[#22BDFD]/40 transition-all duration-300
                  shadow-sm hover:shadow-[0_0_12px_rgba(34,189,253,0.5)]">
                  <Sparkles size={18} />
                </div>
              </Link>
              <Link href="/dashboard">
                <div className="inline-flex items-center justify-center rounded-md h-9 w-9
                  bg-white/5 border border-white/10 text-white/80 hover:text-white
                  hover:bg-[#22BDFD]/20 hover:border-[#22BDFD]/40 transition-all duration-300
                  shadow-sm hover:shadow-[0_0_12px_rgba(34,189,253,0.5)]">
                  <LayoutDashboard size={18} />
                </div>
              </Link>
              <Link href="/transaction/create">
                <div className="inline-flex items-center justify-center rounded-md h-9 w-9
                  bg-white/5 border border-white/10 text-white/80 hover:text-white
                  hover:bg-[#22BDFD]/20 hover:border-[#22BDFD]/40 transition-all duration-300
                  shadow-sm hover:shadow-[0_0_12px_rgba(34,189,253,0.5)]">
                  <PenBox size={18} />
                </div>
              </Link>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <button
                onClick={openSidebar}
                className="text-white p-1 hover:text-[#22BDFD] transition-colors"
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </SignedOut>
          </div>

        </nav>
      </header>

      {/* ================= FULL SIDEBAR OVERLAY ================= */}
      <SignedOut>
        {/* Backdrop */}
        <div
          ref={overlayRef}
          onClick={closeSidebar}
          className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm md:hidden"
          style={{ opacity: 0, pointerEvents: "none" }}
        />

        {/* Sidebar panel */}
        <div
          ref={sidebarRef}
          className="fixed top-0 right-0 z-[999] h-full w-[85vw] max-w-sm md:hidden flex flex-col overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #070d14 100%)",
            borderLeft: "1px solid rgba(34,189,253,0.15)",
            transform: "translateX(100%)",
            boxShadow: "-20px 0 60px rgba(0,0,0,0.8), -4px 0 20px rgba(34,189,253,0.08)",
          }}
        >
          {/* Glow blobs */}
          <div
            ref={(el) => (decorRef.current[0] = el)}
            className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(34,189,253,0.18) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div
            ref={(el) => (decorRef.current[1] = el)}
            className="absolute bottom-[120px] left-[-40px] w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(34,189,253,0.1) 0%, transparent 70%)",
              filter: "blur(25px)",
            }}
          />

          {/* Header row */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase font-light">Navigation</span>
            <button
              onClick={closeSidebar}
              className="text-white/60 hover:text-[#22BDFD] transition-colors p-1.5 rounded-lg
                hover:bg-white/5 border border-transparent hover:border-[#22BDFD]/30"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav links — vertically centered */}
          <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
            {NAV_LINKS.map((item, i) => (
              <div
                key={i}
                ref={(el) => (linksRef.current[i] = el)}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  onClick={closeSidebar}
                  className="group flex items-center justify-between py-5
                    border-b border-white/[0.07] text-white/75 hover:text-[#22BDFD]
                    transition-all duration-300"
                >
                  <span className="text-[1.6rem] font-light tracking-wide leading-none">
                    {item}
                  </span>
                  <ChevronRight
                    size={20}
                    className="text-white/20 group-hover:text-[#22BDFD] group-hover:translate-x-1.5
                      transition-all duration-300"
                  />
                </Link>
              </div>
            ))}
          </nav>

          {/* Login CTA */}
          <div
            ref={loginRef}
            className="px-8 pb-12 pt-6 border-t border-white/10"
          >
            <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-4">
              Get Started
            </p>
            <SignInButton forceRedirectUrl="/dashboard">
              <button
                className="w-full py-4 rounded-2xl text-white font-semibold text-base
                  transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)",
                  boxShadow: "0 0 30px rgba(34,189,253,0.3), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <span className="relative z-10 tracking-wide">Login</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, #38c8ff 0%, #22BDFD 100%)",
                  }}
                />
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default Header;