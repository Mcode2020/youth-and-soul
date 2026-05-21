import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Weight Loss",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    slug: "weight-loss",
  },
  {
    title: "Peptides & Longevity",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80",
    slug: "longevity",
  },
  {
    title: "Libido & Sexual Health",
    subtitle: "ED treatments, intimacy support & performance...",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    overlay: "bg-[hsl(220,60%,45%)]/50",
    slug: "sexual-health",
  },
  {
    title: "Menopause & Hormonal Support",
    subtitle: "Estrogen Therapy, HRT & Vaginal Health",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    overlay: "bg-[hsl(340,50%,45%)]/50",
    slug: "menopause-hrt",
  },
  {
    title: "Skin, Hair & Anti-Aging",
    subtitle: "Hair Regrowth, Retinoids, Peptides & Pigmentation...",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
    overlay: "bg-[hsl(30,50%,40%)]/50",
    slug: "skin-hair",
  },
  {
    title: "Gut Health & Digestion",
    subtitle: "Microbiome Reset, SIBO & IBS Treatment...",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    overlay: "bg-[hsl(25,50%,40%)]/50",
    slug: "gut-health",
  },
];

export function HeroCategoryCards() {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-10 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 md:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => navigate(cat.slug === "weight-loss" ? "/weightloss-glp-intake" : `/programs/${cat.slug}`)}
              className="group relative rounded-xl overflow-hidden border border-border/30 hover:shadow-medium transition-all duration-300"
            >
              <div className="aspect-[3/2] overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {'overlay' in cat && (
                  <div className={`absolute inset-0 ${(cat as any).overlay}`} />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-[11px] md:text-xs font-bold text-white text-left leading-tight">{cat.title}</h3>
                  {'subtitle' in cat && (
                    <p className="text-[9px] md:text-[10px] text-white/70 text-left mt-0.5 line-clamp-1">{(cat as any).subtitle}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
