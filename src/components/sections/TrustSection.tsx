import { Shield, Award, FlaskConical, Users } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Verified Brands",
    description: "Every seller is vetted for quality and certifications",
  },
  {
    icon: FlaskConical,
    title: "Science-Backed",
    description: "Products rated by evidence strength",
  },
  {
    icon: Users,
    title: "Peer Reviews",
    description: "Real results from verified purchasers",
  },
  {
    icon: Award,
    title: "Athlete Safe",
    description: "WADA-compliant options clearly labeled",
  },
];

export function TrustSection() {
  return (
    <section className="px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl text-center text-foreground mb-6">
          Why people trust us
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border/50 shadow-soft"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {point.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
