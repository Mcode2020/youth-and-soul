import { useNavigate } from "react-router-dom";
import banner from "@/assets/glp1-oral-spray-banner.png";
import mobileBanner from "@/assets/glp1-spray-mobile-banner.png";

export function NewReleaseBanner() {
  const navigate = useNavigate();
  const go = () => navigate("/weightloss-glp-intake");

  return (
    <section aria-labelledby="new-release-heading" className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <h2 id="new-release-heading" className="sr-only">
        Introducing Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray
      </h2>

      {/* Desktop: single full image */}
      <button
        onClick={go}
        aria-label="Shop the launch: Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray"
        className="hidden md:block w-full rounded-3xl overflow-hidden border border-primary/15 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <img
          src={banner}
          alt="Future of drug delivery is here — Introducing Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray by Youth & Soul."
          className="w-full h-auto block"
          loading="lazy"
        />
      </button>

      {/* Mobile: single full banner image */}
      <div className="md:hidden">
        <button
          onClick={go}
          aria-label="Shop the launch: Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray"
          className="block w-full rounded-3xl overflow-hidden border border-primary/15 shadow-lg bg-[#F4EFE7] focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <img
            src={mobileBanner}
            alt="Introducing Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray — the future of drug delivery"
            className="block w-full h-auto"
            loading="lazy"
          />
        </button>
      </div>
    </section>
  );
}
