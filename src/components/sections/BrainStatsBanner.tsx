import { CategoryStatsBanner } from "./CategoryStatsBanner";

export function BrainStatsBanner() {
  return (
    <CategoryStatsBanner
      tagline="Brain Health & Cognitive Decline"
      headline="Cognitive performance peaks early — but it doesn't have to fade"
      accentColor="260,60%,70%"
      bgGradient="bg-gradient-to-br from-[hsl(260,30%,18%)] via-[hsl(260,25%,22%)] to-[hsl(260,35%,14%)]"
      source="Sources: Alzheimer's Association, NIH, CDC. Individual results may vary."
      stats={[
        { value: 16, suffix: "M+", label: "Americans with cognitive impairment" },
        { value: 6, suffix: "M", label: "Living with Alzheimer's disease" },
        { value: 75, suffix: "%", label: "Want to improve brain health" },
        { value: 25, suffix: "%", label: "Of adults use nootropics" },
      ]}
    />
  );
}
