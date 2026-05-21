import { CategoryStatsBanner } from "./CategoryStatsBanner";

export function HairStatsBanner() {
  return (
    <CategoryStatsBanner
      tagline="Hair Loss in America"
      headline="Hair loss affects millions — effective treatments exist"
      accentColor="350,60%,65%"
      bgGradient="bg-gradient-to-br from-[hsl(350,30%,18%)] via-[hsl(350,25%,22%)] to-[hsl(350,35%,14%)]"
      source="Sources: AAD, Cleveland Clinic, ISHRS. Individual results may vary."
      stats={[
        { value: 80, suffix: "M+", label: "Americans experiencing hair loss" },
        { value: 50, suffix: "%", label: "Of men affected by age 50" },
        { value: 40, suffix: "%", label: "Of women experience thinning" },
        { value: 3, suffix: "B+", label: "Spent annually on hair loss ($)" },
      ]}
    />
  );
}
