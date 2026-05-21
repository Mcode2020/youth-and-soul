import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { AISearchBar } from "@/components/ui/AISearchBar";
import { Search, Home, BookOpen, ShoppingBag, Heart, ArrowRight } from "lucide-react";

const popularLinks = [
  { label: "Anti-Aging Supplements", href: "/search?category=Anti-Aging", icon: ShoppingBag },
  { label: "Weight Loss Programs", href: "/weightloss-glp-intake", icon: Heart },
  { label: "Longevity & Vitality", href: "/programs/longevity", icon: Heart },
  { label: "Learn About Health", href: "/learn", icon: BookOpen },
  { label: "Browse All Products", href: "/search", icon: Search },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    setMounted(true);

    // Set noindex meta tag
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Page Not Found | Youth & Soul";

    return () => { document.head.removeChild(meta); };
  }, [location.pathname]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            The page you're looking for doesn't exist or may have moved. Try searching or explore popular sections below.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <p className="text-sm font-medium text-foreground mb-3 text-center">Search for products, programs & articles</p>
          <AISearchBar onSearch={handleSearch} />
        </div>

        {/* Popular Links */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">Popular Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => { navigate(link.href); window.scrollTo(0, 0); }}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground flex-1">{link.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Back Home */}
        <div className="text-center">
          <button
            onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </button>
        </div>
      </div>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default NotFound;
