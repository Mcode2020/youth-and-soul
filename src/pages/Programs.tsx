import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { MonthlyProgramSection } from "@/components/sections/MonthlyProgramSection";
import { useSEOHead } from "@/hooks/useSEOHead";
import { useEffect } from "react";

export default function Programs() {
  useSEOHead({
    title: "Monthly Health Programs",
    description:
      "Browse all Youth & Soul monthly telehealth programs — weight loss, hormone therapy, sexual health, mental health, hair regrowth and longevity peptides.",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobileHeader />
      <main className="flex-1 pt-6 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 mb-2 md:mb-6">
          <p className="text-xs md:text-sm text-muted-foreground tracking-wide uppercase">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span className="mx-2">›</span>
            <span className="text-foreground">Programs</span>
          </p>
        </div>
        <MonthlyProgramSection />
      </main>
      <Footer />
    </div>
  );
}
