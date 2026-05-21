import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SellerProduct {
  id: string;
  seller_id: string;
  product_name: string;
  brand: string;
  category: string;
  description: string | null;
  price: number;
  original_price: number | null;
  product_url: string | null;
  images: string[];
  goals: string[];
  key_ingredients: string | null;
  benefits: string | null;
  usage_instructions: string | null;
  status: "pending" | "approved" | "rejected" | "paused";
  views: number;
  sales_count: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  pendingProducts: number;
}

export function useSellerProducts() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingProducts: 0,
  });
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

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("seller_products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const typedProducts = (data || []) as SellerProduct[];
      setProducts(typedProducts);

      // Calculate stats
      const totalProducts = typedProducts.length;
      const activeProducts = typedProducts.filter(p => p.status === "approved").length;
      const pendingProducts = typedProducts.filter(p => p.status === "pending").length;
      const totalViews = typedProducts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalSales = typedProducts.reduce((sum, p) => sum + (p.sales_count || 0), 0);
      const totalRevenue = typedProducts.reduce((sum, p) => sum + (p.revenue || 0), 0);

      setStats({
        totalProducts,
        activeProducts,
        totalViews,
        totalSales,
        totalRevenue,
        pendingProducts,
      });
    } catch (error) {
      console.error("Error fetching seller products:", error);
      toast({
        title: "Error",
        description: "Failed to load your products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProductStatus = async (productId: string, status: "approved" | "paused") => {
    try {
      const { error } = await supabase
        .from("seller_products")
        .update({ status })
        .eq("id", productId)
        .eq("seller_id", user?.id);

      if (error) throw error;

      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, status } : p))
      );

      toast({
        title: "Product updated",
        description: `Product has been ${status === "paused" ? "paused" : "activated"}.`,
      });
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("seller_products")
        .delete()
        .eq("id", productId)
        .eq("seller_id", user?.id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));

      toast({
        title: "Product deleted",
        description: "Your product has been removed.",
      });
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    products,
    stats,
    loading,
    refetch: fetchProducts,
    updateProductStatus,
    deleteProduct,
    isAuthenticated: !!user,
  };
}
