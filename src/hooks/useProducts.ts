import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryOrFilter } from "@/lib/categoryMapping";

export interface Product {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  description: string | null;
  price: number;
  original_price: number | null;
  product_url: string | null;
  images: string[] | null;
  goals: string[];
  views: number;
  sales_count: number;
  discount_code: string | null;
}

interface UseProductsOptions {
  category?: string;
  categories?: string[];
  goal?: string;
  brand?: string;
  perPage?: number;
  orderBy?: "sales_count" | "views" | "price" | "created_at";
  ascending?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, categories, goal, brand, perPage = 12, orderBy = "sales_count", ascending = false } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, categories, goal, brand]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Build base filter for count query
      let countQuery = supabase
        .from("seller_products")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      let dataQuery = supabase
        .from("seller_products")
        .select("id, product_name, brand, category, description, price, original_price, product_url, images, goals, views, sales_count, discount_code")
        .eq("status", "approved")
        .order(orderBy, { ascending });

      if (category && category !== "All") {
        const orFilter = getCategoryOrFilter(category);
        if (orFilter) {
          countQuery = countQuery.or(orFilter);
          dataQuery = dataQuery.or(orFilter);
        } else {
          // Fallback: direct ilike
          countQuery = countQuery.ilike("category", `%${category}%`);
          dataQuery = dataQuery.ilike("category", `%${category}%`);
        }
      } else {
        // Global exclusion: hide all peptide products from the marketplace
        countQuery = countQuery.not("category", "ilike", "%peptide%");
        dataQuery = dataQuery.not("category", "ilike", "%peptide%");
      }

      if (categories && categories.length > 0) {
        countQuery = countQuery.in("category", categories);
        dataQuery = dataQuery.in("category", categories);
      }

      if (goal) {
        countQuery = countQuery.contains("goals", [goal]);
        dataQuery = dataQuery.contains("goals", [goal]);
      }

      if (brand) {
        countQuery = countQuery.ilike("brand", `%${brand}%`);
        dataQuery = dataQuery.ilike("brand", `%${brand}%`);
      }

      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      dataQuery = dataQuery.range(from, to);

      const [{ count }, { data, error }] = await Promise.all([countQuery, dataQuery]);

      if (error) throw error;
      
      // Fix brand image URLs - split comma-separated strings and extract Shopify CDN URLs
      const fixedData = (data || []).map((p: any) => ({
        ...p,
        images: p.images?.flatMap((img: string) => {
          const urls = img.includes(', http') ? img.split(', ').map((u: string) => u.trim()) : [img];
          return urls.map((url: string) => {
            if (url.includes('healf.com/_next/image')) {
              try {
                const urlParam = new URL(url).searchParams.get('url');
                if (urlParam) return urlParam;
              } catch {
                const match = url.match(/url=([^&]+)/);
                if (match) return decodeURIComponent(match[1]);
              }
            }
            return url;
          });
        }) || null,
      }));
      
      setProducts(fixedData as Product[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [category, categories, goal, brand, perPage, orderBy, ascending, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / perPage);

  return { products, loading, page, setPage, totalPages, totalCount, refetch: fetchProducts };
}
