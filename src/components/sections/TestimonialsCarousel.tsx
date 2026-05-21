
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  review_text: string;
  stars: number;
  source: string | null;
}

function ReviewCard({ t }: { t: Review }) {
  const isTrustpilot = t.source?.toLowerCase() === "trustpilot";
  return (
    <div
      className={`shrink-0 w-[280px] md:w-[320px] rounded-2xl p-5 md:p-6 border shadow-soft ${
        isTrustpilot
          ? "bg-[hsl(152,76%,96%)] border-[hsl(152,76%,40%)]/30"
          : "bg-background border-border/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
            isTrustpilot ? "bg-[hsl(152,76%,40%)]/15" : "bg-primary/10"
          }`}>
            <span className={`text-sm font-bold ${isTrustpilot ? "text-[hsl(152,76%,35%)]" : "text-primary"}`}>
              {isTrustpilot ? "★" : t.name[0]}
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">{t.name}</span>
            {isTrustpilot && (
              <p className="text-[10px] text-[hsl(152,76%,35%)] font-medium">via Trustpilot</p>
            )}
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(t.stars)].map((_, j) => (
            <Star
              key={j}
              className={`w-3.5 h-3.5 ${
                isTrustpilot
                  ? "fill-[hsl(152,76%,40%)] text-[hsl(152,76%,40%)]"
                  : "fill-primary text-primary"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
        "{t.review_text}"
      </p>
    </div>
  );
}

export function TestimonialsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase
      .from("site_reviews")
      .select("id, name, review_text, stars, source")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setReviews(data as Review[]);
      });
  }, []);

  if (reviews.length === 0) return null;

  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);
  const doubled1 = [...row1, ...row1];
  const doubled2 = [...row2, ...row2];

  return (
    <section id="testimonials-section" className="py-10 md:py-20 bg-card overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
            There's a reason people are{" "}
            <span className="text-primary">raving about our GLP-1 products.</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Join the thousands who have trusted our products to help change their lives, achieving significant, lasting results.
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="flex gap-4 animate-marquee-slow">
          {doubled1.map((t, i) => (
            <ReviewCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {row2.length > 0 && (
        <div className="relative">
          <div className="flex gap-4 animate-marquee-slow-reverse">
            {doubled2.map((t, i) => (
              <ReviewCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Source attribution */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-primary font-semibold">Source</span>: We take reviews from across the internet to help provide a more general review.{" "}
          <span className="font-semibold text-foreground">Please note:</span>{" "}
          Youth &amp; Soul will never use AI to fabricate results, create false doctor profiles, or mislead users in any way — practices seen elsewhere in the industry. We do not generate fake testimonials or outcomes. Our mission is to build one of the most ethical online telehealth platforms in the world.
        </p>
      </div>
    </section>
  );
}
