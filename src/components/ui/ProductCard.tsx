import { useState } from "react";
import { Star, Shield, Award, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { trackProductView } from "@/hooks/useRecentlyViewed";


interface ProductCardProps {
  id?: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badges?: string[];
  isAthleSafe?: boolean;
  isCertified?: boolean;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  onClick?: () => void;
  className?: string;
  discountCode?: string | null;
  discountPercent?: number | null;
  productUrl?: string | null;
  showDiscountBanner?: boolean;
}

export function ProductCard({
  id,
  name,
  brand,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  badges = [],
  isAthleSafe,
  isCertified,
  isSaved = false,
  onSaveToggle,
  onClick,
  className,
  discountCode,
  discountPercent,
  productUrl,
  showDiscountBanner = true,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);


  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle();
    } else {
      // Redirect to auth if no handler provided
      window.location.href = "/auth";
    }
  };

  const handleCardClick = () => {
    // Fire-and-forget tracking for the user's recently-viewed list
    if (id) {
      trackProductView({
        id,
        name,
        brand,
        image,
        price,
        originalPrice,
        productUrl,
      });
    }
    if (productUrl) {
      window.open(productUrl, "_blank", "noopener,noreferrer");
    } else {
      onClick?.();
    }
  };

  return (
    <button
      onClick={handleCardClick}
      className={cn(
        "group flex flex-col bg-card rounded-xl md:rounded-2xl overflow-hidden",
        "border border-border/40 shadow-soft",
        "hover:shadow-medium hover:border-primary/50 hover:ring-1 hover:ring-primary/30",
        "transition-all duration-300 text-left",
        "w-full min-w-0 h-full",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary/20 overflow-hidden">
        {/* Skeleton loader */}
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        {imageError || !image || image === "/placeholder.svg" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 p-2">
            <span className="text-sm sm:text-xl md:text-2xl font-serif font-bold select-none tracking-wider text-center leading-tight" style={{ color: '#d1d5db', textShadow: '0 0 8px rgba(255,255,255,0.9), 1px 1px 2px rgba(255,255,255,0.8)' }}>Youth&Soul</span>
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              !imageLoaded && "opacity-0"
            )}
          />
        )}
        
        {/* Badges & discount pill */}
        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex flex-wrap gap-1 z-10">
          {discountCode && (
            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 bg-pink-100 text-pink-700 rounded-full text-[8px] md:text-[10px] font-bold tracking-wide shadow-sm">
              {discountCode}
            </span>
          )}
          {isAthleSafe && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-medium bg-primary/90 text-primary-foreground rounded-full">
              <Shield className="w-2.5 h-2.5 md:w-3 md:h-3" />
            </span>
          )}
        </div>

        {/* Save/Wishlist Button */}
        <button
          onClick={handleSaveClick}
          className={cn(
            "absolute top-1.5 right-1.5 md:top-2 md:right-2 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all",
            isSaved 
              ? "bg-red-500 text-white" 
              : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("w-3 h-3 md:w-4 md:h-4", isSaved && "fill-current")} />
        </button>

        {/* Trust icons */}
        <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 flex gap-1">
          {isCertified && (
            <div className="w-5 h-5 md:w-7 md:h-7 flex items-center justify-center bg-card/90 backdrop-blur-sm rounded-full">
              <Award className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2 md:p-3 min-h-0">
        <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5 md:mb-1 truncate">
          {brand}
        </span>
        
        <h3 className="font-sans text-xs md:text-sm font-medium text-foreground line-clamp-2 mb-1 md:mb-2 leading-tight md:leading-snug">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-1.5 mb-1 md:mb-2">
          <div className="flex items-center gap-0.5">
            <span className="text-[11px] md:text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 md:gap-2 mt-auto flex-wrap">
          {price > 0 ? (
            <>
              <span className="text-sm md:text-lg font-semibold text-foreground">
                ${price.toFixed(2)}
              </span>
              {originalPrice && originalPrice > 0 && (
                <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs md:text-sm font-semibold text-primary">View Price</span>
          )}
        </div>
      </div>

      {showDiscountBanner && (
        <div className="bg-primary px-1.5 py-1.5 md:px-3 md:py-2.5 flex items-center justify-center mt-auto">
          <span className="text-[7px] sm:text-[8px] md:text-xs font-bold text-primary-foreground leading-tight tracking-wide text-center break-words">
            {discountCode && discountPercent
              ? `${discountPercent}% off / ${discountCode}`
              : discountCode
                ? `Code: ${discountCode}`
                : "Exclusive discount available"}
          </span>
        </div>
      )}
    </button>
  );
}

// Skeleton component for loading state
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card rounded-xl md:rounded-2xl overflow-hidden",
        "border border-border/40",
        "w-full min-w-0",
        className
      )}
    >
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col p-2 md:p-3 gap-1.5 md:gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-14 mt-1" />
      </div>
    </div>
  );
}
