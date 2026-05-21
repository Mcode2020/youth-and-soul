import { Star, ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import weightLoss1 from "@/assets/results/weight-loss-1.jpg";
import weightLoss2 from "@/assets/results/weight-loss-2.jpg";
import hair1 from "@/assets/results/hair-1.jpg";
import skin1 from "@/assets/results/skin-1.jpg";
import longevity1 from "@/assets/results/longevity-1.jpg";
import sexualHealth1 from "@/assets/results/sexual-health-1.jpg";
import pain1 from "@/assets/results/pain-1.jpg";
import menopause1 from "@/assets/results/menopause-1.jpg";

interface ResultCard {
  name: string;
  age: number | null;
  image_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  stat: string;
  stat_label: string;
  duration: string;
  rating: number;
  quote: string;
  tier: string | null;
}

const fallbackResults: Record<string, ResultCard[]> = {
  "weight-loss": [
    { name: "Sarah M.", age: 34, image_url: weightLoss1, before_image_url: null, after_image_url: null, stat: "-47 lbs", stat_label: "Weight Lost", duration: "16 weeks", rating: 5, quote: "I finally feel like myself again. The GLP-1 program changed everything.", tier: "Level 2" },
    { name: "James K.", age: 42, image_url: weightLoss2, before_image_url: null, after_image_url: null, stat: "-38 lbs", stat_label: "Weight Lost", duration: "12 weeks", rating: 5, quote: "The appetite suppression was incredible. I didn't feel deprived at all.", tier: "Level 3" },
    { name: "Maria L.", age: 29, image_url: weightLoss1, before_image_url: null, after_image_url: null, stat: "-52 lbs", stat_label: "Weight Lost", duration: "20 weeks", rating: 5, quote: "Best decision I ever made. My energy levels are through the roof.", tier: "Level 2" },
    { name: "David R.", age: 51, image_url: weightLoss2, before_image_url: null, after_image_url: null, stat: "-31 lbs", stat_label: "Weight Lost", duration: "10 weeks", rating: 4, quote: "At my age I thought it was impossible. This program proved me wrong.", tier: "Level 1" },
    { name: "Ashley T.", age: 37, image_url: weightLoss1, before_image_url: null, after_image_url: null, stat: "-44 lbs", stat_label: "Weight Lost", duration: "14 weeks", rating: 5, quote: "My doctor is amazed at my bloodwork improvements. Total transformation.", tier: "Level 3" },
    { name: "Chris P.", age: 45, image_url: weightLoss2, before_image_url: null, after_image_url: null, stat: "-29 lbs", stat_label: "Weight Lost", duration: "8 weeks", rating: 5, quote: "The Tirzepatide combo was a game changer for my metabolism.", tier: "Level 3" },
  ],
  "skin-hair": [
    { name: "Michael B.", age: 38, image_url: hair1, before_image_url: null, after_image_url: null, stat: "70%", stat_label: "Regrowth", duration: "12 weeks", rating: 5, quote: "Visible new growth in just 8 weeks. My confidence is back.", tier: "Best" },
    { name: "Emma S.", age: 44, image_url: skin1, before_image_url: null, after_image_url: null, stat: "Radiant", stat_label: "Skin Clarity", duration: "6 weeks", rating: 5, quote: "My skin looks 10 years younger. The tretinoin stack is incredible.", tier: "Best" },
    { name: "Ryan D.", age: 31, image_url: hair1, before_image_url: null, after_image_url: null, stat: "85%", stat_label: "Coverage", duration: "16 weeks", rating: 4, quote: "The Minoxidil + Finasteride combo filled in my temples completely.", tier: "Best" },
    { name: "Lisa W.", age: 52, image_url: skin1, before_image_url: null, after_image_url: null, stat: "Smooth", stat_label: "Texture", duration: "10 weeks", rating: 5, quote: "Fine lines around my eyes significantly reduced.", tier: "Better" },
    { name: "Tom H.", age: 35, image_url: hair1, before_image_url: null, after_image_url: null, stat: "60%", stat_label: "Density", duration: "8 weeks", rating: 4, quote: "Oral Minoxidil alone made a noticeable difference.", tier: "Good" },
  ],
  "sexual-health": [
    { name: "Mark R.", age: 47, image_url: sexualHealth1, before_image_url: null, after_image_url: null, stat: "100%", stat_label: "Confidence", duration: "4 weeks", rating: 5, quote: "This program gave me my confidence back.", tier: "Tadalafil" },
    { name: "Daniel F.", age: 39, image_url: sexualHealth1, before_image_url: null, after_image_url: null, stat: "Restored", stat_label: "Performance", duration: "2 weeks", rating: 5, quote: "Fast results and discreet delivery.", tier: "Sildenafil" },
    { name: "Kevin S.", age: 55, image_url: sexualHealth1, before_image_url: null, after_image_url: null, stat: "Enhanced", stat_label: "Intimacy", duration: "6 weeks", rating: 5, quote: "The Tadalafil + Oxytocin combo is incredible.", tier: "Tadalafil+" },
  ],
  "longevity": [
    { name: "Patricia K.", age: 58, image_url: longevity1, before_image_url: null, after_image_url: null, stat: "+40%", stat_label: "Energy", duration: "8 weeks", rating: 5, quote: "NAD+ spray changed my mornings.", tier: "Better" },
    { name: "William M.", age: 49, image_url: longevity1, before_image_url: null, after_image_url: null, stat: "Sharp", stat_label: "Focus", duration: "6 weeks", rating: 5, quote: "Methylene Blue improved my cognitive function.", tier: "Good" },
    { name: "Susan L.", age: 62, image_url: longevity1, before_image_url: null, after_image_url: null, stat: "Optimal", stat_label: "Biomarkers", duration: "16 weeks", rating: 5, quote: "My doctor was shocked at my bloodwork improvements.", tier: "Best" },
  ],
  "menopause-hrt": [
    { name: "Karen W.", age: 52, image_url: menopause1, before_image_url: null, after_image_url: null, stat: "Gone", stat_label: "Hot Flashes", duration: "6 weeks", rating: 5, quote: "HRT eliminated my hot flashes completely.", tier: "Level 1" },
    { name: "Diana M.", age: 48, image_url: menopause1, before_image_url: null, after_image_url: null, stat: "Balanced", stat_label: "Hormones", duration: "8 weeks", rating: 5, quote: "The Peri-Menopause kit stabilized my mood swings.", tier: "Level 1" },
    { name: "Janet H.", age: 56, image_url: menopause1, before_image_url: null, after_image_url: null, stat: "Restored", stat_label: "Comfort", duration: "4 weeks", rating: 5, quote: "The vaginal cream + DHEA combo restored my comfort.", tier: "Level 2" },
  ],
  "pain-recovery": [
    { name: "Steve G.", age: 56, image_url: pain1, before_image_url: null, after_image_url: null, stat: "90%", stat_label: "Pain Reduced", duration: "2 weeks", rating: 5, quote: "The topical cream works fast.", tier: "Topical" },
    { name: "Linda P.", age: 48, image_url: pain1, before_image_url: null, after_image_url: null, stat: "Active", stat_label: "Lifestyle", duration: "4 weeks", rating: 5, quote: "Back to my morning runs.", tier: "Topical" },
    { name: "Frank B.", age: 61, image_url: pain1, before_image_url: null, after_image_url: null, stat: "Free", stat_label: "Pain Level", duration: "3 weeks", rating: 4, quote: "Finally off oral painkillers.", tier: "Topical" },
  ],
};

export function ProgramResultsSection({ slug }: { slug: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: dbResults } = useQuery({
    queryKey: ["program-results", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_results")
        .select("*")
        .eq("program_slug", slug)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const results: ResultCard[] = dbResults && dbResults.length > 0
    ? dbResults.map((r) => ({
        name: r.name,
        age: r.age,
        image_url: r.image_url,
        before_image_url: r.before_image_url,
        after_image_url: r.after_image_url,
        stat: r.stat,
        stat_label: r.stat_label,
        duration: r.duration,
        rating: r.rating,
        quote: r.quote,
        tier: r.tier,
      }))
    : (fallbackResults[slug] || fallbackResults["weight-loss"]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground text-xs font-bold rounded-full uppercase tracking-wide mb-3">
          Verified Results
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Real Transformations from Real People
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
          See what our members have achieved with doctor-prescribed programs.
        </p>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button onClick={() => scroll("left")} className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border border-border rounded-full shadow-md flex items-center justify-center hover:bg-secondary transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        {canScrollRight && (
          <button onClick={() => scroll("right")} className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border border-border rounded-full shadow-md flex items-center justify-center hover:bg-secondary transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {results.map((result, i) => (
            <div key={i} className="snap-start shrink-0 w-[280px] md:w-[300px] bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300">
              {result.before_image_url && result.after_image_url ? (
                <div className="relative h-48 overflow-hidden flex">
                  <div className="w-1/2 relative">
                    <img src={result.before_image_url} alt={`${result.name} before`} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded uppercase">Before</span>
                  </div>
                  <div className="w-1/2 relative">
                    <img src={result.after_image_url} alt={`${result.name} after`} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-primary/90 text-primary-foreground text-[9px] font-bold rounded uppercase">After</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{result.stat}</p>
                      <p className="text-[11px] text-white/80">{result.stat_label}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {result.duration}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 overflow-hidden">
                  <img src={result.image_url || weightLoss1} alt={`${result.name} results`} className="w-full h-full object-cover" loading="lazy" width={640} height={640} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{result.stat}</p>
                      <p className="text-[11px] text-white/80">{result.stat_label}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {result.duration}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{result.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {result.age && <span className="text-[10px] text-muted-foreground">Age {result.age}</span>}
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < result.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-3 italic">"{result.quote}"</p>
                {result.tier && (
                  <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                    {result.tier} Plan
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary">98%</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Satisfaction Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary">10k+</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Patients Treated</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary">4.9★</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Average Rating</p>
        </div>
      </div>
    </section>
  );
}
