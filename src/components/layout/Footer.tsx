import { useNavigate } from "react-router-dom";
import { PaymentLogosBar } from "@/components/ui/PaymentLogosBar";


const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Earn Affiliate", href: "/earn-affiliate" },
  { label: "Earn Influencer", href: "/apply-influencer" },
  { label: "List Your Product", href: "/list-product" },
];

const shopLinks = [
  { label: "Anti-Aging", href: "/search?category=anti-aging" },
  { label: "Longevity", href: "/search?category=longevity" },
  { label: "Wellness", href: "/search?category=wellness" },
  { label: "Peptides", href: "/peptides" },
  { label: "All Products", href: "/search" },
];

const learnLinks = [
  { label: "Learn", href: "/learn" },
  { label: "Explore", href: "/explore" },
  { label: "GLP-1 Safety", href: "/safety-info/glp1" },
  { label: "Insurance Access", href: "/insurance-access" },
  { label: "Health Quiz", href: "/health-quiz/weight-loss" },
];

export function Footer() {
  const navigate = useNavigate();

  const LinkItem = ({ label, href }: { label: string; href: string }) => (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); navigate(href); }}
      className="text-sm text-[hsl(220,10%,55%)] hover:text-white transition-colors block"
    >
      {label}
    </a>
  );

  return (
    <footer className="bg-[hsl(220,20%,14%)] text-[hsl(220,10%,75%)] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Youth&Soul</h3>
            <p className="text-sm text-[hsl(220,10%,55%)] leading-relaxed mb-4">
              The trusted marketplace for longevity, anti-aging, and functional beauty — backed by science and real reviews.
            </p>
          </div>

          {/* Shop */}
          <div className="md:pl-8">
            <h4 className="text-sm font-semibold text-white mb-3">Shop</h4>
            <div className="space-y-2">
              {shopLinks.map(l => <LinkItem key={l.label} {...l} />)}
            </div>
          </div>

          {/* Learn */}
          <div className="md:pl-4">
            <h4 className="text-sm font-semibold text-white mb-3">Learn</h4>
            <div className="space-y-2">
              {learnLinks.map(l => <LinkItem key={l.label} {...l} />)}
            </div>
          </div>

          {/* Company */}
          <div className="md:pl-4">
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <div className="space-y-2">
              {companyLinks.map(l => <LinkItem key={l.label} {...l} />)}
            </div>
          </div>
        </div>

        {/* Divider only */}
        <div className="mt-8 pt-6 border-t border-[hsl(220,10%,20%)]" />

      </div>

      {/* Bottom bar */}
      <div className="border-t border-[hsl(220,10%,20%)]">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-4">
          <PaymentLogosBar size="lg" />
          <div className="flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-1 w-full overflow-hidden">
            {["Terms & Conditions", "Privacy Policy", "Refund Policy", "Medical Consent"].map((label, i) => {
              const hrefs = ["/terms-of-service", "/privacy-policy", "/terms-of-service", "/safety-info/glp1"];
              return (
                <a
                  key={label}
                  href={hrefs[i]}
                  onClick={(e) => { e.preventDefault(); navigate(hrefs[i]); }}
                  className="text-[9px] sm:text-xs whitespace-nowrap text-[hsl(220,10%,50%)] hover:text-white transition-colors"
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
