import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Star, Heart, Share2, ShoppingCart, 
  Clock, Check, ChevronRight, ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProductDetail } from "@/hooks/useProductDetail";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, reviews, loading } = useProductDetail(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const avgRatingNum = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  useSEOHead({
    title: product ? `${product.product_name} by ${product.brand}` : "Product",
    description: product
      ? (product.description?.slice(0, 160) ||
          `${product.product_name} from ${product.brand}. ${product.benefits?.slice(0, 100) || "Discover this Youth & Soul curated product."}`)
      : "Product not found on Youth & Soul.",
    path: `/product/${id || ""}`,
    type: "product",
    ogImage: product?.images?.[0] || product?.product_url || undefined,
    keywords: product ? `${product.product_name}, ${product.brand}, ${product.category}, ${product.goals?.join(", ") || ""}, supplements, longevity` : undefined,
    noIndex: !product && !loading,
    jsonLd: product ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.product_name,
      description: product.description || product.benefits || `${product.product_name} from ${product.brand}`,
      image: product.images?.length ? product.images : (product.product_url ? [product.product_url] : []),
      sku: product.id,
      brand: { "@type": "Brand", name: product.brand },
      category: product.category,
      offers: {
        "@type": "Offer",
        url: `https://youthandsoul.com/product/${product.id}`,
        priceCurrency: "USD",
        price: product.price,
        availability: "https://schema.org/InStock",
        seller: { "@id": "https://youthandsoul.com/#organization" },
      },
      ...(avgRatingNum && reviews.length > 0 ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: avgRatingNum.toFixed(1),
          reviewCount: reviews.length,
          bestRating: 5,
          worstRating: 1,
        },
      } : {}),
    } : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <MobileHeader />
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <Skeleton className="w-full aspect-square rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const allImages = product.images?.length
    ? product.images
    : product.product_url
      ? [product.product_url]
      : [];

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const benefitsList = product.benefits
    ? product.benefits.split(/[,;\n]/).map(b => b.trim()).filter(Boolean)
    : [];

  const ingredientsList = product.key_ingredients
    ? product.key_ingredients.split(/[,;\n]/).map(i => i.trim()).filter(Boolean)
    : [];

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <MobileHeader />
      <Breadcrumbs items={[
        { label: "Products", href: "/search" },
        { label: product.product_name }
      ]} />

      <main className="max-w-lg mx-auto">
        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="relative">
            <div className="aspect-square bg-secondary/30">
              <img
                src={allImages[selectedImage] || allImages[0]}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </div>

            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 text-sm font-semibold bg-accent text-accent-foreground rounded-lg">
                  -{discount}%
                </span>
              </div>
            )}

            {allImages.length > 1 && (
              <div className="flex gap-2 p-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === idx ? "border-primary" : "border-border"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="px-4 py-4">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            {product.brand}
          </span>
          <h1 className="text-2xl text-foreground mt-1 mb-3">{product.product_name}</h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="text-lg font-semibold text-foreground">{avgRating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Goals */}
          {product.goals && product.goals.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.goals.map((goal, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {goal}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Benefits */}
          {benefitsList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Benefits</h3>
              <div className="space-y-2">
                {benefitsList.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Ingredients */}
          {ingredientsList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Key Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {ingredientsList.map((ingredient, idx) => (
                  <span key={idx} className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-lg">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          {product.usage_instructions && (
            <div className="mb-6 p-4 bg-secondary/30 rounded-xl">
              <h3 className="text-sm font-semibold text-foreground mb-2">How to Use</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.usage_instructions}
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="px-4 pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-semibold text-secondary-foreground">
                        {review.author_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{review.author_name}</span>
                        {review.age && (
                          <span className="text-xs text-muted-foreground">• {review.age} yrs</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                    {review.content}
                  </p>

                  <div className="flex items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
                    {review.time_to_result && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{review.time_to_result}</span>
                      </div>
                    )}
                    {review.goal && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                        {review.goal}
                      </span>
                    )}
                    <button className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({review.helpful_count})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length === 0 && !loading && (
          <div className="px-4 pb-6">
            <div className="bg-secondary/30 rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground">No reviews yet for this product.</p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex items-center border border-border rounded-xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 text-foreground hover:bg-secondary transition-colors rounded-l-xl"
            >
              -
            </button>
            <span className="px-4 py-3 font-medium text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 text-foreground hover:bg-secondary transition-colors rounded-r-xl"
            >
              +
            </button>
          </div>

          <Button className="flex-1 h-12 gap-2 text-base">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
