
"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  PenBox, LayoutDashboard, Menu, X,
  Sparkles, ChevronRight, LogIn, UserPlus,
  Dna, Telescope, Scale,
} from "lucide-react";
import {
  SignedIn, SignedOut, SignInButton,
  SignUpButton, UserButton,
} from "@clerk/nextjs";

const NAV_LINKS = ["Features", "About", "FAQ"];

const Finovexa = () => (
  <span
    className="select-none font-extrabold tracking-tight leading-none"
    style={{
      fontFamily: "var(--font-montserrat)",
      fontSize: "1.6rem",
      letterSpacing: "-0.03em",
      background: "linear-gradient(135deg, #ffffff 20%, #22BDFD 60%, #0ea5e9 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    Fin
    <span style={{ WebkitTextFillColor: "#22BDFD", color: "#22BDFD" }}>o</span>
    vexa
  </span>
);

const AuthToggle = () => {
  const [tab, setTab] = useState("login");
  return (
    <div className="relative flex items-center p-1 rounded-full bg-white/[0.06] border border-[#22BDFD]/20 shadow-[0_0_20px_rgba(34,189,253,0.08)]">
      <span
        className="absolute top-1 bottom-1 rounded-full pointer-events-none bg-gradient-to-r from-[#22BDFD] to-[#0ea5e9] shadow-[0_0_16px_rgba(34,189,253,0.45)] transition-all duration-300"
        style={{ width: "calc(50% - 2px)", left: tab === "login" ? "4px" : "calc(50% - 2px)" }}
      />
      <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
        <button onMouseEnter={() => setTab("login")}
          className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
          style={{ color: tab === "login" ? "#ffffff" : undefined, fontFamily: "var(--font-poppins)" }}>
          <span className={tab !== "login" ? "text-foreground/50" : ""}><LogIn size={14} /></span>
          <span className={tab !== "login" ? "text-foreground/50" : ""}>Login</span>
        </button>
      </SignInButton>
      <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
        <button onMouseEnter={() => setTab("signup")}
          className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
          style={{ color: tab === "signup" ? "#ffffff" : undefined, fontFamily: "var(--font-poppins)" }}>
          <span className={tab !== "signup" ? "text-foreground/50" : ""}><UserPlus size={14} /></span>
          <span className={tab !== "signup" ? "text-foreground/50" : ""}>Sign Up</span>
        </button>
      </SignUpButton>
    </div>
  );
};

const MobileIconBtn = ({ href, children }) => (
  <Link href={href}>
    <div className="inline-flex items-center justify-center rounded-xl h-9 w-9 hover:text-[#22BDFD] hover:bg-[#22BDFD]/10 hover:border-[#22BDFD]/40 border transition-all duration-300"
      style={{ background: "var(--icon-btn-bg)", borderColor: "var(--icon-btn-border)", color: "var(--icon-btn-color)" }}>
      {children}
    </div>
  </Link>
);

// ─── Animated NavBtn factory ───────────────────────────────────────────────────
const NavBtn = ({ href, icon: Icon, label, gradient, glowColor, border, textColor }) => {
  const btnRef = useRef(null);
  const iconRef = useRef(null);
  const glowRef = useRef(null);

  const hoverIn = () => {
    gsap.to(btnRef.current, { scale: 1.06, boxShadow: `0 0 22px ${glowColor}`, duration: 0.22, ease: "power2.out" });
    gsap.to(glowRef.current, { opacity: 1, duration: 0.22 });
    gsap.to(iconRef.current, { rotate: -12, scale: 1.2, duration: 0.28, ease: "back.out(2)" });
  };
  const hoverOut = () => {
    gsap.to(btnRef.current, { scale: 1, boxShadow: "0 0 0px rgba(0,0,0,0)", duration: 0.28, ease: "power2.inOut" });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.28 });
    gsap.to(iconRef.current, { rotate: 0, scale: 1, duration: 0.28 });
  };
  const click = () => gsap.to(btnRef.current, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 });

  return (
    <Link href={href}>
      <div ref={btnRef} onMouseEnter={hoverIn} onMouseLeave={hoverOut} onClick={click}
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer overflow-hidden"
        style={{ background: gradient, border, color: textColor, fontFamily: "var(--font-poppins)", fontSize: "0.8rem", fontWeight: 600 }}>
        <div ref={glowRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0, background: gradient }} />
        <span ref={iconRef} className="relative z-10 flex items-center"><Icon size={15} /></span>
        <span className="relative z-10 hidden lg:inline">{label}</span>
      </div>
    </Link>
  );
};

