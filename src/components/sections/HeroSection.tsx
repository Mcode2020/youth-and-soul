import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import heroLifestyle1 from "@/assets/hero-lifestyle-1-new.jpg";
import heroLifestyle2 from "@/assets/hero-lifestyle-2-new.jpg";
import heroLifestyle3 from "@/assets/hero-lifestyle-3-v2.jpg";
import heroLifestyle4 from "@/assets/hero-lifestyle-4-v2.jpg";

const heroSlides = [
  { image: heroLifestyle1, alt: "Woman stretching outdoors at golden hour", title: "Wellness & Vitality" },
  { image: heroLifestyle2, alt: "Premium health supplements flatlay", title: "Premium Supplements" },
  { image: heroLifestyle3, alt: "Happy couple enjoying active lifestyle", title: "Live Your Best Life" },
  { image: heroLifestyle4, alt: "Woman meditating at sunrise by the ocean", title: "Mind & Body Balance" },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Hero Image Carousel */}
      <div className="relative h-64 sm:h-72 md:h-80 lg:h-[26rem] overflow-hidden -mt-[56px] pt-[56px]">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-top"
              width={1920}
              height={800}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
            {/* Slide title badge */}
            <div className="absolute top-[70px] md:top-[80px] left-4 md:left-8 z-10">
              <span className="inline-block px-4 py-1.5 bg-card/80 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold text-foreground border border-border/50">
                {slide.title}
              </span>
            </div>
          </div>
        ))}

        {/* Arrow Navigation - Desktop */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full items-center justify-center hover:bg-card transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full items-center justify-center hover:bg-card transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

      </div>

      {/* Content area */}
      <div className="relative px-4 py-5 -mt-24 md:-mt-28">
        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-4xl text-center text-foreground mb-2 leading-tight animate-fade-up font-bold">
            Where longevity meets <span className="text-gradient-gold">real results.</span>
          </h1>

          <p className="text-center text-muted-foreground text-[11px] sm:text-xs md:text-base leading-relaxed animate-fade-up stagger-1 max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
            DISCOUNT CODES on anti-aging supplements, functional beauty & age reversal procedures. Get a prescription in 5 mins! 24/7 doctors' approval & support on prescription products. Be the best version of you. NOW.
          </p>
        </div>
      </div>
    </section>
  );
}
