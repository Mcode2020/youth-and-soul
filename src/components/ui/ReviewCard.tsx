import { Star, ThumbsUp, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  author: string;
  avatar?: string;
  age?: number;
  goal: string;
  rating: number;
  content: string;
  beforeImage?: string;
  afterImage?: string;
  timeToResult?: string;
  wouldRepurchase?: boolean;
  helpful?: number;
  className?: string;
}

export function ReviewCard({
  author,
  avatar,
  age,
  goal,
  rating,
  content,
  beforeImage,
  afterImage,
  timeToResult,
  wouldRepurchase,
  helpful = 0,
  className,
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border/50 p-4 shadow-soft",
        "min-w-[300px] max-w-[340px]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={author} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-secondary-foreground">
              {author.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{author}</span>
            {age && (
              <span className="text-xs text-muted-foreground">• {age} yrs</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < rating 
                    ? "fill-accent text-accent" 
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>

        <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg">
          {goal}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground/80 leading-relaxed mb-4 line-clamp-3">
        {content}
      </p>

      {/* Before/After */}
      {beforeImage && afterImage && (
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative rounded-xl overflow-hidden aspect-square bg-secondary/30">
            <img 
              src={beforeImage} 
              alt="Before" 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-xs font-medium bg-foreground/80 text-background rounded">
              Before
            </span>
          </div>
          <div className="flex-1 relative rounded-xl overflow-hidden aspect-square bg-secondary/30">
            <img 
              src={afterImage} 
              alt="After" 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
              After
            </span>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
        {timeToResult && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeToResult}</span>
          </div>
        )}
        
        {wouldRepurchase && (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="font-medium">Would repurchase</span>
          </div>
        )}

        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground ml-auto transition-colors">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Helpful ({helpful})</span>
        </button>
      </div>
    </div>
  );
}
