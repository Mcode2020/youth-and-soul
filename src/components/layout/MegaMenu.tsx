import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import featuredWeightloss from "@/assets/featured-weightloss.jpg";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href: string;
  isRx?: boolean;
}

interface MenuPanel {
  explore: {
    question: string;
    subtitle: string;
    cta: { label: string; href: string };
  };
  columns: {
    heading: string;
    items: MenuItem[];
  }[];
  featured?: {
    title: string;
    image?: string;
    cta: { label: string; href: string };
  };
}

const menuData: Record<string, MenuPanel> = {
  "Weight Loss": {
    explore: {
      question: "Which solution is for you?",
      subtitle: "Compare weight-loss products",
      cta: { label: "Discover weight-loss solutions", href: "/weightloss-glp-intake" },
    },
    columns: [
      {
        heading: "GLP-1 PEPTIDES",
        items: [
          { label: "Tirzepatide", href: "/search?q=tirzepatide", isRx: true },
          { label: "Semaglutide", href: "/search?q=semaglutide", isRx: true },
          { label: "Retatrutide", href: "/search?q=retatrutide", isRx: true },
          { label: "GLP-1 Oral Drops", href: "/search?q=GLP-1+drops", isRx: true },
        ],
      },
      {
        heading: "BY TYPE",
        items: [
          { label: "Peptides", href: "/search?q=peptides" },
          { label: "Injectables", href: "/search?q=injectable" },
          { label: "Supplements", href: "/search?q=supplements" },
          { label: "Fat Burners", href: "/search?q=fat+burner" },
        ],
      },
      {
        heading: "BRANDS",
        items: [
          { label: "wowMD", href: "/search?q=wowMD" },
          { label: "Goli", href: "/search?q=Goli" },
          { label: "DNA Vibe", href: "/search?q=DNA+Vibe" },
          { label: "Elle-Sera", href: "/search?q=Elle-Sera" },
        ],
      },
    ],
    featured: {
      title: "Weight Loss Peptides",
      image: featuredWeightloss,
      cta: { label: "Get started", href: "/weightloss-glp-intake" },
    },
  },
  "Longevity": {
    explore: {
      question: "Which treatment is for you?",
      subtitle: "Compare longevity & vitality options",
      cta: { label: "Discover Longevity", href: "/search?category=Longevity" },
    },
    columns: [
      {
        heading: "SUPPLEMENTS",
        items: [
          { label: "NMN & NAD+", href: "/search?q=NMN" },
          { label: "Resveratrol", href: "/search?q=resveratrol" },
          { label: "CoQ10 & Mitochondria", href: "/search?q=CoQ10" },
          { label: "Glutathione", href: "/search?q=glutathione" },
        ],
      },
      {
        heading: "BY TYPE",
        items: [
          { label: "Peptides", href: "/search?q=peptides" },
          { label: "Injectables", href: "/search?q=injectable" },
          { label: "Oral Supplements", href: "/search?q=supplements" },
          { label: "Devices", href: "/search?category=Devices" },
        ],
      },
      {
        heading: "BRANDS",
        items: [
          { label: "Noble Panacea", href: "/search?q=Noble+Panacea" },
          { label: "Goli", href: "/search?q=Goli" },
          { label: "DNA Vibe", href: "/search?q=DNA+Vibe" },
          { label: "Elle-Sera", href: "/search?q=Elle-Sera" },
        ],
      },
    ],
    featured: {
      title: "Top Rated Longevity",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80",
      cta: { label: "Explore top rated", href: "/products/top-rated" },
    },
  },
  "Anti-Aging": {
    explore: {
      question: "Find your routine",
      subtitle: "Compare anti-aging solutions",
      cta: { label: "Discover Anti-Aging", href: "/search?category=Anti-Aging" },
    },
    columns: [
      {
        heading: "SKINCARE",
        items: [
          { label: "Serums & Treatments", href: "/search?q=serum" },
          { label: "Retinol & Vitamin A", href: "/search?q=retinol" },
          { label: "Hyaluronic Acid", href: "/search?q=hyaluronic" },
          { label: "Vitamin C", href: "/search?q=vitamin+C" },
        ],
      },
      {
        heading: "BY TYPE",
        items: [
          { label: "Peptides", href: "/search?q=peptides" },
          { label: "Supplements", href: "/search?q=supplements" },
          { label: "Devices & Tools", href: "/search?category=Devices" },
          { label: "Topicals & Creams", href: "/search?q=cream" },
        ],
      },
      {
        heading: "BRANDS",
        items: [
          { label: "Noble Panacea", href: "/search?q=Noble+Panacea" },
          { label: "Elle-Sera", href: "/search?q=Elle-Sera" },
          { label: "DNA Vibe", href: "/search?q=DNA+Vibe" },
          { label: "Goli", href: "/search?q=Goli" },
        ],
      },
    ],
    featured: {
      title: "Editor's Picks",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
      cta: { label: "View featured", href: "/products/featured" },
    },
  },
  "More": {
    explore: {
      question: "More from Youth&Soul",
      subtitle: "Services, community & resources",
      cta: { label: "About Youth&Soul", href: "/about" },
    },
    columns: [
      {
        heading: "SERVICES",
        items: [
          { label: "Tele-Health Consultations", href: "/apply-consultant" },
          { label: "Doctor Recommendations", href: "/#expert-section" },
          { label: "Premium 1:1 Calls", href: "/#expert-section" },
        ],
      },
      {
        heading: "COMMUNITY",
        items: [
          { label: "Podcasts & Reviews", href: "/#podcast-section" },
          { label: "Community Hub", href: "/#community-section" },
          { label: "Upload Your Results", href: "/upload-results" },
          { label: "Rankings", href: "/#rankings-section" },
        ],
      },
      {
        heading: "GET INVOLVED",
        items: [
          { label: "List Your Product", href: "/list-product" },
          { label: "Become an Influencer", href: "/apply-influencer" },
          { label: "VIP Membership", href: "/auth" },
        ],
      },
    ],
  },
};

