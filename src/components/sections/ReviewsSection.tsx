import { ReviewCard } from "@/components/ui/ReviewCard";
import { ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    author: "Sarah M.",
    age: 42,
    goal: "Anti-aging",
    rating: 5,
    content: "After 3 months of consistent NMN supplementation, I've noticed significant improvements in my energy levels and skin elasticity. My sleep quality has also improved dramatically.",
    timeToResult: "3 months",
    wouldRepurchase: true,
    helpful: 124,
  },
  {
    author: "Michael R.",
    age: 38,
    goal: "Recovery",
    rating: 4,
    content: "As an athlete, I was skeptical but the collagen peptides have really helped with my joint recovery. I can train harder without the usual aches the next day.",
    timeToResult: "6 weeks",
    wouldRepurchase: true,
    helpful: 89,
  },
  {
    author: "Jennifer L.",
    age: 51,
    goal: "Skin",
    rating: 5,
    content: "The combination of resveratrol and collagen has been game-changing. My dermatologist even noticed the difference in my skin texture during my last visit.",
    timeToResult: "2 months",
    wouldRepurchase: true,
    helpful: 203,
  },
];

export function ReviewsSection() {
  return (
    <section className="py-8 bg-secondary/30">
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Quote className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl text-foreground">
                What Actually Works
              </h2>
              <p className="text-sm text-muted-foreground">
                Real results from real people
              </p>
            </div>
          </div>
        </div>

        {/* Reviews scroll */}
        <div 
          className="flex gap-4 px-4 py-4 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              {...review}
              className="snap-start shrink-0"
            />
          ))}
        </div>

        {/* CTA */}
        <div className="px-4">
          <button className="w-full py-3.5 flex items-center justify-center gap-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors touch-target">
            Read all verified reviews
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
