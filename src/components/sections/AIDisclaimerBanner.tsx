import { ShieldAlert } from "lucide-react";

export function AIDisclaimerBanner() {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Please note:</span>{" "}
          Youth & Soul will never use AI to fabricate results, create false doctor profiles, or mislead users in any way - practices seen elsewhere in the industry. We do not generate fake testimonials or outcomes. Our mission is to build one of the most ethical online telehealth platforms in the world.
        </p>
      </div>
    </div>
  );
}
