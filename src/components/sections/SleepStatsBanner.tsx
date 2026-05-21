import { CategoryStatsBanner } from "./CategoryStatsBanner";

export function SleepStatsBanner() {
  return (
    <CategoryStatsBanner
      tagline="The Sleep Crisis in America"
      headline="Millions are struggling — and most aren't getting help"
      accentColor="230,60%,70%"
      bgGradient="bg-gradient-to-br from-[hsl(230,30%,18%)] via-[hsl(230,25%,22%)] to-[hsl(230,35%,14%)]"
      source="Sources: CDC, National Institutes of Health. Individual circumstances may vary."
      stats={[
        { value: 70, suffix: "M+", label: "Americans with sleep disorders" },
        { value: 33, suffix: "%", label: "Adults not getting enough sleep" },
        { value: 4, suffix: "%", label: "Use prescription sleep aids monthly" },
        { value: 50, suffix: "M+", label: "Suffering but untreated" },
      ]}
    />
  );
}
