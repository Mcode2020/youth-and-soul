
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Star, Trash2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useSEOHead } from "@/hooks/useSEOHead";

interface Review {
  id: string;
  name: string;
  review_text: string;
  stars: number;
  source: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", review_text: "", stars: 5, source: "" });
  useSEOHead({ title: "Admin — Reviews", description: "Manage site reviews.", path: "/admin/reviews", noIndex: true });

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("site_reviews")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from("site_reviews").insert({
      name: form.name,
      review_text: form.review_text,
      stars: form.stars,
      source: form.source || null,
      sort_order: reviews.length + 1,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Review added");
    setShowAdd(false);
    setForm({ name: "", review_text: "", stars: 5, source: "" });
    fetchReviews();
  };

  const handleUpdate = async (review: Review) => {
    const { error } = await supabase
      .from("site_reviews")
      .update({
        name: review.name,
        review_text: review.review_text,
        stars: review.stars,
        source: review.source,
        is_active: review.is_active,
      })
      .eq("id", review.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated");
    setEditingId(null);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("site_reviews").delete().eq("id", id);
    toast.success("Deleted");
    fetchReviews();
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin Reviews" }]} />
        <div className="flex items-center justify-between mb-6 mt-4">
          <h1 className="text-2xl font-bold text-foreground">Manage Reviews</h1>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>

        {showAdd && (
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <h3 className="font-semibold mb-3">New Review</h3>
            <div className="grid gap-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              />
              <textarea
                placeholder="Review text"
                value={form.review_text}
                onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[80px]"
              />
              <div className="flex gap-3">
                <select
                  value={form.stars}
                  onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                  {[5, 4, 3, 2, 1].map((s) => (
                    <option key={s} value={s}>{s} Stars</option>
                  ))}
                </select>
                <input
                  placeholder="Source (optional, e.g. Trustpilot)"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  <Save className="w-4 h-4 inline mr-1" /> Save
                </button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className={`bg-card border rounded-xl p-4 ${!r.is_active ? "opacity-50" : ""}`}>
                {editingId === r.id ? (
                  <div className="grid gap-3">
                    <input
                      value={r.name}
                      onChange={(e) => setReviews(reviews.map((rv) => rv.id === r.id ? { ...rv, name: e.target.value } : rv))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    />
                    <textarea
                      value={r.review_text}
                      onChange={(e) => setReviews(reviews.map((rv) => rv.id === r.id ? { ...rv, review_text: e.target.value } : rv))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[80px]"
                    />
                    <div className="flex gap-3">
                      <select
                        value={r.stars}
                        onChange={(e) => setReviews(reviews.map((rv) => rv.id === r.id ? { ...rv, stars: Number(e.target.value) } : rv))}
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((s) => (
                          <option key={s} value={s}>{s} Stars</option>
                        ))}
                      </select>
                      <input
                        value={r.source || ""}
                        onChange={(e) => setReviews(reviews.map((rv) => rv.id === r.id ? { ...rv, source: e.target.value } : rv))}
                        placeholder="Source"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={r.is_active}
                          onChange={(e) => setReviews(reviews.map((rv) => rv.id === r.id ? { ...rv, is_active: e.target.checked } : rv))}
                        />
                        Active
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(r)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Save</button>
                      <button onClick={() => { setEditingId(null); fetchReviews(); }} className="px-4 py-2 bg-secondary rounded-lg text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">{r.name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                          ))}
                        </div>
                        {r.source && <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">{r.source}</span>}
                        {!r.is_active && <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">Inactive</span>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.review_text}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingId(r.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
