import { CategoryStatsBanner } from "./CategoryStatsBanner";

export function MentalHealthStatsBanner() {
  return (
    <CategoryStatsBanner
      tagline="The Mental Health Crisis"
      headline="More people need care than ever — access remains limited"
      accentColor="170,60%,55%"
      bgGradient="bg-gradient-to-br from-[hsl(170,30%,14%)] via-[hsl(170,25%,18%)] to-[hsl(170,35%,12%)]"
      source="Sources: NIMH, SAMHSA, WHO. Individual results may vary."
      stats={[
        { value: 57, suffix: "M+", label: "Americans with mental illness" },
        { value: 60, suffix: "%", label: "Don't receive treatment" },
        { value: 21, suffix: "M", label: "Adults with major depression" },
        { value: 150, suffix: "%", label: "Increase in telehealth therapy" },
      ]}
    />
  );
}
