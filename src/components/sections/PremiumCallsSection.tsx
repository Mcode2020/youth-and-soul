import { Phone, Clock, Shield, Star, ChevronRight, Zap } from "lucide-react";

const specialists = [
  {
    name: "Dr. Amanda Foster",
    specialty: "Weight Loss & Metabolic",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80",
    rating: 4.9,
    calls: 1247,
    available: true,
    programSlug: "weight-loss",
  },
  {
    name: "Dr. Lisa Hernandez",
    specialty: "Menopause & HRT",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80",
    rating: 4.8,
    calls: 856,
    available: true,
    programSlug: "menopause-hrt",
  },
  {
    name: "Dr. Sarah Kim",
    specialty: "Skin, Hair & Anti-Aging",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80",
    rating: 4.9,
    calls: 2103,
    available: false,
    programSlug: "skin-hair",
  },
  {
    name: "Dr. David Park",
    specialty: "Longevity & Vitality",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80",
    rating: 4.7,
    calls: 634,
    available: true,
    programSlug: "longevity",
  },
];

export function PremiumCallsSection() {
  return (
    <section className="py-6 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-10">
          <div>
            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-primary">Tele-Health</span>
            </div>
            <h2 className="text-lg md:text-3xl font-black text-foreground tracking-tight">
              Need a Prescription?
            </h2>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5">
              Talk to one of our Tele-Health doctors from the comfort of your home
            </p>
          </div>
          <div />

        </div>

        {/* Specialists */}
        <div 
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {specialists.map((specialist) => (
            <div 
              key={specialist.name}
              className="snap-start shrink-0 w-[220px] md:w-full group relative bg-card rounded-xl md:rounded-2xl border border-border/50 shadow-soft overflow-hidden hover:shadow-medium hover:border-primary/20 transition-all duration-300"
            >
              {/* Availability Badge */}
              <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                <span className={`flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                  specialist.available 
                    ? "bg-green-100 text-green-700" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                    specialist.available ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                  }`} />
                  {specialist.available ? "Live" : "Busy"}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 md:p-5">
                <div className="flex items-center gap-2.5 md:gap-4 mb-3 md:mb-4">
                  <img
                    src={specialist.avatar}
                    alt={specialist.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-border"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm md:text-base text-foreground truncate">{specialist.name}</h4>
                    <p className="text-[10px] md:text-sm text-muted-foreground truncate">{specialist.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-accent text-accent" />
                    <span className="text-xs md:text-sm font-medium text-foreground">{specialist.rating}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">({specialist.calls})</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => window.location.href = `/programs/${specialist.programSlug || "weight-loss"}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-colors ${
                      specialist.available
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    Book Consult
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
