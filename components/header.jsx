
  "use client";

  import React, { useRef, useState, useEffect, useCallback } from "react";
  import Link from "next/link";
  import gsap from "gsap";

  import { Button } from "./ui/button";
  import {
    PenBox,
    LayoutDashboard,
    Menu,
    X,
    Sparkles,
    ChevronRight,
    LogIn,
    UserPlus,
    Sun,
    Moon,
  } from "lucide-react";

  import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
  } from "@clerk/nextjs";

  const NAV_LINKS = ["Features", "About", "FAQ"];

  // ── Theme Toggle ────────────────────────────────────────────
  const ThemeToggle = ({ compact = false }) => {
    const [dark, setDark] = useState(true);

    useEffect(() => {
      // Read saved preference or default to dark (your current design)
      const saved = localStorage.getItem("theme");
      const prefersDark = saved
        ? saved === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }, []);

    const toggle = () => {
      const next = !dark;
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    };

    if (compact) {
      // Sidebar/mobile version — simple icon button
      return (
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: dark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)" }}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          <span style={{ fontFamily: "var(--font-poppins)" }}>
            {dark ? "Light mode" : "Dark mode"}
          </span>
        </button>
      );
    }

    // Desktop pill toggle
    return (
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
        style={{
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          border: dark
            ? "1px solid rgba(34,189,253,0.2)"
            : "1px solid rgba(14,165,233,0.25)",
          color: dark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.65)",
          boxShadow: dark
            ? "0 0 12px rgba(34,189,253,0.08)"
            : "0 0 12px rgba(14,165,233,0.06)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#22BDFD";
          e.currentTarget.style.borderColor = "rgba(34,189,253,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = dark
            ? "rgba(255,255,255,0.7)"
            : "rgba(15,23,42,0.65)";
          e.currentTarget.style.borderColor = dark
            ? "rgba(34,189,253,0.2)"
            : "rgba(14,165,233,0.25)";
        }}
      >
        <span
          className="absolute transition-all duration-300"
          style={{ opacity: dark ? 1 : 0, transform: dark ? "scale(1) rotate(0deg)" : "scale(0) rotate(90deg)" }}
        >
          <Sun size={17} />
        </span>
        <span
          className="absolute transition-all duration-300"
          style={{ opacity: dark ? 0 : 1, transform: dark ? "scale(0) rotate(-90deg)" : "scale(1) rotate(0deg)" }}
        >
          <Moon size={17} />
        </span>
      </button>
    );
  };

  // ── Finovexa wordmark ───────────────────────────────────────
  const Finovexa = () => (
    <span
      className="select-none font-extrabold tracking-tight leading-none"
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "1.6rem",
        background: "linear-gradient(135deg, #ffffff 20%, #22BDFD 60%, #0ea5e9 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: "-0.03em",
      }}
    >
      Fin<span style={{ WebkitTextFillColor: "#22BDFD", color: "#22BDFD" }}>o</span>vexa
    </span>
  );

  // Light mode wordmark variant
  const FinavexaLight = () => (
    <span
      className="select-none font-extrabold tracking-tight leading-none"
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "1.6rem",
        background: "linear-gradient(135deg, #0f172a 20%, #0ea5e9 60%, #22BDFD 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: "-0.03em",
      }}
    >
      Fin<span style={{ WebkitTextFillColor: "#0ea5e9", color: "#0ea5e9" }}>o</span>vexa
    </span>
  );

  // ── Desktop Login/Signup pill toggle ───────────────────────
  const AuthToggle = ({ isDark }) => {
    const [tab, setTab] = useState("login");

    return (
      <div
        className="relative flex items-center p-1 rounded-full"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(14,165,233,0.07)",
          border: isDark
            ? "1px solid rgba(34,189,253,0.2)"
            : "1px solid rgba(14,165,233,0.3)",
          boxShadow: "0 0 20px rgba(34,189,253,0.08)",
        }}
      >
        {/* Sliding pill */}
        <span
          className="absolute top-1 bottom-1 rounded-full pointer-events-none"
          style={{
            width: "calc(50% - 2px)",
            left: tab === "login" ? "4px" : "calc(50% - 2px)",
            background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)",
            boxShadow: "0 0 16px rgba(34,189,253,0.45)",
            transition: "left 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        />

        <SignInButton forceRedirectUrl="/dashboard">
          <button
            onMouseEnter={() => setTab("login")}
            className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              color:
                tab === "login"
                  ? "#ffffff"
                  : isDark
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(15,23,42,0.5)",
              fontFamily: "var(--font-poppins)",
              transition: "color 0.2s",
            }}
          >
            <LogIn size={14} />
            Login
          </button>
        </SignInButton>

        <SignUpButton forceRedirectUrl="/dashboard">
          <button
            onMouseEnter={() => setTab("signup")}
            className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              color:
                tab === "signup"
                  ? "#ffffff"
                  : isDark
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(15,23,42,0.5)",
              fontFamily: "var(--font-poppins)",
              transition: "color 0.2s",
            }}
          >
            <UserPlus size={14} />
            Sign Up
          </button>
        </SignUpButton>
      </div>
    );
  };

  // ── Main Header ─────────────────────────────────────────────
  const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(true);

    // Mirror the theme state so header can adapt its own colours
    useEffect(() => {
      const sync = () =>
        setIsDark(document.documentElement.classList.contains("dark"));

      // Initial read
      sync();

      // Watch for class changes driven by ThemeToggle elsewhere
      const observer = new MutationObserver(sync);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }, []);

    const overlayRef = useRef(null);
    const sidebarRef = useRef(null);
    const linksRef = useRef([]);
    const loginRef = useRef(null);
    const decorRef = useRef([]);

    const openSidebar = () => setIsOpen(true);

    const closeSidebar = useCallback(() => {
      const overlay = overlayRef.current;
      const sidebar = sidebarRef.current;
      const links = linksRef.current.filter(Boolean);
      const login = loginRef.current;

      if (!overlay || !sidebar) {
        setIsOpen(false);
        document.body.style.overflow = "";
        return;
      }

      gsap.to([...links, login].filter(Boolean), {
        x: 40, opacity: 0, stagger: 0.04, duration: 0.18,
      });
      gsap.to(sidebar, {
        x: "100%", opacity: 0, duration: 0.38, ease: "power3.in",
      });
      gsap.to(overlay, {
        opacity: 0, pointerEvents: "none", duration: 0.3, delay: 0.08,
        onComplete: () => {
          document.body.style.overflow = "";
          setIsOpen(false);
        },
      });
    }, []);

    // Scroll shadow
    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 12);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // GSAP open animation
    useEffect(() => {
      if (!isOpen) return;

      const overlay = overlayRef.current;
      const sidebar = sidebarRef.current;
      const links = linksRef.current.filter(Boolean);
      const login = loginRef.current;
      const decors = decorRef.current.filter(Boolean);

      if (!overlay || !sidebar) return;

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
    }, [isOpen]);

    // Escape key
    useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") closeSidebar(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [closeSidebar]);

    // ── Derived style values from isDark ──
    const headerBg = isDark
      ? scrolled ? "rgba(7,10,18,0.92)" : "rgba(7,10,18,0.75)"
      : scrolled ? "rgba(248,250,252,0.95)" : "rgba(248,250,252,0.85)";

    const headerBorder = isDark
      ? "1px solid rgba(34,189,253,0.12)"
      : "1px solid rgba(14,165,233,0.18)";

    const navLinkColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.65)";

    const iconBtnStyle = {
      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
      color: isDark ? "rgba(255,255,255,0.8)" : "rgba(15,23,42,0.7)",
    };

    const sidebarBg = isDark
      ? "linear-gradient(135deg, #070a12 0%, #0d1117 50%, #070d14 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0f9ff 100%)";

    const sidebarBorder = isDark
      ? "1px solid rgba(34,189,253,0.15)"
      : "1px solid rgba(14,165,233,0.2)";

    const sidebarShadow = isDark
      ? "-20px 0 60px rgba(0,0,0,0.8), -4px 0 20px rgba(34,189,253,0.08)"
      : "-20px 0 60px rgba(0,0,0,0.12), -4px 0 20px rgba(14,165,233,0.06)";

    return (
      <>
        <header
          className="fixed top-0 w-full z-50 transition-all duration-300"
          style={{
            background: headerBg,
            backdropFilter: "blur(18px)",
            borderBottom: headerBorder,
            boxShadow: scrolled
              ? isDark
                ? "0 4px 30px rgba(0,0,0,0.5)"
                : "0 4px 30px rgba(0,0,0,0.08)"
              : "none",
          }}
        >
          <nav className="container mx-auto px-4 py-3.5 flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform
                  duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)",
                  boxShadow: "0 0 18px rgba(34,189,253,0.4)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 10H12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              {isDark ? <Finovexa /> : <FinavexaLight />}
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-6">
              <SignedOut>
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm font-medium hover:text-[#22BDFD] transition-colors duration-200 relative group"
                    style={{ color: navLinkColor, fontFamily: "var(--font-poppins)" }}
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22BDFD]
                      group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </SignedOut>
            </div>

            {/* DESKTOP RIGHT */}
            <div className="hidden md:flex items-center gap-3">
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="glass" className="flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Button>
                </Link>
                <Link href="/transaction/create">
                  <Button variant="primary" className="flex items-center gap-2">
                    <PenBox size={16} /> Add
                  </Button>
                </Link>
                <Link href="/ai-insights">
                  <Button variant="glass" className="flex items-center gap-2">
                    <Sparkles size={16} /> AI Insights
                  </Button>
                </Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <AuthToggle isDark={isDark} />
              </SignedOut>
              {/* Theme toggle — always visible on desktop */}
              <ThemeToggle />
            </div>

            {/* MOBILE RIGHT */}
            <div className="md:hidden flex items-center gap-2.5">
              <SignedIn>
                <Link href="/ai-insights">
                  <div
                    className="inline-flex items-center justify-center rounded-xl h-9 w-9
                      hover:text-white hover:bg-[#22BDFD]/20 hover:border-[#22BDFD]/40
                      transition-all duration-300"
                    style={iconBtnStyle}
                  >
                    <Sparkles size={16} />
                  </div>
                </Link>
                <Link href="/dashboard">
                  <div
                    className="inline-flex items-center justify-center rounded-xl h-9 w-9
                      hover:text-white hover:bg-[#22BDFD]/20 hover:border-[#22BDFD]/40
                      transition-all duration-300"
                    style={iconBtnStyle}
                  >
                    <LayoutDashboard size={16} />
                  </div>
                </Link>
                <Link href="/transaction/create">
                  <div
                    className="inline-flex items-center justify-center rounded-xl h-9 w-9
                      hover:text-white hover:bg-[#22BDFD]/20 hover:border-[#22BDFD]/40
                      transition-all duration-300"
                    style={iconBtnStyle}
                  >
                    <PenBox size={16} />
                  </div>
                </Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                {/* Theme toggle visible on mobile too */}
                <ThemeToggle />
                <button
                  onClick={openSidebar}
                  className="p-1.5 hover:text-[#22BDFD] transition-colors rounded-lg hover:bg-white/5"
                  style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(15,23,42,0.7)" }}
                  aria-label="Open menu"
                >
                  <Menu size={26} />
                </button>
              </SignedOut>
            </div>

          </nav>
        </header>

        {/* ── MOBILE SIDEBAR ── */}
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
              background: sidebarBg,
              borderLeft: sidebarBorder,
              transform: "translateX(100%)",
              boxShadow: sidebarShadow,
            }}
          >
            {/* Glow blobs */}
            <div
              ref={(el) => (decorRef.current[0] = el)}
              className="absolute top-[-60px] right-[-60px] w-52 h-52 rounded-full pointer-events-none"
              style={{
                background: isDark
                  ? "radial-gradient(circle, rgba(34,189,253,0.2) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(34,189,253,0.12) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <div
              ref={(el) => (decorRef.current[1] = el)}
              className="absolute bottom-[120px] left-[-40px] w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: isDark
                  ? "radial-gradient(circle, rgba(34,189,253,0.1) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
                filter: "blur(25px)",
              }}
            />

            {/* Sidebar top */}
            <div
              className="flex items-center justify-between px-6 pt-6 pb-4"
              style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)" }}
            >
              <Link href="/" onClick={closeSidebar} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.5 10H12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {isDark ? <Finovexa /> : <FinavexaLight />}
              </Link>
              <button
                onClick={closeSidebar}
                className="hover:text-[#22BDFD] transition-colors p-1.5 rounded-lg
                  hover:bg-white/5 border border-transparent hover:border-[#22BDFD]/30"
                style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.4)" }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {NAV_LINKS.map((item, i) => (
                <div key={i} ref={(el) => (linksRef.current[i] = el)}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    onClick={closeSidebar}
                    className="group flex items-center justify-between py-5 transition-all duration-300"
                    style={{
                      borderBottom: isDark
                        ? "1px solid rgba(255,255,255,0.07)"
                        : "1px solid rgba(0,0,0,0.06)",
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.65)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#22BDFD"; }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(15,23,42,0.65)";
                    }}
                  >
                    <span
                      className="text-[1.5rem] font-light tracking-wide leading-none"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {item}
                    </span>
                    <ChevronRight
                      size={18}
                      className="group-hover:text-[#22BDFD] group-hover:translate-x-1.5 transition-all duration-300"
                      style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Auth CTA + Theme Toggle */}
            <div
              ref={loginRef}
              className="px-8 pb-12 pt-6 space-y-3"
              style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.35)",
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  Get Started
                </p>
                {/* Theme toggle inside sidebar */}
                <ThemeToggle compact />
              </div>

              <SignInButton forceRedirectUrl="/dashboard">
                <button
                  onClick={closeSidebar}
                  className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm
                    transition-all duration-300 relative overflow-hidden group flex items-center
                    justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)",
                    boxShadow: "0 0 28px rgba(34,189,253,0.3), 0 4px 20px rgba(0,0,0,0.4)",
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn size={15} />
                    Login
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #38c8ff 0%, #22BDFD 100%)" }}
                  />
                </button>
              </SignInButton>

              <SignUpButton forceRedirectUrl="/dashboard">
                <button
                  onClick={closeSidebar}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm
                    transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: isDark ? "rgba(34,189,253,0.08)" : "rgba(14,165,233,0.07)",
                    border: "1px solid rgba(34,189,253,0.3)",
                    color: "#22BDFD",
                    fontFamily: "var(--font-poppins)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(34,189,253,0.15)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(34,189,253,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDark
                      ? "rgba(34,189,253,0.08)"
                      : "rgba(14,165,233,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <UserPlus size={15} />
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
      </>
    );
  };

  export default Header;
