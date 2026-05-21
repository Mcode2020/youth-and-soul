import { CategoryStatsBanner } from "./CategoryStatsBanner";

export function WeightLossStatsBanner() {
  return (
    <CategoryStatsBanner
      tagline="Weight Loss & GLP-1 Programs"
      headline="Millions are transforming their health with doctor-guided weight loss"
      accentColor="155,45%,50%"
      bgGradient="bg-gradient-to-br from-[hsl(155,30%,18%)] via-[hsl(155,25%,22%)] to-[hsl(155,35%,14%)]"
      source="Sources: CDC, NIH, WHO, American Journal of Medicine. Individual results may vary."
      stats={[
        { value: 42, suffix: "%", label: "Of US adults are considered obese" },
        { value: 15, suffix: "%", label: "Average body weight lost on GLP-1s" },
        { value: 84, suffix: "M+", label: "US adults eligible for weight loss treatment" },
        { value: 130, suffix: "B", label: "Annual US weight loss market ($)" },
      ]}
    />
  );
}
