import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellerSection } from "./SellerSection";
import { InfluencerSection } from "./InfluencerSection";
import { LearnSection } from "./LearnSection";
import { ReviewsSection } from "./ReviewsSection";
import { Users, Megaphone, BookOpen, Star } from "lucide-react";
// Using a young, vibrant community image
const communityBannerUrl = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";


export const CommunitySection = () => {
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    if (value === "learn") {
      navigate("/learn");
    }
  };

  return (
    <section className="py-8 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Hero Banner */}
        <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden mb-6">
          <img 
            src={communityBannerUrl}
            alt="Youth & Soul Community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium mb-2">
              <Users className="w-3 h-3" />
              Community Hub
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Join Our Community
            </h2>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="sellers" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full grid grid-cols-4 mb-6 h-auto p-1 bg-muted/50">
            <TabsTrigger value="sellers" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 text-xs md:text-sm data-[state=active]:bg-background">
              <Users className="w-4 h-4" />
              <span>Sell</span>
            </TabsTrigger>
            <TabsTrigger value="influencers" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 text-xs md:text-sm data-[state=active]:bg-background">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Influence</span>
              <span className="sm:hidden">Earn</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 text-xs md:text-sm data-[state=active]:bg-background">
              <BookOpen className="w-4 h-4" />
              <span>Learn</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 text-xs md:text-sm data-[state=active]:bg-background">
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sellers" className="mt-0">
            <div className="-mx-4 -mb-8"><SellerSection /></div>
          </TabsContent>
          <TabsContent value="influencers" className="mt-0">
            <div className="-mx-4 -mb-8"><InfluencerSection /></div>
          </TabsContent>
          <TabsContent value="learn" className="mt-0">
            <div className="-mx-4 -mb-8"><LearnSection /></div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-0">
            <div className="-mx-4 -mb-8"><ReviewsSection /></div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
