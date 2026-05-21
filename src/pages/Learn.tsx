import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JoinHealthPlansCTA } from "@/components/sections/JoinHealthPlansCTA";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ChevronRight, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSEOHead } from "@/hooks/useSEOHead";

interface HubPage {
  id: string;
  slug: string;
  title: string;
  hero_title: string;
  hero_subtitle: string | null;
  category: string;
  meta_description: string | null;
  keywords: string[] | null;
}

interface SpokePage {
  id: string;
  slug: string;
  title: string;
  question: string | null;
  hub_id: string;
  meta_description: string | null;
  page_type: string;
}

const categoryColors: Record<string, string> = {
  "weight-loss": "from-pink-500/20 to-rose-500/20",
  "longevity": "from-blue-500/20 to-cyan-500/20",
  "anti-aging": "from-purple-500/20 to-violet-500/20",
  "sexual-health": "from-red-500/20 to-orange-500/20",
  "skin-hair": "from-amber-500/20 to-yellow-500/20",
  "pain-recovery": "from-green-500/20 to-emerald-500/20",
  "menopause-hrt": "from-rose-500/20 to-pink-500/20",
  "menopause": "from-rose-500/20 to-pink-500/20",
  "brain-cognitive": "from-indigo-500/20 to-violet-500/20",
  "brain-activity": "from-indigo-500/20 to-violet-500/20",
  "gut-health": "from-lime-500/20 to-emerald-500/20",
  "digestion": "from-lime-500/20 to-emerald-500/20",
  "mental-health": "from-sky-500/20 to-blue-500/20",
  "beauty": "from-fuchsia-500/20 to-pink-500/20",
  "hot-health": "from-fuchsia-500/20 to-pink-500/20",
};

const getCategoryColor = (category: string) => {
  if (categoryColors[category]) return categoryColors[category];
  const palette = [
    "from-teal-500/20 to-cyan-500/20",
    "from-orange-500/20 to-amber-500/20",
    "from-violet-500/20 to-purple-500/20",
    "from-emerald-500/20 to-green-500/20",
  ];
  return palette[Math.abs([...category].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length];
};

export default function Learn() {
  const navigate = useNavigate();
  const [hubs, setHubs] = useState<HubPage[]>([]);
  const [spokes, setSpokes] = useState<SpokePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useSEOHead({
    title: "Learn & Discover — Health Knowledge Hub",
    description: "Expert guides, FAQs, and AI-researched answers on weight loss, longevity, anti-aging, menopause, sexual health, and pain recovery.",
    path: "/learn",
    keywords: "health guides, longevity articles, anti-aging science, weight loss tips, menopause advice, supplement guides",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [hubRes, spokeRes] = await Promise.all([
        supabase.from("seo_hub_pages").select("id, slug, title, hero_title, hero_subtitle, category, meta_description, keywords").eq("is_published", true).order("created_at", { ascending: false }),
        supabase.from("seo_spoke_pages").select("id, slug, title, question, hub_id, meta_description, page_type").eq("is_published", true).order("created_at", { ascending: false }),
      ]);
      setHubs(hubRes.data || []);
      setSpokes(spokeRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = ["All", ...Array.from(new Set(hubs.map((h) => h.category)))];

  const filteredHubs = hubs.filter((h) => {
    const matchCat = activeCategory === "All" || h.category === activeCategory;
    const matchSearch = !searchQuery || h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.hero_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredSpokes = spokes.filter((s) => {
    if (!searchQuery) return true;
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) || (s.question && s.question.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Learn & Discover" }]} />

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/10 via-accent/5 to-background px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <BookOpen className="w-4 h-4" />
            Knowledge Hub
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Learn & Discover</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-6">
            Expert guides, FAQs, and AI-researched answers on health, longevity, and wellness
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions..."
              className="pl-9 rounded-xl h-11"
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Hub Pages (main topics) */}
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Topics & Guides</h2>
            {filteredHubs.length === 0 ? (
              <p className="text-muted-foreground text-sm mb-8">No topics found. Check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {filteredHubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => navigate(`/learn/${hub.slug}`)}
                    className={`group text-left p-5 rounded-2xl border border-border/50 bg-gradient-to-br ${getCategoryColor(hub.category)} hover:shadow-medium transition-all`}
                  >
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-3">
                      {hub.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {hub.hero_title}
                    </h3>
                    {hub.hero_subtitle && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{hub.hero_subtitle}</p>
                    )}
                    {hub.meta_description && (
                      <p className="text-xs text-muted-foreground/70 line-clamp-2">{hub.meta_description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium">
                      Read more <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Spoke Pages (Q&A / detailed articles) */}
            {filteredSpokes.length > 0 && (
              <>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Popular Questions & Articles
                </h2>
                <div className="space-y-2 mb-8">
                  {filteredSpokes.slice(0, 20).map((spoke) => (
                    <button
                      key={spoke.id}
                      onClick={() => navigate(`/learn/${spoke.slug}`)}
                      className="w-full text-left flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary text-sm font-bold">Q</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {spoke.question || spoke.title}
                        </h4>
                        {spoke.meta_description && (
                          <p className="text-xs text-muted-foreground truncate">{spoke.meta_description}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      <JoinHealthPlansCTA />
      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
