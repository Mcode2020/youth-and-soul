import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProductDetail {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  description: string | null;
  price: number;
  original_price: number | null;
  product_url: string | null;
  images: string[] | null;
  goals: string[] | null;
  key_ingredients: string | null;
  benefits: string | null;
  usage_instructions: string | null;
  views: number;
  sales_count: number;
}

export interface ProductReview {
  id: string;
  author_name: string;
  age: number | null;
  rating: number;
  content: string;
  time_to_result: string | null;
  would_repurchase: boolean | null;
  helpful_count: number;
  goal: string | null;
  created_at: string;
}

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetch() {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        supabase
          .from("seller_products")
          .select("id, product_name, brand, category, description, price, original_price, product_url, images, goals, key_ingredients, benefits, usage_instructions, views, sales_count")
          .eq("id", id)
          .single(),
        supabase
          .from("product_reviews")
          .select("*")
          .eq("product_id", id)
          .order("helpful_count", { ascending: false }),
      ]);

      if (productRes.data) setProduct(productRes.data as ProductDetail);
      if (reviewsRes.data) setReviews(reviewsRes.data as ProductReview[]);
      setLoading(false);
    }

    fetch();
  }, [id]);

  return { product, reviews, loading };
}
