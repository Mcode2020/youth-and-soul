import { useState } from "react";
import { MapPin, Star, ChevronRight, Sparkles, Search, Loader2 } from "lucide-react";

const defaultServices = [
  {
    name: "Microneedling Session",
    provider: "Glow Aesthetics",
    location: "Downtown LA",
    price: 149,
    originalPrice: 250,
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
  },
  {
    name: "Red Light Therapy",
    provider: "Vitality Spa",
    location: "Santa Monica",
    price: 45,
    originalPrice: 75,
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80",
  },
  {
    name: "Cryotherapy Session",
    provider: "CryoZen",
    location: "Beverly Hills",
    price: 65,
    originalPrice: 90,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
  },
];

export function ServicesSection() {
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [services, setServices] = useState(defaultServices);

  const handleGenerate = async () => {
    if (!zipcode.trim()) return;
    setLoading(true);
    setSearched(true);
    // Simulate AI-generated local results
    await new Promise((r) => setTimeout(r, 1500));
    setServices([
      {
        name: "IV Drip Therapy",
        provider: "Hydrate Wellness",
        location: zipcode,
        price: 99,
        originalPrice: 175,
        rating: 4.8,
        reviewCount: 312,
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
      },
      {
        name: "Infrared Sauna Session",
        provider: "SweatBox Studio",
        location: zipcode,
        price: 35,
        originalPrice: 60,
        rating: 4.6,
        reviewCount: 198,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
      },
      {
        name: "Hyperbaric Oxygen Therapy",
        provider: "O2 Longevity Center",
        location: zipcode,
        price: 120,
        originalPrice: 200,
        rating: 4.9,
        reviewCount: 87,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
      },
    ]);
    setLoading(false);
  };

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-foreground">
              Services Near You
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {searched ? `Near ${zipcode}` : "Enter your zip code"}
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zipcode + AI Generate */}
        <div className="mb-8 bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-soft">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Find services near you</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Enter zip code (e.g. 90210)"
                className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-background border-2 border-border/50 rounded-xl text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !zipcode.trim()}
              className="flex items-center justify-center gap-2 px-8 py-3.5 md:py-4 bg-primary text-primary-foreground rounded-xl text-base font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {loading ? "Finding..." : "AI Generate"}
            </button>
          </div>
        </div>

        {/* Services list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full flex gap-4 p-3 bg-card rounded-2xl border border-border/50 animate-pulse">
                <div className="w-24 h-24 rounded-xl bg-secondary/50" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-secondary/50 rounded w-3/4" />
                  <div className="h-3 bg-secondary/50 rounded w-1/2" />
                  <div className="h-4 bg-secondary/50 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))
          ) : (
            services.map((service) => {
              const discount = Math.round((1 - service.price / service.originalPrice) * 100);

              return (
                <button
                  key={service.name}
                  className="w-full flex gap-4 p-3 bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all text-left group"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary/30 shrink-0">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-xs font-semibold bg-accent text-accent-foreground rounded">
                      -{discount}%
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="font-medium text-foreground text-sm mb-0.5">
                        {service.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {service.provider} • {service.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <span className="text-sm font-medium text-foreground">
                          {service.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({service.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-semibold text-foreground">
                          ${service.price}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${service.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
