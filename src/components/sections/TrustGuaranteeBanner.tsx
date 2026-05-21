import { Shield, Truck, Stethoscope, BadgeCheck } from "lucide-react";

const guarantees = [
  { icon: Shield, label: "Youth&Soul guarantee" },
  { icon: Truck, label: "Free, expedited delivery" },
  { icon: Stethoscope, label: "Doctor-led plans & coaching" },
  { icon: BadgeCheck, label: "No hidden fees" },
];

export function TrustGuaranteeBanner() {
  return (
    <section className="py-6 md:py-8 border-y border-border bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {guarantees.map((g) => (
            <div key={g.label} className="flex items-center gap-3">
              <g.icon className="w-7 h-7 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <span className="text-sm font-medium text-foreground">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
