import { useNavigate } from "react-router-dom";
import { PaymentLogosBar } from "@/components/ui/PaymentLogosBar";

export function MinimalFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[hsl(220,20%,14%)] text-[hsl(220,10%,75%)] border-t border-border">
      {/* Bottom bar — matches homepage footer */}
      <div className="border-t border-[hsl(220,10%,20%)]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-4">
          <PaymentLogosBar size="lg" />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {["Terms & Conditions", "Privacy Policy", "Refund Policy", "Medical Consent"].map((label, i) => {
              const hrefs = ["/terms-of-service", "/privacy-policy", "/terms-of-service", "/safety-info/glp1"];
              return (
                <a
                  key={label}
                  href={hrefs[i]}
                  onClick={(e) => { e.preventDefault(); navigate(hrefs[i]); }}
                  className="text-xs text-[hsl(220,10%,50%)] hover:text-white transition-colors"
                >
                  {label}
                </a>
              );
            })}
          </div>
          <p className="text-xs text-[hsl(220,10%,45%)]">
            © {new Date().getFullYear()} Youth&Soul. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
