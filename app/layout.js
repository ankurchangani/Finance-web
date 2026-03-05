import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ClerkProvider appearance={{
          theme: dark,
        }}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Header />
            <main className="min-h-screen bg-background text-foreground">
              {children}
            </main>
            <Toaster richColors />
            <footer className=" border-t border-border py-10 bg-background">
              <div className="container mx-auto text-center text-muted-foreground">
                © 2026 Welth. All rights reserved.
              </div>
            </footer>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

