import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { PodcastSection } from "@/components/sections/PodcastSection";
import { RankingsSection } from "@/components/sections/RankingsSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { InfluencerSection } from "@/components/sections/InfluencerSection";

const Explore = () => {
  useSEOHead({
    title: "Explore — Podcasts, Rankings & Community | Youth & Soul",
    description: "Listen, watch and learn from top health podcasts. View weekly product rankings and join the Youth & Soul community.",
    path: "/explore",
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden">
      <MobileHeader />
      <main>
        <section className="py-10 md:py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              Explore & <span className="text-primary">Learn</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Podcasts, community insights, weekly rankings, and opportunities to grow with Youth & Soul.
            </p>
          </div>
        </section>

        {/* Community Section */}
        <div id="community-explore-section">
          <CommunitySection />
        </div>

        <div id="podcast-section">
          <PodcastSection />
        </div>

        <div id="rankings-section">
          <RankingsSection />
        </div>

        <InfluencerSection />
      </main>
      <Footer />
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Explore;