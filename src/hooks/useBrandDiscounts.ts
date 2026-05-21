import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BrandDiscount {
  id: string;
  brand_name: string;
  discount_code: string;
  discount_percent: number;
}

export function useBrandDiscounts() {
  return useQuery({
    queryKey: ["brand-discounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_discounts")
        .select("id, brand_name, discount_code, discount_percent")
        .eq("is_active", true);
      if (error) throw error;
      return (data || []) as BrandDiscount[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function getBrandDiscount(brandDiscounts: BrandDiscount[], brandName: string) {
  return brandDiscounts.find(
    (bd) => bd.brand_name.toLowerCase() === brandName.toLowerCase()
  );
}
