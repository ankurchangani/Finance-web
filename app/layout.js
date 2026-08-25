import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/providers/toaster-provider";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";
import GSAPProvider from "@/components/providers/gsap-provider";
import { SitePreloader } from "@/components/ui/site-preloader";
import { RouteChangeLoader } from "@/app/(main)/dashboard/_components/route-change-loader";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Finovexa — AI Financial Management Platform",
  description: "Track, analyze, and optimize your personal & business finances with AI intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${montserrat.variable} ${poppins.variable} font-poppins bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <ClerkProvider
          appearance={{ theme: dark }}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GSAPProvider>
              <SitePreloader />
              <RouteChangeLoader />
              {children}
              <Toaster richColors position="bottom-right" />
            </GSAPProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}