
'use client';

import Link from "next/link";
export function Footer() {
  const year = new Date().getFullYear(); // ✅ dynamic — updates every year automatically

  return (
    <footer
      className="border-t border-white/10 py-8"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)" }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 pt-5">
        {/* Copyright */}
        <p className="text-white/35 text-sm tracking-wide">
          &copy; {year}{" "}
          <span className="text-[#22BDFD]/70 font-medium">Finovexa</span>
          . All rights reserved.
        </p>

        {/* Optional links */}
        <div className="flex items-center gap-6 text-white/30 text-sm">
          <Link href="/privacy" className="hover:text-[#22BDFD] transition-colors duration-200">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#22BDFD] transition-colors duration-200">
            Terms
          </Link>
          
        </div>
      </div>
    </footer>
  );
}