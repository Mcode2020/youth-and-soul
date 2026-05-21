import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RecentlyViewedProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  product_image: string | null;
  product_price: number;
  product_original_price: number | null;
  product_url: string | null;
  viewed_at: string;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("recently_viewed")
        .select("*")
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(24);
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error("fetch recently viewed", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return { items, loading, refetch: fetchItems, isAuthenticated: !!user };
}

/**
 * Track a product view. Safe to call without auth — silently no-ops.
 * Uses upsert so repeated views update the timestamp.
 */
export async function trackProductView(product: {
  id: string;
  name: string;
  brand: string;
  image?: string | null;
  price: number;
  originalPrice?: number | null;
  productUrl?: string | null;
}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    await supabase.from("recently_viewed").upsert(
      {
        user_id: session.user.id,
        product_id: product.id,
        product_name: product.name,
        product_brand: product.brand,
        product_image: product.image || null,
        product_price: product.price,
        product_original_price: product.originalPrice ?? null,
        product_url: product.productUrl || null,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_id" }
    );
  } catch (e) {
    console.error("trackProductView", e);
  }
}
