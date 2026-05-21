import { useEffect, useRef, useState } from "react";

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface CategoryStatsBannerProps {
  tagline: string;
  headline: string;
  stats: StatItem[];
  accentColor: string; // HSL like "230,60%,70%"
  bgGradient: string;  // tailwind gradient classes
  source?: string;
}

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

function AnimatedStat({ stat, inView, accentColor }: { stat: StatItem; inView: boolean; accentColor: string }) {
  const count = useCountUp(stat.value, 1800, inView);
  return (
    <div className="flex flex-col items-center text-center px-4 py-6">
      <span className="text-4xl md:text-6xl font-black text-white tracking-tight">
        {count}
        <span style={{ color: `hsl(${accentColor})` }}>{stat.suffix}</span>
      </span>
      <span className="text-xs md:text-sm text-white/70 mt-2 max-w-[160px] leading-snug">
        {stat.label}
      </span>
    </div>
  );
}

export function CategoryStatsBanner({ tagline, headline, stats, accentColor, bgGradient, source }: CategoryStatsBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`py-12 md:py-20 ${bgGradient}`}>
      <div className="max-w-5xl mx-auto px-4 text-center mb-8">
        <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: `hsl(${accentColor})` }}>
          {tagline}
        </p>
        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
          {headline}
        </h2>
      </div>
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <AnimatedStat stat={stat} inView={inView} accentColor={accentColor} />
          </div>
        ))}
      </div>
      {source && (
        <p className="text-center text-[11px] text-white/40 mt-6 max-w-2xl mx-auto px-4">{source}</p>
      )}
    </section>
  );
}
