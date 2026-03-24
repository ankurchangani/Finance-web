

export function Footer() {
  const year = new Date().getFullYear(); // ✅ dynamic — updates every year automatically

  return (
    <footer
      className="border-t border-white/10 py-8"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)" }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-white/35 text-sm tracking-wide">
          &copy; {year}{" "}
          <span className="text-[#22BDFD]/70 font-medium">Welth</span>
          . All rights reserved.
        </p>

        {/* Optional links */}
        <div className="flex items-center gap-6 text-white/30 text-sm">
          <a href="/privacy" className="hover:text-[#22BDFD] transition-colors duration-200">
            Privacy
          </a>
          <a href="/terms" className="hover:text-[#22BDFD] transition-colors duration-200">
            Terms
          </a>
          <a href="/contact" className="hover:text-[#22BDFD] transition-colors duration-200">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}