// ─── Special solid AddBtn ──────────────────────────────────────────────────────
const AddBtn = () => {
  const btnRef = useRef(null);
  const iconRef = useRef(null);
  const rippleRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(btnRef.current, { scale: 1.06, duration: 0.22, ease: "power2.out" });
    gsap.to(iconRef.current, { rotate: 90, duration: 0.35, ease: "back.out(2)" });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "power2.inOut" });
    gsap.to(iconRef.current, { rotate: 0, duration: 0.3 });
  };
  const handleClick = () => {
    gsap.fromTo(rippleRef.current, { scale: 0, opacity: 0.5 }, { scale: 3, opacity: 0, duration: 0.5 });
    gsap.to(btnRef.current, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 });
  };

  return (
    <Link href="/transaction/create">
      <div ref={btnRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer overflow-hidden"
        style={{ background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)", boxShadow: "0 0 16px rgba(34,189,253,0.35)", color: "#fff", fontFamily: "var(--font-poppins)", fontSize: "0.8rem", fontWeight: 600 }}>
        <div ref={rippleRef} className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white pointer-events-none" style={{ opacity: 0 }} />
        <span ref={iconRef} className="relative z-10 flex items-center"><PenBox size={15} /></span>
        <span className="relative z-10 hidden lg:inline">Add</span>
      </div>
    </Link>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const overlayRef = useRef(null);
  const sidebarRef = useRef(null);
  const linksRef = useRef([]);
  const loginRef = useRef(null);
  const decorRef = useRef([]);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => {
    const overlay = overlayRef.current;
    const sidebar = sidebarRef.current;
    const links = linksRef.current.filter(Boolean);
    const login = loginRef.current;
    if (!overlay || !sidebar) { setIsOpen(false); document.body.style.overflow = ""; return; }
    gsap.to([...links, login].filter(Boolean), { x: 40, opacity: 0, stagger: 0.04, duration: 0.18 });
    gsap.to(sidebar, { x: "100%", opacity: 0, duration: 0.38, ease: "power3.in" });
    gsap.to(overlay, { opacity: 0, pointerEvents: "none", duration: 0.3, delay: 0.08, onComplete: () => { document.body.style.overflow = ""; setIsOpen(false); } });
  }, []);

  useEffect(() => {
    gsap.fromTo(headerRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    const sidebar = sidebarRef.current;
    if (!overlay || !sidebar) return;
    const links = linksRef.current.filter(Boolean);
    const login = loginRef.current;
    const decors = decorRef.current.filter(Boolean);
    document.body.style.overflow = "hidden";
    gsap.fromTo(overlay, { opacity: 0, pointerEvents: "none" }, { opacity: 1, pointerEvents: "all", duration: 0.35 });
    gsap.fromTo(sidebar, { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.5, ease: "power4.out" });
    gsap.fromTo(decors, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, delay: 0.2, ease: "back.out(1.7)" });
    gsap.fromTo(links, { x: 60, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.12, duration: 0.5, delay: 0.3, ease: "power3.out" });
    if (login) gsap.fromTo(login, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.6, ease: "power3.out" });
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeSidebar(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSidebar]);

  // ── All signed-in nav buttons ──────────────────────────────────────────────
  const signedInBtns = [
    { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard",  gradient: "linear-gradient(135deg,rgba(34,189,253,0.12),rgba(14,165,233,0.08))", glowColor: "rgba(34,189,253,0.45)", border: "1px solid rgba(34,189,253,0.3)", textColor: "#22BDFD" },

    { href: "/ai-insights",   icon: Sparkles,        label: "AI Insights", gradient: "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(139,92,246,0.08))", glowColor: "rgba(168,85,247,0.4)",  border: "1px solid rgba(168,85,247,0.3)", textColor: "#a855f7" },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrolled ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--nav-border)",
          boxShadow: scrolled ? "var(--nav-shadow-scrolled)" : "none",
        }}
      >
        <nav className="container mx-auto px-4 py-3.5 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)", boxShadow: "0 0 18px rgba(34,189,253,0.4)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 10H12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <Finovexa />
          </Link>

          {/* DESKTOP NAV LINKS (signed out) */}
          <div className="hidden md:flex items-center gap-6">
            <SignedOut>
              {NAV_LINKS.map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`}
                  className="text-sm font-medium hover:text-[#22BDFD] transition-colors duration-200 relative group"
                  style={{ color: "var(--nav-link)", fontFamily: "var(--font-poppins)" }}>
                  {item}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22BDFD] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </SignedOut>
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-2">
            <SignedIn>
              {signedInBtns.map((b) => <NavBtn key={b.href} {...b} />)}
              <AddBtn />
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
            </SignedIn>
            <SignedOut>
              <AuthToggle />
            </SignedOut>
          </div>

          {/* MOBILE RIGHT */}
          <div className="md:hidden flex items-center gap-2">
            <SignedIn>
              <MobileIconBtn href="/spending-dna"><Dna size={15} /></MobileIconBtn>
              <MobileIconBtn href="/cash-oracle"><Telescope size={15} /></MobileIconBtn>
              <MobileIconBtn href="/budget-ai"><Scale size={15} /></MobileIconBtn>
              <MobileIconBtn href="/ai-insights"><Sparkles size={15} /></MobileIconBtn>
              <MobileIconBtn href="/dashboard"><LayoutDashboard size={15} /></MobileIconBtn>
              <MobileIconBtn href="/transaction/create"><PenBox size={15} /></MobileIconBtn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <button onClick={openSidebar}
                className="p-1.5 hover:text-[#22BDFD] transition-colors rounded-lg hover:bg-white/5"
                style={{ color: "var(--icon-btn-color)" }} aria-label="Open menu">
                <Menu size={26} />
              </button>
            </SignedOut>
          </div>
        </nav>
      </header>

      {/* MOBILE SIDEBAR */}
      <SignedOut>
        <div ref={overlayRef} onClick={closeSidebar}
          className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm md:hidden"
          style={{ opacity: 0, pointerEvents: "none" }} />

        <div ref={sidebarRef}
          className="fixed top-0 right-0 z-[999] h-full w-[85vw] max-w-sm md:hidden flex flex-col overflow-hidden"
          style={{ background: "var(--sidebar-bg)", borderLeft: "1px solid var(--sidebar-border)", transform: "translateX(100%)", boxShadow: "var(--sidebar-shadow)" }}>
          <div ref={(el) => (decorRef.current[0] = el)} className="absolute top-[-60px] right-[-60px] w-52 h-52 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34,189,253,0.18) 0%, transparent 70%)", filter: "blur(30px)" }} />
          <div ref={(el) => (decorRef.current[1] = el)} className="absolute bottom-[120px] left-[-40px] w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34,189,253,0.1) 0%, transparent 70%)", filter: "blur(25px)" }} />

          {/* Sidebar Top */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--sidebar-top-border)" }}>
            <Link href="/" onClick={closeSidebar} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)" }}>
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.5 10H12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <Finovexa />
            </Link>
            <button onClick={closeSidebar}
              className="hover:text-[#22BDFD] transition-colors p-1.5 rounded-lg hover:bg-[#22BDFD]/10 border border-transparent hover:border-[#22BDFD]/30"
              style={{ color: "var(--close-btn-color)" }} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
            {NAV_LINKS.map((item, i) => (
              <div key={i} ref={(el) => (linksRef.current[i] = el)}>
                <Link href={`/${item.toLowerCase()}`} onClick={closeSidebar}
                  className="group flex items-center justify-between py-5 transition-all duration-300 hover:text-[#22BDFD]"
                  style={{ borderBottom: "1px solid var(--sidebar-link-border)", color: "var(--sidebar-link-color)" }}>
                  <span className="text-[1.5rem] font-light tracking-wide leading-none" style={{ fontFamily: "var(--font-montserrat)" }}>{item}</span>
                  <ChevronRight size={18} className="group-hover:text-[#22BDFD] group-hover:translate-x-1.5 transition-all duration-300" style={{ color: "var(--sidebar-link-border)" }} />
                </Link>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div ref={loginRef} className="px-8 pb-12 pt-6 space-y-3" style={{ borderTop: "1px solid var(--sidebar-bottom-border)" }}>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: "var(--label-color)", fontFamily: "var(--font-poppins)" }}>Get Started</p>
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
              <button onClick={closeSidebar} className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-2 active:scale-95"
                style={{ background: "linear-gradient(135deg, #22BDFD 0%, #0ea5e9 100%)", boxShadow: "0 0 28px rgba(34,189,253,0.3), 0 4px 20px rgba(0,0,0,0.2)", fontFamily: "var(--font-poppins)" }}>
                <span className="relative z-10 flex items-center gap-2"><LogIn size={15} /> Login</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #38c8ff 0%, #22BDFD 100%)" }} />
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
              <button onClick={closeSidebar} className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                style={{ background: "rgba(34,189,253,0.08)", border: "1px solid rgba(34,189,253,0.3)", color: "#22BDFD", fontFamily: "var(--font-poppins)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,189,253,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,189,253,0.08)"; }}>
                <UserPlus size={15} /> Create Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default Header;