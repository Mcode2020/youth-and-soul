import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoalCard } from "@/components/ui/GoalCard";


// Import goal images
import goalSkin from "@/assets/goal-skin.jpg";
import goalEnergy from "@/assets/goal-energy.jpg";
import goalBrain from "@/assets/goal-brain.jpg";
import goalHormones from "@/assets/goal-hormones.jpg";
import goalRecovery from "@/assets/goal-recovery.jpg";
import goalLongevity from "@/assets/goal-longevity.jpg";

const goals = [
  { title: "Wrinkles & Skin", image: goalSkin },
  { title: "Energy & Vitality", image: goalEnergy },
  { title: "Brain & Focus", image: goalBrain },
  { title: "Hormonal Balance", image: goalHormones },
  { title: "Recovery", image: goalRecovery },
  { title: "Longevity", image: goalLongevity },
  { title: "Weight Loss", image: goalEnergy },
  { title: "Sexual Health", image: goalHormones },
  { title: "Pain & Recovery", image: goalRecovery },
  { title: "Skin & Hair", image: goalSkin },
];

const goalRoutes: Record<string, string> = {
  "Wrinkles & Skin": "wrinkles-skin-aging",
  "Energy & Vitality": "energy-vitality",
  "Brain & Focus": "brain-focus",
  "Hormonal Balance": "hormonal-balance",
  "Recovery": "recovery-inflammation",
  "Longevity": "longevity-basics",
  "Weight Loss": "weight-loss",
  "Sexual Health": "sexual-health",
  "Pain & Recovery": "pain-recovery",
  "Skin & Hair": "skin-hair",
};

const categories = [
  { name: "Anti-Aging", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&q=80" },
  { name: "General Wellness", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&q=80" },
  { name: "Cellular Health", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&q=80" },
];

type BrowseMode = "goal" | "category";

export function GoalsSection() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<BrowseMode>("category");

  return (
    <section className="py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("category")}
              className={`min-w-[140px] px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all text-center ${
                mode === "category"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse by Category
            </button>
            <button
              onClick={() => setMode("goal")}
              className={`min-w-[140px] px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all text-center ${
                mode === "goal"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse by Goal
            </button>
          </div>
          <button onClick={() => navigate("/search")} className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            See all
          </button>
        </div>

        {/* Content */}
        {mode === "goal" ? (
          <div
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {goals.map((goal) => (
              <GoalCard
                key={goal.title}
                title={goal.title}
                image={goal.image}
                onClick={() => navigate(goal.title === "Weight Loss" ? "/weightloss-glp-intake" : `/goals/${goalRoutes[goal.title]}`)}
                compact
                className="snap-start"
              />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    const event = new CustomEvent('setCategoryFilter', { detail: { category: cat.name } });
                    window.dispatchEvent(event);
                    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-card rounded-full border border-border/50 shadow-soft hover:shadow-medium transition-all"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{cat.name}</span>
                </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
