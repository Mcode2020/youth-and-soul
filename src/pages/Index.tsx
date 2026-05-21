import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { StickyCategoryNav } from "@/components/layout/StickyCategoryNav";
import { Reveal } from "@/components/ui/Reveal";
import { HeroSearchSection } from "@/components/sections/HeroSearchSection";
import { ScrollingTrustBanner } from "@/components/sections/ScrollingTrustBanner";
import { AffiliateBanner } from "@/components/sections/AffiliateBanner";

import { ComparisonTableSection } from "@/components/sections/ComparisonTableSection";
import { HomeEligibilityQuiz } from "@/components/conversion/HomeEligibilityQuiz";
// StickyEnrollCTA removed per request

import { HealthProgramsCTA } from "@/components/sections/HealthProgramsCTA";
import { NewReleaseBanner } from "@/components/sections/NewReleaseBanner";
import { BrandedProductsBanner } from "@/components/sections/BrandedProductsBanner";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { WeightLossShowcase } from "@/components/sections/WeightLossShowcase";
import { MenopauseShowcase } from "@/components/sections/MenopauseShowcase";
import { SexualHealthShowcase } from "@/components/sections/SexualHealthShowcase";
import { SexualHealthProductCards } from "@/components/sections/SexualHealthProductCards";
import { BrainCognitiveShowcase } from "@/components/sections/BrainCognitiveShowcase";
import { InsuranceTrustBanner } from "@/components/sections/InsuranceTrustBanner";
import { GutHealthShowcase } from "@/components/sections/GutHealthShowcase";
import { HairLossShowcase } from "@/components/sections/HairLossShowcase";
import { SkinShowcase } from "@/components/sections/SkinShowcase";
import { MentalHealthShowcase } from "@/components/sections/MentalHealthShowcase";
import { SkinStatsBanner } from "@/components/sections/SkinStatsBanner";
import { WeightLossStatsBanner } from "@/components/sections/WeightLossStatsBanner";
import { BrainStatsBanner } from "@/components/sections/BrainStatsBanner";
import { HairStatsBanner } from "@/components/sections/HairStatsBanner";
import { MentalHealthStatsBanner } from "@/components/sections/MentalHealthStatsBanner";
import { ProductCardsRow } from "@/components/sections/ProductCardsRow";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { CategoriesSection } from "@/components/sections/CategoriesSection";

import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ExpertSection } from "@/components/sections/ExpertSection";
import { MonthlyProgramSection } from "@/components/sections/MonthlyProgramSection";
import { LegalDisclaimer } from "@/components/sections/LegalDisclaimer";
import { AdvertiserCTA } from "@/components/sections/AdvertiserCTA";
import { NutrafolBanner } from "@/components/sections/NutrafolBanner";
import { SellerSection } from "@/components/sections/SellerSection";
import { TrustGuaranteeBanner } from "@/components/sections/TrustGuaranteeBanner";
import { FAQSection } from "@/components/sections/FAQSection";

const Index = () => {
  useSEOHead({
    title: "Youth & Soul — The Longevity & Health Marketplace",
    description: "Discount codes on anti-aging supplements, functional beauty & age reversal procedures. Get a GLP-1 prescription in 5 mins with 24/7 doctor support.",
    path: "/",
    keywords: "longevity marketplace, anti-aging supplements, GLP-1 weight loss, telehealth programs, peptides, hair loss treatment, menopause HRT, gut health, mental health therapy, skin care, Youth and Soul, discount codes, NAD+",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Youth & Soul?",
          acceptedAnswer: { "@type": "Answer", text: "Youth & Soul is a curated longevity and health marketplace offering doctor-prescribed telehealth programs (GLP-1, HRT, peptides), top-rated supplements, and exclusive brand discount codes." },
        },
        {
          "@type": "Question",
          name: "How do I get a GLP-1 prescription?",
          acceptedAnswer: { "@type": "Answer", text: "Complete our 5-minute online intake. A licensed clinician reviews your application within 24 hours. If approved, your medication ships free. Full refund if not approved." },
        },
        {
          "@type": "Question",
          name: "Are there hidden fees or membership costs?",
          acceptedAnswer: { "@type": "Answer", text: "No. Youth & Soul has no membership or hidden fees. You only pay the program price listed, and you can cancel anytime." },
        },
        {
          "@type": "Question",
          name: "Which telehealth programs do you offer?",
          acceptedAnswer: { "@type": "Answer", text: "We offer Weight Loss (GLP-1), Menopause & HRT, Sexual Health, Skin & Hair, Longevity, Pain & Recovery, Brain & Cognitive, Gut Health, Mental Health, and Hot Health: Looks & Beauty programs." },
        },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-clip">
      <MobileHeader />
      
      <main>
        <HeroSearchSection />
        <ScrollingTrustBanner />
        <StickyCategoryNav />

        <NewReleaseBanner />
        <HealthProgramsCTA />
        <HomeEligibilityQuiz />
        <MonthlyProgramSection />
        <HowItWorksSection />

        

        <div id="weight-loss-section">
          <WeightLossShowcase />
        </div>
        <AffiliateBanner />
        <ProductCardsRow />
        <BeforeAfterShowcase />
        <WeightLossStatsBanner />

        {/* Longevity, Anti-Aging & Skincare — moved above menopause */}
        <div id="skin-section"><SkinShowcase /></div>
        <SkinStatsBanner />

        <div id="menopause-section">
          <MenopauseShowcase />
        </div>
        <div id="sexual-health-section">
          <SexualHealthShowcase />
        </div>
        <SexualHealthProductCards />
        <div id="mental-health-section">
          <MentalHealthShowcase />
        </div>
        <MentalHealthStatsBanner />
        <div id="hair-loss-section">
          <HairLossShowcase />
        </div>
        <HairStatsBanner />
        <div id="brain-section">
          <BrainCognitiveShowcase />
        </div>
        <BrainStatsBanner />
        <GutHealthShowcase />

        <InsuranceTrustBanner />

        <div id="expert-section">
          <ExpertSection />
        </div>

        <div id="testimonials-section">
          <TestimonialsCarousel />
        </div>

        <NutrafolBanner />


        <div id="categories-section">
          <CategoriesSection />
        </div>

        <BrandedProductsBanner />
        <FAQSection />
        <ComparisonTableSection />
        <TrustGuaranteeBanner />

        {/* Moved above legal disclaimer */}
        <SellerSection />

        <LegalDisclaimer />
      </main>

      <Footer />

      

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
