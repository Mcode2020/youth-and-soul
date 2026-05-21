import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import amerigroup from "@/assets/insurance-amerigroup.webp";
import carrum from "@/assets/insurance-carrum.webp";
import hinge from "@/assets/insurance-hinge.webp";
import united from "@/assets/insurance-united.png";
import hpp from "@/assets/insurance-hpp.png";
import oscar from "@/assets/insurance-oscar.png";
import aetna from "@/assets/insurance-aetna.webp";
import prominence from "@/assets/insurance-prominence.png";
import guidewell from "@/assets/insurance-guidewell.png";
import hcsc from "@/assets/insurance-hcsc.png";

const row1 = [
  { src: oscar, alt: "Oscar Health" },
  { src: aetna, alt: "Aetna" },
  { src: prominence, alt: "Prominence Health" },
  { src: united, alt: "United Healthcare" },
];

const row2 = [
  { src: hinge, alt: "Hinge Health" },
  { src: amerigroup, alt: "Amerigroup" },
  { src: hpp, alt: "Health Partners Plans" },
  { src: carrum, alt: "Carrum Health" },
  { src: guidewell, alt: "GuideWell" },
  { src: hcsc, alt: "HCSC" },
];

export function InsuranceTrustBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
          We accept health insurance from all<br className="hidden md:block" /> the biggest insurance companies
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
          Youth&Soul works with all major PPO and HMO insurance providers — so you can focus on your health, not your coverage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 mb-8">
          {row1.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
            className={`w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
                logo.alt === "Oscar Health"
                  ? "h-10 md:h-14 max-w-[130px] md:max-w-[155px]"
                  : logo.alt === "Aetna"
                    ? "h-7 md:h-9 max-w-[95px] md:max-w-[114px]"
                  : ["Hinge Health", "Carrum Health"].includes(logo.alt)
                    ? "h-9 md:h-12 max-w-[130px] md:max-w-[156px]"
                    : "h-7 md:h-9 max-w-[100px] md:max-w-[120px]"
              }`}
              loading="lazy"
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 mb-10">
          {row2.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
            className={`w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
                logo.alt === "Oscar Health"
                  ? "h-10 md:h-14 max-w-[130px] md:max-w-[155px]"
                  : logo.alt === "Aetna"
                    ? "h-7 md:h-9 max-w-[95px] md:max-w-[114px]"
                  : ["Hinge Health", "Carrum Health"].includes(logo.alt)
                    ? "h-9 md:h-12 max-w-[130px] md:max-w-[156px]"
                    : "h-7 md:h-9 max-w-[100px] md:max-w-[120px]"
              }`}
              loading="lazy"
            />
          ))}
        </div>

        {/* Insurance CTA */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[hsl(155,25%,35%)] to-[hsl(155,20%,28%)] rounded-2xl p-6 md:p-8 text-white">
          <h3 className="text-lg md:text-2xl font-bold mb-2">Don't have insurance?</h3>
          <p className="text-sm md:text-base text-white/80 mb-5 leading-relaxed">
            We can provide you access to insurance for all our longevity and health plans — including hair loss, gut problems, sleep issues, mental health, and more.
          </p>
          <button
            onClick={() => navigate("/insurance-access")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[hsl(155,25%,30%)] rounded-xl font-bold text-sm md:text-base hover:bg-white/90 transition-colors"
          >
            Get Insurance Access
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
