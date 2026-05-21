import { Stethoscope, Globe, BadgeCheck, Truck, PackageCheck, Tag } from "lucide-react";

const items = [
  { icon: Truck, label: "FREE SHIPPING" },
  { icon: Stethoscope, label: "DOCTOR CONSULTATIONS INCLUDED" },
  { icon: Stethoscope, label: "LICENSED MEDICAL PROVIDERS" },
  { icon: Globe, label: "100% ONLINE" },
  { icon: Tag, label: "INDUSTRY LOWEST PRICES" },
  { icon: PackageCheck, label: "DISCREET SHIPPING" },
];

export function ScrollingTrustBanner() {
  return (
    <div className="relative overflow-hidden bg-primary py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, setIdx) => (
          items.map((item, i) => (
            <div key={`${setIdx}-${i}`} className="inline-flex items-center gap-2.5 mx-8 md:mx-12">
              <item.icon className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
              <span className="text-[11px] md:text-sm font-bold tracking-[0.15em] text-white uppercase" style={{ fontFamily: "'Trebuchet MS', 'Lucida Sans', sans-serif", letterSpacing: "0.18em" }}>{item.label}</span>
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

