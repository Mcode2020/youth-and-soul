import nutrafolBanner from "@/assets/nutrafol-banner.png";

export function NutrafolBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <a
        href="https://www.nutrafol.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl border border-border/50 hover:shadow-medium transition-shadow"
      >
        <img
          src={nutrafolBanner}
          alt="Nutrafol - Hair Wellness From Within"
          className="w-full h-auto object-cover"
          loading="lazy"
          width={1920}
          height={400}
        />
      </a>
    </div>
  );
}
