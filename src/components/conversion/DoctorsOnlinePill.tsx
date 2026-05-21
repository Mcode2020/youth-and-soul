import { useEffect, useState } from "react";

/**
 * Small "X doctors online now" availability pill.
 * Logic: business hours (8am–8pm local) shows 8–14 doctors, off-hours shows 2–4.
 * Re-rolls every 30s within range to feel live.
 */
export function DoctorsOnlinePill({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(11);

  useEffect(() => {
    const calc = () => {
      const h = new Date().getHours();
      const businessHours = h >= 8 && h <= 20;
      const min = businessHours ? 8 : 2;
      const max = businessHours ? 14 : 4;
      setCount(Math.floor(Math.random() * (max - min + 1)) + min);
    };
    calc();
    const id = setInterval(calc, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[11px] md:text-xs font-semibold text-white ${className}`}
    >
      <span className="relative inline-flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-green-400" />
      </span>
      {count} doctors online now
    </span>
  );
}
