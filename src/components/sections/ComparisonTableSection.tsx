import { Check, X, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface Row {
  feature: string;
  ys: string | boolean;
  hims: string | boolean;
  ro: string | boolean;
  henry: string | boolean;
}

const rows: Row[] = [
  { feature: "Lowest GLP-1 price on market", ys: "From $125/mo", hims: "$199+/mo", ro: "$135+/mo", henry: "$249+/mo" },
  { feature: "Discounted marketplace (700+ products)", ys: true, hims: false, ro: false, henry: false },
  { feature: "No membership / hidden fees", ys: true, hims: false, ro: false, henry: false },
  { feature: "Full refund if not approved", ys: true, hims: false, ro: false, henry: true },
  { feature: "24/7 doctor support", ys: true, hims: true, ro: true, henry: false },
  { feature: "Multi-condition (HRT, hair, sleep, mental)", ys: true, hims: true, ro: true, henry: false },
  { feature: "Marketplace of vetted brands", ys: true, hims: false, ro: false, henry: false },
  { feature: "Ships to all 50 states", ys: true, hims: true, ro: true, henry: true },
  { feature: "Independent doctor network", ys: true, hims: false, ro: false, henry: true },
  { feature: "Health insurance partners", ys: true, hims: false, ro: false, henry: false },
];

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return (
      <span className="inline-flex items-center justify-center">
        {value ? (
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            }`}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </span>
        ) : (
          <span className="w-7 h-7 rounded-full bg-muted text-muted-foreground/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </span>
        )}
      </span>
    );
  }
  return (
    <span className={`text-xs md:text-sm font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>
      {value}
    </span>
  );
}

export function ComparisonTableSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-5xl mx-auto px-4">
        <Reveal className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Why Youth & Soul
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Compare us to <span className="text-gradient-sage">Hims, Ro & Henry Meds</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            Same medications. Same licensed doctors. Lower prices, no hidden fees, and a full refund guarantee if you're not approved.
          </p>
        </Reveal>

        <Reveal>
          <div className="bg-card border border-border rounded-3xl shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-secondary/60 border-b border-border">
              <div className="col-span-1 px-3 md:px-5 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Feature
              </div>
              <div className="px-2 md:px-4 py-3 md:py-4 text-center">
                <span className="block text-xs md:text-sm font-extrabold text-primary">Youth & Soul</span>
                <span className="block text-[9px] md:text-[10px] text-primary/70 font-semibold">Recommended</span>
              </div>
              <div className="px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-bold text-foreground">Hims</div>
              <div className="px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-bold text-foreground">Ro</div>
              <div className="px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-bold text-foreground">Henry</div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-5 items-center border-b border-border last:border-0 ${
                  i % 2 === 0 ? "bg-card" : "bg-secondary/20"
                }`}
              >
                <div className="col-span-1 px-3 md:px-5 py-3 md:py-4 text-[11px] md:text-sm font-semibold text-foreground leading-tight">
                  {row.feature}
                </div>
                <div className="px-2 md:px-4 py-3 md:py-4 text-center bg-primary/5">
                  <Cell value={row.ys} highlight />
                </div>
                <div className="px-2 md:px-4 py-3 md:py-4 text-center">
                  <Cell value={row.hims} />
                </div>
                <div className="px-2 md:px-4 py-3 md:py-4 text-center">
                  <Cell value={row.ro} />
                </div>
                <div className="px-2 md:px-4 py-3 md:py-4 text-center">
                  <Cell value={row.henry} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
            Pricing as of 2025 from publicly listed competitor sites. Hims®, Ro®, and Henry Meds® are trademarks of their respective owners and are not affiliated with Youth & Soul.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
