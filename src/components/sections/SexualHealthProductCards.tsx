import { useNavigate } from "react-router-dom";
import pillBlue from "@/assets/pill-viagra-blue.png";
import pillYellow from "@/assets/pill-cialis-yellow.png";
import pillWhite from "@/assets/pill-white-round.png";
import bestSellerImg from "@/assets/best-seller-pill.png";
import viagraBox from "@/assets/viagra-product.jpg";
import pt141Troches from "@/assets/checkout/pt141-tadalafil-oxytocin.webp";
import pt141Syringes from "@/assets/checkout/pt141-syringes.webp";
import pt141Vial from "@/assets/checkout/pt141-bremelanotide-vial.webp";
import cialis5mg from "@/assets/checkout/cialis-5mg.webp";
import tadalafilGeneric from "@/assets/checkout/tadalafil-generic.webp";
import ldnBottle from "@/assets/checkout/ldn-bottle.png";

const products = [
  {
    title: "Best Seller",
    drug: "ED treatment",
    badge: "Best seller",
    badgeType: "bestseller" as const,
    stockLabel: "In stock",
    image: bestSellerImg,
  },
  {
    title: "Generic of Viagra®",
    drug: "sildenafil",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    subtitle: "Up to 95% cheaper than branded",
    image: pillBlue,
  },
  {
    title: "Cialis® 5mg",
    drug: "tadalafil",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    subtitle: "Daily and as-needed options available",
    image: cialis5mg,
  },
  {
    title: "Generic Tadalafil",
    drug: "tadalafil 5mg",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    subtitle: "Affordable daily-use alternative",
    image: tadalafilGeneric,
  },
  {
    title: "PT-141 Troches",
    drug: "bremelanotide / tadalafil / oxytocin",
    badge: "New",
    badgeType: "new" as const,
    stockLabel: "In stock",
    subtitle: "2mg / 10mg / 100 IU compound",
    image: pt141Troches,
  },
  {
    title: "PT-141 Injection",
    drug: "bremelanotide",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    subtitle: "Rx included — works for men & women",
    image: pt141Syringes,
  },
  {
    title: "PT-141 Vial",
    drug: "bremelanotide 10mg/mL",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    subtitle: "Pharmaceutical grade, compounded in USA",
    image: pt141Vial,
  },
  {
    title: "Low Dose Naltrexone",
    drug: "LDN 1.5–4.5mg",
    badge: null,
    badgeType: null,
    stockLabel: "In stock",
    subtitle: "Better moods, reduced pain & inflammation",
    image: ldnBottle,
  },
];

export function SexualHealthProductCards() {
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
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <div
              key={p.title}
              className="snap-start shrink-0 w-[220px] md:w-full text-left"
            >
              <div className="relative aspect-square bg-[hsl(220,10%,90%)] rounded-2xl overflow-hidden mb-3">
                {p.badge && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-[hsl(30,10%,80%)] text-foreground text-xs font-semibold rounded-full">
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

              <div className="inline-flex items-center gap-1.5 mb-1.5 px-3 py-1 bg-[hsl(210,80%,95%)] rounded-full">
                <span className="w-2 h-2 rounded-full bg-[hsl(210,70%,45%)] shrink-0" />
                <span className="text-xs font-medium text-[hsl(210,70%,35%)]">{p.stockLabel}</span>
              </div>

              <h3 className="text-sm md:text-base font-bold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{p.drug}</p>

              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => navigate("/programs/sexual-health")}
                  className="px-4 py-2 bg-[hsl(210,70%,45%)] text-white rounded-full text-xs font-semibold hover:bg-[hsl(210,70%,40%)] transition-colors"
                >
                  Get started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
