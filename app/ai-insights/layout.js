import Header from "@/components/header";
import { Footer } from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {children}
      </main>
      <Footer />
    </>
  );
}