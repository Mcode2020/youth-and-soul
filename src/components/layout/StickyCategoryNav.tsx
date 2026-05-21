import { useNavigate } from "react-router-dom";

const categories = [
  { label: "Weight Loss", target: "weight-loss-section", slug: "/weightloss-glp-intake" },
  { label: "Menopause", target: "menopause-section", slug: "/programs/menopause-hrt" },
  { label: "Libido", target: "sexual-health-section", slug: "/programs/sexual-health" },
  { label: "Hot Health", target: "hot-health-section", slug: "/programs/hot-health" },
  { label: "Mental Health", target: "mental-health-section", slug: "/programs/mental-health" },
  { label: "Hair Loss", target: "hair-loss-section", slug: "/programs/skin-hair" },
  { label: "Brain", target: "brain-section", slug: "/programs/brain-cognitive" },
  { label: "Skin", target: "skin-section", slug: "/programs/skin-hair" },
  { label: "Functional Beauty", target: "functional-beauty-section", slug: "/programs/skin-hair" },
  { label: "Anti-Aging", target: "anti-aging-section", slug: "/programs/longevity" },
  { label: "Longevity", target: "longevity-section", slug: "/programs/longevity" },
  { label: "Reviews & Results", target: "testimonials-section", slug: "/reviews" },
];

export function StickyCategoryNav() {
  const navigate = useNavigate();

  const handleClick = (id: string, fallback: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(fallback);
    }
  };

  return (
    <div className="sticky top-0 z-30">
      <div className="bg-background/90 backdrop-blur-md border-b border-border/60 shadow-soft">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5">
            {categories.map((c) => (
              <button
                key={c.label}
                onClick={() => handleClick(c.target, c.slug)}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


