import { Star } from "lucide-react";
import result1 from "@/assets/ba-result-1.png";
import result2 from "@/assets/ba-result-2.png";
import result3 from "@/assets/ba-result-3.png";
import result4 from "@/assets/ba-result-4.png";
import result5 from "@/assets/ba-result-5.png";

const results = [
  {
    name: "Sarah",
    lost: "85lbs",
    stars: 5,
    title: "Life-changing",
    review: "Fridays made this journey so much easier with their ongoing support and guidance!",
    image: result1,
  },
  {
    name: "Carlos",
    lost: "101lbs",
    stars: 5,
    title: "Metabolic Support",
    review: "I was able to reverse my non-alcoholic fatty liver and bring my blood pressure back to normal.",
    image: result2,
  },
  {
    name: "Katie",
    lost: "65lbs",
    stars: 5,
    title: "Community-driven",
    review: "My PCOS symptoms have completely resolved, and I feel so much happier!",
    image: result3,
  },
  {
    name: "Marcus",
    lost: "118lbs",
    stars: 5,
    title: "Energy Boost",
    review: "My sleep quality has improved significantly, and my lab results are better across the board.",
    image: result4,
  },
  {
    name: "Nicole",
    lost: "55lbs",
    stars: 5,
    title: "Expert-guided",
    review: "My PCOS symptoms are gone, and my A1c is now in a normal range!",
    image: result5,
  },
];

export function BeforeAfterShowcase() {
  return (
    <section className="py-10 md:py-16 bg-[hsl(20,30%,95%)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
            Real Results by <span className="text-primary">Real Customers</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Verified transformations from our members
          </p>
        </div>

        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {results.map((r) => (
            <div
              key={r.name}
              className="snap-start shrink-0 w-[200px] md:w-full flex flex-col"
            >
              <div className="ro-img relative rounded-2xl mb-3 aspect-[3/4] bg-muted">
                <img
                  src={r.image}
                  alt={`${r.name} before and after`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Before / After pill tags */}
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-foreground/80 text-background text-[10px] font-semibold rounded-full backdrop-blur-sm">
                  Before
                </span>
                <span className="absolute bottom-2 right-2 px-2.5 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-semibold rounded-full backdrop-blur-sm">
                  After
                </span>
              </div>

              <div className="flex gap-0.5 mb-1.5">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-primary text-primary"
                  />
                ))}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                {r.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-3">
                "{r.review}"
              </p>
              <div className="mt-auto">
                <p className="font-bold text-foreground text-xs">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">lost {r.lost}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Source: joinfound. Individual results may vary.
        </p>
      </div>
    </section>
  );
}
