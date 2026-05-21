import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SavedProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  product_image: string | null;
  product_price: number;
  product_original_price: number | null;
  created_at: string;
}

export function useSavedProducts() {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSavedProducts = useCallback(async () => {
    if (!user) {
      setSavedProducts([]);
      setSavedProductIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("saved_products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSavedProducts(data || []);
      setSavedProductIds(new Set(data?.map(p => p.product_id) || []));
    } catch (error) {
      console.error("Error fetching saved products:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedProducts();
  }, [fetchSavedProducts]);

  const toggleSave = async (product: {
    id: string;
    name: string;
    brand: string;
    image?: string;
    price: number;
    originalPrice?: number;
  }) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save products to your wishlist.",
        variant: "destructive",
      });
      return false;
    }

    const isSaved = savedProductIds.has(product.id);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_products")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        if (error) throw error;

        setSavedProductIds(prev => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
        setSavedProducts(prev => prev.filter(p => p.product_id !== product.id));

        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your saved products.`,
        });
      } else {
        const { data, error } = await supabase
          .from("saved_products")
          .insert({
            user_id: user.id,
            product_id: product.id,
            product_name: product.name,
            product_brand: product.brand,
            product_image: product.image || null,
            product_price: product.price,
            product_original_price: product.originalPrice || null,
          })
          .select()
          .single();

        if (error) throw error;

        setSavedProductIds(prev => new Set(prev).add(product.id));
        setSavedProducts(prev => [data, ...prev]);

        toast({
          title: "Added to wishlist",
          description: `${product.name} has been saved to your wishlist.`,
        });
      }
      return true;
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isSaved = (productId: string) => savedProductIds.has(productId);

  return {
    savedProducts,
    loading,
    toggleSave,
    isSaved,
    refetch: fetchSavedProducts,
    isAuthenticated: !!user,
  };
}
