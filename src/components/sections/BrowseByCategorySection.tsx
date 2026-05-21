import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Peptides", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&q=80" },
  { name: "Supplements", image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=100&q=80" },
  { name: "Natural Alternatives", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&q=80" },
  { name: "Skincare", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&q=80" },
  { name: "Home Devices", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=100&q=80" },
];

export function BrowseByCategorySection() {
  const navigate = useNavigate();

  return (
    <section className="py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-4">
          <h2 className="text-base md:text-xl text-foreground">
            Browse by Category
          </h2>
          <button className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            See all
          </button>
        </div>

        <div
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
                className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-card rounded-full border border-border/50 shadow-soft hover:shadow-medium transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{cat.name}</span>
              </button>
          ))}
        </div>
      </div>
    </section>
  );
}
