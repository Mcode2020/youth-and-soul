import { cn } from "@/lib/utils";
import React from "react";

interface GoalCardProps {
  title: string;
  description?: string;
  image?: string;
  gradient?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export function GoalCard({ 
  title, 
  description, 
  image,
  gradient,
  onClick,
  className,
  style,
  compact = false,
}: GoalCardProps) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "group relative flex items-center gap-2 rounded-full",
        "bg-card border border-border/50",
        "shadow-soft hover:shadow-medium transition-all duration-300",
        "hover:border-primary/30",
        "text-left whitespace-nowrap flex-shrink-0",
        "touch-target active:scale-95",
        "px-2 py-1.5 md:px-3 md:py-2",
        className
      )}
    >
      {/* Image thumbnail */}
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>
      
      <span className="font-medium text-foreground text-xs md:text-sm pr-1">
        {title}
      </span>
    </button>
  );
}