const navItems = ["Weight Loss", "Longevity", "Anti-Aging", "More"];

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((item: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(item);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleNavigate = (href: string) => {
    setActiveMenu(null);
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(href);
    }
  };

  const panel = activeMenu ? menuData[activeMenu] : null;

  return (
    <div className="hidden lg:block relative">
      {/* Nav triggers */}
      <nav className="flex items-center">
        {navItems.map((item) => (
          <button
            key={item}
            onMouseEnter={() => handleEnter(item)}
            onMouseLeave={handleLeave}
            onClick={() => handleEnter(item)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap relative",
              activeMenu === item
                ? "text-cream"
                : "text-cream/70 hover:text-cream"
            )}
          >
            {item}
            {activeMenu === item && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}

        {/* Extra non-dropdown links */}
        <button
          onClick={() => handleNavigate("/explore")}
          className="px-4 py-2.5 text-sm font-medium text-cream/70 hover:text-cream transition-colors whitespace-nowrap"
        >
          Explore
        </button>
        <button
          onClick={() => handleNavigate("/apply-influencer")}
          className="px-4 py-2.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors whitespace-nowrap"
        >
          Apply
        </button>
        <button
          onClick={() => handleNavigate("/learn")}
          className="px-4 py-2.5 text-sm font-medium text-cream/70 hover:text-cream transition-colors whitespace-nowrap"
        >
          Learn
        </button>
      </nav>

      {/* Mega dropdown */}
      <AnimatePresence>
        {activeMenu && panel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-[56px] bg-foreground/10 z-40"
              onClick={() => setActiveMenu(null)}
            />

            {/* Full-width panel */}
            <motion.div
              initial={{ opacity: 0, y: -4, scaleY: 0.98 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "top" }}
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handleLeave}
              className="fixed left-0 right-0 top-[56px] bg-card border-b border-border shadow-elevated z-50"
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-[220px_1fr_200px] gap-8">
                  {/* Explore column */}
                  <div className="border-r border-border/50 pr-6">
                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary rounded-full mb-4">
                      Explore
                    </span>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {panel.explore.question}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      {panel.explore.subtitle}
                    </p>
                    <button
                      onClick={() => handleNavigate(panel.explore.cta.href)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      {panel.explore.cta.label}
                    </button>
                  </div>

                  {/* Product columns */}
                  <div className={cn(
                    "grid gap-8",
                    panel.columns.length === 2 ? "grid-cols-2" : "grid-cols-3"
                  )}>
                    {panel.columns.map((col) => (
                      <div key={col.heading}>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border/40">
                          {col.heading}
                        </h4>
                        <div className="flex flex-col gap-0.5">
                          {col.items.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => handleNavigate(item.href)}
                              className="group/item flex items-center gap-2 py-2 px-1 text-left hover:bg-secondary/40 rounded-md transition-colors"
                            >
                              <span className="text-sm text-foreground group-hover/item:text-primary transition-colors">
                                {item.label}
                              </span>
                              {item.isRx && (
                                <span className="text-[10px] text-muted-foreground">℞</span>
                              )}
                              <ChevronRight className="w-3 h-3 text-muted-foreground/0 group-hover/item:text-primary/50 ml-auto transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Featured column */}
                  {panel.featured && (
                    <div className="border-l border-border/50 pl-6">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border/40">
                        Featured
                      </h4>
                      <div className="bg-secondary/30 rounded-xl p-4">
                        <h5 className="font-serif font-semibold text-foreground text-sm mb-3">
                          {panel.featured.title}
                        </h5>
                        <div className="w-full aspect-[4/3] bg-secondary rounded-lg mb-3 overflow-hidden">
                          <img
                            src={panel.featured.image || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80"}
                            alt={panel.featured.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleNavigate(panel.featured!.cta.href)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-charcoal text-cream rounded-lg text-sm font-medium hover:bg-charcoal/90 transition-colors"
                        >
                          {panel.featured.cta.label}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
