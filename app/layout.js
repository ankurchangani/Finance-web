import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} font-poppins`}>
        <ClerkProvider
          appearance={{ theme: dark }}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}