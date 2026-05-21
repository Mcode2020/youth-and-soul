import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { ArrowLeft, Plus, Trash2, Save, Tag } from "lucide-react";
import { toast } from "sonner";

interface BrandDiscount {
  id: string;
  brand_name: string;
  discount_code: string;
  discount_percent: number;
  is_active: boolean;
}

export default function AdminBrandDiscounts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  useSEOHead({ title: "Admin — Brand Discounts", description: "Manage brand discount codes.", path: "/admin/brand-discounts", noIndex: true });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else setUser(data.user);
    });
  }, [navigate]);

  const { data: discounts = [], isLoading } = useQuery({
    queryKey: ["admin-brand-discounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_discounts")
        .select("*")
        .order("brand_name");
      if (error) throw error;
      return data as BrandDiscount[];
    },
    enabled: !!user,
  });

  const [newBrand, setNewBrand] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newPercent, setNewPercent] = useState(20);

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("brand_discounts").insert({
        brand_name: newBrand.trim(),
        discount_code: newCode.trim().toUpperCase(),
        discount_percent: newPercent,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand-discounts"] });
      queryClient.invalidateQueries({ queryKey: ["brand-discounts"] });
      setNewBrand("");
      setNewCode("");
      setNewPercent(20);
      toast.success("Brand discount added!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brand_discounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand-discounts"] });
      queryClient.invalidateQueries({ queryKey: ["brand-discounts"] });
      toast.success("Deleted!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, discount_code, discount_percent }: { id: string; discount_code: string; discount_percent: number }) => {
      const { error } = await supabase.from("brand_discounts").update({ discount_code, discount_percent, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand-discounts"] });
      queryClient.invalidateQueries({ queryKey: ["brand-discounts"] });
      toast.success("Updated!");
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Brand Discounts</h1>
            <p className="text-sm text-muted-foreground">Manage discount codes per brand — auto-applied to all products</p>
          </div>
        </div>

        {/* Add new */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Brand Discount
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              placeholder="Brand name"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
            />
            <input
              placeholder="Discount code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm uppercase"
            />
            <input
              type="number"
              placeholder="% off"
              value={newPercent}
              onChange={(e) => setNewPercent(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
              min={1}
              max={100}
            />
            <button
              onClick={() => addMutation.mutate()}
              disabled={!newBrand.trim() || !newCode.trim() || addMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {addMutation.isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_80px_60px] gap-2 px-4 py-3 bg-secondary/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Brand</span>
            <span>Code</span>
            <span>% Off</span>
            <span></span>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : discounts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No brand discounts yet. Add one above!</div>
          ) : (
            discounts.map((d) => (
              <BrandRow key={d.id} discount={d} onDelete={() => deleteMutation.mutate(d.id)} onUpdate={updateMutation.mutate} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function BrandRow({ discount, onDelete, onUpdate }: { discount: BrandDiscount; onDelete: () => void; onUpdate: (v: { id: string; discount_code: string; discount_percent: number }) => void }) {
  const [code, setCode] = useState(discount.discount_code);
  const [percent, setPercent] = useState(discount.discount_percent);
  const changed = code !== discount.discount_code || percent !== discount.discount_percent;

  return (
    <div className="grid grid-cols-[1fr_120px_80px_60px] gap-2 px-4 py-3 border-t border-border/50 items-center">
      <span className="text-sm font-medium text-foreground">{discount.brand_name}</span>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm"
      />
      <input
        type="number"
        value={percent}
        onChange={(e) => setPercent(Number(e.target.value))}
        className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm"
        min={1}
        max={100}
      />
      <div className="flex gap-1">
        {changed && (
          <button onClick={() => onUpdate({ id: discount.id, discount_code: code, discount_percent: percent })} className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
            <Save className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
