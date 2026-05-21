import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, ChevronRight, Clock, Search, Upload, Plus, 
  TrendingUp, Filter, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const articles = [
  {
    title: "What NMN Does (and Doesn't Do)",
    slug: "what-nmn-does",
    readTime: "5 min read",
    category: "Longevity",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80",
    views: 12453,
  },
  {
    title: "Botox Alternatives That Actually Help",
    slug: "botox-alternatives",
    readTime: "4 min read",
    category: "Anti-Aging",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80",
    views: 8932,
  },
  {
    title: "What Athlete-Safe Really Means",
    slug: "athlete-safe-supplements",
    readTime: "3 min read",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    views: 6721,
  },
  {
    title: "The Science Behind NAD+ Boosters",
    slug: "nad-boosters-science",
    readTime: "7 min read",
    category: "Science",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80",
    views: 15234,
  },
  {
    title: "Collagen: Myths vs Reality",
    slug: "collagen-myths-reality",
    readTime: "6 min read",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
    views: 9876,
  },
  {
    title: "Rapamycin: The Anti-Aging Drug",
    slug: "rapamycin-anti-aging",
    readTime: "8 min read",
    category: "Research",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80",
    views: 21098,
  },
];

const categories = ["All", "Longevity", "Anti-Aging", "Science", "Beauty", "Research"];

export function LearnSection() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  return (
    <section className="py-8 bg-secondary/30">
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl text-foreground">
                Learn & Discover
              </h2>
              <p className="text-xs text-muted-foreground">Articles, stories & results</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            All articles
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Upload */}
        <div className="px-4 mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 bg-card"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category filters */}
        <div 
          className="flex gap-2 px-4 mb-4 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-colors shrink-0",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Upload CTA */}
        <div className="px-4 mb-4">
          <button className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-primary/5 via-card to-accent/5 rounded-2xl border border-dashed border-primary/30 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Share Your Story</p>
                <p className="text-xs text-muted-foreground">Upload before/after results & articles</p>
              </div>
            </div>
            <div className="flex gap-1 ml-auto">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </button>
        </div>

        {/* Articles grid */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-4">
          {filteredArticles.slice(0, 4).map((article) => (
            <button
              key={article.title}
              onClick={() => navigate(`/article/${article.slug}`)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <img
                src={article.image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded mb-1.5">
                  {article.category}
                </span>
                <h3 className="text-sm text-card leading-tight line-clamp-2 mb-1">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-card/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {(article.views / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* More articles - same grid as above */}
        {filteredArticles.length > 4 && (
          <div className="px-4 grid grid-cols-2 gap-3">
            {filteredArticles.slice(4).map((article) => (
              <button
                key={article.title}
                onClick={() => navigate(`/article/${article.slug}`)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded mb-1.5">
                    {article.category}
                  </span>
                  <h3 className="text-sm text-card leading-tight line-clamp-2 mb-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-card/70">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {(article.views / 1000).toFixed(1)}k
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
