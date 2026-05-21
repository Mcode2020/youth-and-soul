import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ysHypoSpray from "@/assets/ys-hypospray-product.png";
import ysProductLineup from "@/assets/ys-product-lineup.png";
import ysHotHealthBox from "@/assets/ys-hot-health-box.png";

const items = [
  {
    title: "Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray",
    tag: "New",
    sub: "Transdermal weight loss support — no needles",
    image: ysHypoSpray,
    route: "/weightloss-glp-intake",
  },
  {
    title: "Hot Health Beauty Box",
    tag: "Monthly Drop",
    sub: "Science-backed beauty + wellness",
    image: ysHotHealthBox,
    route: "/programs/hot-health",
  },
  {
    title: "Signature Longevity Lineup",
    tag: "Bestsellers",
    sub: "Semaglutide · Tirzepatide · NAD+",
    image: ysProductLineup,
    route: "/programs/longevity",
  },
];

export function BrandedProductsBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-5 md:mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              Youth & Soul Originals
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-foreground leading-tight">
              Our <span className="text-primary">branded</span> products
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Clean, science-backed formulas — designed in-house.
            </p>
          </div>
          <button
            onClick={() => navigate("/programs/hot-health")}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            Shop all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
          {items.map((it) => (
            <button
              key={it.title}
              onClick={() => navigate(it.route)}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card hover:shadow-medium transition-all duration-300 text-left"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={it.image}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold text-primary border border-primary/20">
                {it.tag}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-bold text-sm md:text-base text-foreground leading-tight">
                  {it.title}
                </h3>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
                  {it.sub}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
