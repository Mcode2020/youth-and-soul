import { motion } from "framer-motion";
import { useId } from "react";

interface DateOfBirthPickerProps {
  /** ISO-style value: "YYYY-MM-DD" (or partial during edit). */
  value: string;
  onChange: (val: string) => void;
  /** When true, draws the destructive border (used on validation errors). */
  hasError?: boolean;
  /** Visual variant. "intake" matches the GLP intake (large, bold). "compact" matches the Enroll form. */
  variant?: "intake" | "compact";
  /** Optional label rendered above the field (compact variant only). */
  label?: string;
  /** Show an "You're X — eligible ✓" pill below the field (intake variant). */
  showAgePill?: boolean;
  /** Minimum age allowed (default 18). */
  minAge?: number;
  /** Maximum age allowed (default 100). */
  maxAge?: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Mobile-friendly DOB picker.
 *
 * Each Month / Day / Year cell uses a transparent native <select> overlaid
 * across the entire cell so the full touch target — including the label area
 * and surrounding padding — reliably opens the native picker on every mobile
 * browser. The visible label and value sit underneath with `pointer-events-none`.
 */
export function DateOfBirthPicker({
  value,
  onChange,
  hasError = false,
  variant = "intake",
  label,
  showAgePill = true,
  minAge = 18,
  maxAge = 100,
}: DateOfBirthPickerProps) {
  const reactId = useId();
  const [yy, mm, dd] = (value || "").split("-");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: maxAge - minAge + 1 }, (_, i) => currentYear - minAge - i);
  const daysInMonth = mm && yy ? new Date(parseInt(yy), parseInt(mm), 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const setPart = (part: "y" | "m" | "d", val: string) => {
    const next = { y: yy || "", m: mm || "", d: dd || "" };
    next[part] = val;
    if (next.y && next.m && next.d) {
      onChange(`${next.y}-${next.m.padStart(2, "0")}-${next.d.padStart(2, "0")}`);
    } else {
      onChange(`${next.y}-${next.m}-${next.d}`);
    }
  };

  let age: number | null = null;
  if (yy && mm && dd && yy.length === 4) {
    const birth = new Date(parseInt(yy), parseInt(mm) - 1, parseInt(dd));
    const today = new Date();
    age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  }

  const monthLabel = mm ? MONTHS[parseInt(mm) - 1] : "";
  const dayLabel = dd ? String(parseInt(dd)) : "";
  const yearLabel = yy || "";

  // The transparent native select sits on top of the visible content,
  // covering the whole cell so the entire 56–84px touch target is tappable.
  const overlaySelectCls =
    "absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none bg-transparent border-0 m-0 p-0 z-10 text-base focus:outline-none";

  if (variant === "compact") {
    const cellHeight = "min-h-[48px]";
    const valueCls = "block text-foreground text-sm font-medium text-center px-3 pointer-events-none";

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        )}
        <div
          className={`grid grid-cols-3 overflow-hidden rounded-xl border bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${
            hasError ? "border-destructive" : "border-input"
          }`}
        >
          {/* Month */}
          <div className={`relative ${cellHeight} flex items-center justify-center border-r border-border hover:bg-muted/30 transition-colors`}>
            <span className={valueCls}>{monthLabel || <span className="text-muted-foreground">Month</span>}</span>
            <select
              id={`${reactId}-month`}
              value={mm || ""}
              onChange={(e) => setPart("m", e.target.value)}
              className={overlaySelectCls}
              aria-label="Birth month"
            >
              <option value="">Month</option>
              {MONTHS.map((label, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {/* Day */}
          <div className={`relative ${cellHeight} flex items-center justify-center border-r border-border hover:bg-muted/30 transition-colors`}>
            <span className={valueCls}>{dayLabel || <span className="text-muted-foreground">Day</span>}</span>
            <select
              id={`${reactId}-day`}
              value={dd || ""}
              onChange={(e) => setPart("d", e.target.value)}
              className={overlaySelectCls}
              aria-label="Birth day"
            >
              <option value="">Day</option>
              {days.map((d) => (
                <option key={d} value={String(d).padStart(2, "0")}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {/* Year */}
          <div className={`relative ${cellHeight} flex items-center justify-center hover:bg-muted/30 transition-colors`}>
            <span className={valueCls}>{yearLabel || <span className="text-muted-foreground">Year</span>}</span>
            <select
              id={`${reactId}-year`}
              value={yy || ""}
              onChange={(e) => setPart("y", e.target.value)}
              className={overlaySelectCls}
              aria-label="Birth year"
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  // Intake variant — large, bold, used in the GLP intake flow.
  const cellHeight = "min-h-[84px]";
  const labelCls =
    "block text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground text-center pt-4 pointer-events-none";
  const valueCls =
    "block text-foreground font-black text-2xl text-center pb-4 pt-1 pointer-events-none min-h-[2rem]";

  return (
    <>
      <div
        className={`grid grid-cols-[1fr_1fr_1.2fr] rounded-[1.75rem] border-2 bg-background overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all ${
          hasError ? "border-destructive" : "border-border"
        }`}
      >
        {/* Month */}
        <div className={`relative ${cellHeight} flex flex-col justify-center hover:bg-muted/30 transition-colors`}>
          <span className={labelCls}>Month</span>
          <span className={valueCls}>
            {monthLabel || <span className="text-muted-foreground/60">—</span>}
          </span>
          <select
            id={`${reactId}-month`}
            value={mm || ""}
            onChange={(e) => setPart("m", e.target.value)}
            className={overlaySelectCls}
            aria-label="Birth month"
          >
            <option value="">—</option>
            {MONTHS.map((label, i) => (
              <option key={i} value={String(i + 1)}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {/* Day */}
        <div className={`relative ${cellHeight} flex flex-col justify-center hover:bg-muted/30 transition-colors border-x border-border/50`}>
          <span className={labelCls}>Day</span>
          <span className={valueCls}>
            {dayLabel || <span className="text-muted-foreground/60">—</span>}
          </span>
          <select
            id={`${reactId}-day`}
            value={dd ? String(parseInt(dd)) : ""}
            onChange={(e) => setPart("d", e.target.value)}
            className={overlaySelectCls}
            aria-label="Birth day"
          >
            <option value="">—</option>
            {days.map((d) => (
              <option key={d} value={String(d)}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {/* Year */}
        <div className={`relative ${cellHeight} flex flex-col justify-center hover:bg-muted/30 transition-colors`}>
          <span className={labelCls}>Year</span>
          <span className={valueCls}>
            {yearLabel || <span className="text-muted-foreground/60">—</span>}
          </span>
          <select
            id={`${reactId}-year`}
            value={yy || ""}
            onChange={(e) => setPart("y", e.target.value)}
            className={overlaySelectCls}
            aria-label="Birth year"
          >
            <option value="">—</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAgePill && age !== null && age >= minAge && age <= maxAge && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold text-primary">
            You're {age} — eligible ✓
          </span>
        </motion.div>
      )}
      {showAgePill && age !== null && age < minAge && (
        <p className="mt-2 text-xs text-destructive font-medium">
          You must be {minAge} or older to enroll.
        </p>
      )}
    </>
  );
}
