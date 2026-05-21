import { CategoryStatsBanner } from "./CategoryStatsBanner";

export function SkinStatsBanner() {
  return (
    <CategoryStatsBanner
      tagline="Longevity, Anti-Aging & Skincare"
      headline="The science of living longer, healthier, and looking younger"
      accentColor="25,80%,65%"
      bgGradient="bg-gradient-to-br from-[hsl(25,30%,18%)] via-[hsl(25,25%,22%)] to-[hsl(25,35%,14%)]"
      source="Sources: WHO, NIH, Statista, Grand View Research. Individual results may vary."
      stats={[
        { value: 44, suffix: "B", label: "Global longevity market ($)" },
        { value: 85, suffix: "M+", label: "Americans with skin conditions" },
        { value: 73, suffix: "%", label: "Adults want to slow aging" },
        { value: 12, suffix: "%", label: "Annual longevity market growth" },
      ]}
    />
  );
}
