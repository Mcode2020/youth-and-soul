import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { PeptidesSection } from "@/components/sections/PeptidesSection";

const Peptides = () => {
  useSEOHead({
    title: "Peptides — Youth & Soul",
    description: "Browse peptides for weight loss, recovery, hormonal health, and brain health. Discount codes on every product.",
    path: "/peptides",
    keywords: "peptides, weight loss peptides, recovery peptides, hormonal peptides, brain health peptides",
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden">
      <MobileHeader />
      <main className="pt-4">
        <PeptidesSection />
      </main>
      <Footer />
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Peptides;
