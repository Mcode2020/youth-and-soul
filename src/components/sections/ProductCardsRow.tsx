import { useNavigate } from "react-router-dom";
import wegovyPenImg from "@/assets/wegovy-pen-real.png";
import ozempicImg from "@/assets/ozempic-real.png";
import glpVial from "@/assets/glp-injection-vial.png";
import lozengesImg from "@/assets/ys-lozenges-jar.jpg";
import hyposprayImg from "@/assets/ys-hypospray-product.png";

const products = [
  {
    title: "Semaglutide & Tirzepatide Lozenges",
    drug: "From $149/Month",
    badge: "New",
    badgeType: "new" as const,
    stockLabel: "New and in stock",
    image: lozengesImg,
    link: "/weightloss-glp-intake",
  },
  {
    title: "Tirzepatide Hypospray",
    drug: "$189/Month",
    badge: "New",
    badgeType: "new" as const,
    stockLabel: "New and in stock",
    image: hyposprayImg,
    link: "/weightloss-glp-intake",
  },
  {
    title: "Wegovy® pen",
    drug: "semaglutide",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    image: wegovyPenImg,
    link: "/weightloss-glp-intake",
  },
  {
    title: "GLP-1 Injections",
    drug: "semaglutide",
    badge: null,
    badgeType: null,
    stockLabel: "Supply available",
    image: glpVial,
    link: "/weightloss-glp-intake",
  },
  {
    title: "Ozempic®",
    drug: "semaglutide",
    badge: null,
    badgeType: null,
    stockLabel: "Supply available",
    image: ozempicImg,
    link: "/weightloss-glp-intake",
  },
];

export function ProductCardsRow() {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-14 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-black text-foreground text-center mb-2 tracking-tight">
          Trusted by experts, priced for you.
        </h2>
        <p className="text-sm md:text-base text-muted-foreground text-center mb-8 max-w-xl mx-auto">
          Find the right medication with the confidence that it's doctor-approved.
        </p>

        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <div
              key={p.title}
              className="snap-start shrink-0 w-[220px] md:w-full text-left"
            >
              <div className="relative aspect-square bg-[hsl(220,10%,90%)] rounded-2xl overflow-hidden mb-3">
                {p.badge && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-[hsl(55,80%,75%)] text-foreground text-xs font-semibold rounded-full">
                    {p.badge}
                  </span>
                )}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 mb-1.5 px-3 py-1 bg-primary/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-xs font-medium text-primary">{p.stockLabel}</span>
              </div>

              <h3 className="text-sm md:text-base font-bold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{p.drug}</p>

              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => navigate(p.link)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get started
                </button>
              </div>

              <a href="/safety-info/glp1" className="text-[11px] text-primary underline underline-offset-2">
                Important safety information
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
