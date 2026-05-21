import { ChevronRight, Star, ThumbsUp, Upload, CheckCircle } from "lucide-react";

const reviews = [
  { id: 1, userName: "Sarah M.", age: 47, goal: "Wrinkles & Fine Lines", product: "Advanced NMN Complex 500mg", duration: "8 weeks", verified: true, likes: 234, rating: 5, description: "Started seeing results after week 3. Fine lines around eyes significantly reduced." },
  { id: 2, userName: "Michael R.", age: 52, goal: "Energy & Vitality", product: "NAD+ Cellular Optimizer", duration: "12 weeks", verified: true, likes: 189, rating: 5, description: "Energy levels completely transformed. Sleeping better and more focused during the day." },
  { id: 3, userName: "Jennifer K.", age: 39, goal: "Skin Radiance", product: "Collagen Peptides Type I & III", duration: "6 weeks", verified: true, likes: 312, rating: 4, description: "Skin looks more hydrated and glowing. People keep asking what I'm doing differently!" },
  { id: 4, userName: "David L.", age: 45, goal: "Recovery", product: "Resveratrol Trans-Form 500", duration: "10 weeks", verified: true, likes: 156, rating: 5, description: "Joint pain reduced significantly. Back to running 5k without discomfort." },
  { id: 5, userName: "Lisa T.", age: 41, goal: "Brain & Focus", product: "Lion's Mane Complex", duration: "4 weeks", verified: true, likes: 98, rating: 4, description: "Mental clarity improved noticeably. I feel sharper in meetings and more productive." },
  { id: 6, userName: "Robert P.", age: 55, goal: "Longevity", product: "Spermidine Plus", duration: "16 weeks", verified: true, likes: 267, rating: 5, description: "Blood markers improved across the board. My doctor was genuinely impressed." },
  { id: 7, userName: "Amanda W.", age: 36, goal: "Hormonal Balance", product: "DIM Complex", duration: "8 weeks", verified: true, likes: 143, rating: 4, description: "Hormonal acne cleared up and my cycle is more regular than ever." },
  { id: 8, userName: "Chris H.", age: 48, goal: "Anti-Aging", product: "BPC-157 Peptide", duration: "6 weeks", verified: true, likes: 201, rating: 5, description: "Recovery from workouts is incredible. Feel like I'm in my 30s again." },
];

export function BeforeAfterSection() {
  return (
    <section className="py-6 md:py-16 bg-gradient-to-b from-[hsl(160,20%,94%)] to-[hsl(160,15%,96%)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 md:mb-10">
          <div>
            <h2 className="text-lg md:text-3xl text-foreground mb-0.5 md:mb-1">
              Real Results, Real People
            </h2>
            <p className="text-xs md:text-base text-muted-foreground">
              Verified reviews from our community
            </p>
          </div>
          <button onClick={() => window.location.href = "/search"} className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <span className="hidden sm:inline">View all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Reviews */}
        <div 
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="snap-start shrink-0 w-[260px] md:w-[300px] bg-card rounded-2xl p-4 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{review.userName}</span>
                    {review.verified && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Age {review.age} • {review.duration}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded-full">
                  {review.goal}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                ))}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                "{review.description}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-primary truncate max-w-[60%]">{review.product}</span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ThumbsUp className="w-2.5 h-2.5" />
                  {review.likes}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload CTA */}
        <div className="mt-5 md:mt-12">
          <button 
            onClick={() => window.location.href = '/upload-results'}
            className="w-full flex flex-col sm:flex-row items-center gap-3 md:gap-4 p-4 md:p-6 bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
              <Upload className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-semibold text-sm md:text-base text-foreground mb-0.5">Share Your Transformation</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Upload your before & after photos and inspire others</p>
            </div>
            <span className="w-full sm:w-auto px-4 md:px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors text-center">
              Upload Results
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
