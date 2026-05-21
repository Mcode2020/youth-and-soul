import { cn } from "@/lib/utils";

interface CategoryPillProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryPill({ 
  label, 
  isActive, 
  onClick,
  className 
}: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap",
        "sm:px-3.5 sm:py-2 sm:text-xs",
        "md:px-5 md:py-2.5 md:text-sm",
        "transition-all duration-200 border",
        isActive 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-card border-border/50 text-foreground hover:bg-secondary",
        className
      )}
    >
      {label}
    </button>
  );
}
