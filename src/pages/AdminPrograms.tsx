import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { ArrowLeft, Plus, Trash2, Upload, Image, Stethoscope, Star, Save } from "lucide-react";
import { toast } from "sonner";

const PROGRAMS = [
  { slug: "weight-loss", label: "Weight Loss" },
  { slug: "skin-hair", label: "Skin, Hair & Anti-Aging" },
  { slug: "sexual-health", label: "Sexual Health" },
  { slug: "longevity", label: "Longevity & NAD+" },
  { slug: "menopause-hrt", label: "Menopause & HRT" },
  { slug: "pain-recovery", label: "Pain & Recovery" },
];

type Tab = "results" | "doctors";

export default function AdminPrograms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0].slug);
  const [tab, setTab] = useState<Tab>("results");
  const [user, setUser] = useState<any>(null);
  useSEOHead({ title: "Admin — Programs", description: "Manage telehealth programs, doctors and results.", path: "/admin/programs", noIndex: true });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else setUser(data.user);
    });
  }, [navigate]);

  // ── Results ──
  const { data: results = [], isLoading: loadingResults } = useQuery({
    queryKey: ["admin-results", selectedProgram],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_results")
        .select("*")
        .eq("program_slug", selectedProgram)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addResult = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("program_results").insert({
        program_slug: selectedProgram,
        name: "New Patient",
        stat: "-0 lbs",
        stat_label: "Weight Lost",
        duration: "0 weeks",
        quote: "Enter patient quote here...",
        sort_order: (results?.length || 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results", selectedProgram] });
      toast.success("Result added!");
    },
  });

  const updateResult = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
      const { error } = await supabase.from("program_results").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-results", selectedProgram] }),
  });

  const deleteResult = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("program_results").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results", selectedProgram] });
      toast.success("Result deleted");
    },
  });

  const uploadResultImage = async (id: string, file: File, field: "image_url" | "before_image_url" | "after_image_url" = "image_url") => {
    const ext = file.name.split(".").pop();
    const path = `${selectedProgram}/${id}-${field}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("program-results").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("program-results").getPublicUrl(path);
    await updateResult.mutateAsync({ id, field, value: urlData.publicUrl });
    toast.success("Image uploaded!");
  };

  // ── Doctors ──
  const { data: doctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ["admin-doctors", selectedProgram],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_doctors")
        .select("*")
        .eq("program_slug", selectedProgram)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addDoctor = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("program_doctors").insert({
        program_slug: selectedProgram,
        name: "Dr. New Doctor",
        title: "MD",
        specialty: "Enter specialty",
        testimonial: "Enter doctor testimonial here...",
        sort_order: (doctors?.length || 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors", selectedProgram] });
      toast.success("Doctor added!");
    },
  });

  const updateDoctor = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
      const { error } = await supabase.from("program_doctors").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-doctors", selectedProgram] }),
  });

  const deleteDoctor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("program_doctors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors", selectedProgram] });
      toast.success("Doctor removed");
    },
  });

  const uploadDoctorPhoto = async (id: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${selectedProgram}/${id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("program-doctors").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("program-doctors").getPublicUrl(path);
    await updateDoctor.mutateAsync({ id, field: "photo_url", value: urlData.publicUrl });
    toast.success("Photo uploaded!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Program Content Manager</h1>
        <p className="text-muted-foreground text-sm mb-6">Upload results, doctor photos, and testimonials for each program.</p>

        {/* Program Selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
          {PROGRAMS.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedProgram(p.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedProgram === p.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("results")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === "results" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
            <Image className="w-4 h-4" /> Results ({results.length}/50)
          </button>
          <button onClick={() => setTab("doctors")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === "doctors" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
            <Stethoscope className="w-4 h-4" /> Doctors ({doctors.length})
          </button>
        </div>

        {/* Results Tab */}
        {tab === "results" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Up to 50 results per program</p>
              <button
                onClick={() => addResult.mutate()}
                disabled={results.length >= 50}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add Result
              </button>
            </div>

            {loadingResults ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <Image className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No results yet. Add your first transformation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((r: any) => (
                  <div key={r.id} className="bg-card rounded-2xl border border-border p-4 md:p-5">
                    <div className="flex gap-4">
                      {/* Before & After Image Uploads */}
                      <div className="shrink-0 flex gap-2">
                        <div className="text-center">
                          <p className="text-[10px] font-medium text-muted-foreground mb-1">Before</p>
                          <label className="cursor-pointer block w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors relative group">
                            {r.before_image_url ? (
                              <img src={r.before_image_url} alt="Before" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <Upload className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadResultImage(r.id, e.target.files[0], "before_image_url"); }} />
                          </label>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-medium text-muted-foreground mb-1">After</p>
                          <label className="cursor-pointer block w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors relative group">
                            {r.after_image_url ? (
                              <img src={r.after_image_url} alt="After" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <Upload className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadResultImage(r.id, e.target.files[0], "after_image_url"); }} />
                          </label>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Name" defaultValue={r.name} onBlur={(e) => updateResult.mutate({ id: r.id, field: "name", value: e.target.value })} />
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Age" type="number" defaultValue={r.age || ""} onBlur={(e) => updateResult.mutate({ id: r.id, field: "age", value: parseInt(e.target.value) || null })} />
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Stat (e.g. -47 lbs)" defaultValue={r.stat} onBlur={(e) => updateResult.mutate({ id: r.id, field: "stat", value: e.target.value })} />
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Stat Label" defaultValue={r.stat_label} onBlur={(e) => updateResult.mutate({ id: r.id, field: "stat_label", value: e.target.value })} />
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Duration" defaultValue={r.duration} onBlur={(e) => updateResult.mutate({ id: r.id, field: "duration", value: e.target.value })} />
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Tier" defaultValue={r.tier || ""} onBlur={(e) => updateResult.mutate({ id: r.id, field: "tier", value: e.target.value })} />
                        <input className="col-span-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Rating (1-5)" type="number" min={1} max={5} defaultValue={r.rating} onBlur={(e) => updateResult.mutate({ id: r.id, field: "rating", value: parseInt(e.target.value) || 5 })} />
                        <div className="col-span-1 flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                            <input type="checkbox" checked={r.is_active} onChange={(e) => updateResult.mutate({ id: r.id, field: "is_active", value: e.target.checked })} className="rounded" />
                            Active
                          </label>
                        </div>
                        <textarea className="col-span-2 md:col-span-4 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border resize-none" rows={2} placeholder="Patient quote..." defaultValue={r.quote} onBlur={(e) => updateResult.mutate({ id: r.id, field: "quote", value: e.target.value })} />
                      </div>

                      {/* Delete */}
                      <button onClick={() => { if (confirm("Delete this result?")) deleteResult.mutate(r.id); }} className="shrink-0 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors self-start">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doctors Tab */}
        {tab === "doctors" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Up to 4 doctors per program</p>
              <button
                onClick={() => addDoctor.mutate()}
                disabled={doctors.length >= 4}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add Doctor
              </button>
            </div>

            {loadingDoctors ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <Stethoscope className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No doctors yet. Add your first physician.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doc: any) => (
                  <div key={doc.id} className="bg-card rounded-2xl border border-border p-4 md:p-5">
                    <div className="flex gap-4">
                      {/* Photo Upload */}
                      <div className="shrink-0">
                        <label className="cursor-pointer block w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors relative group">
                          {doc.photo_url ? (
                            <img src={doc.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                              <Upload className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                            <Upload className="w-5 h-5 text-white" />
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadDoctorPhoto(doc.id, e.target.files[0]); }} />
                        </label>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <input className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Dr. Full Name" defaultValue={doc.name} onBlur={(e) => updateDoctor.mutate({ id: doc.id, field: "name", value: e.target.value })} />
                          <input className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border" placeholder="Title (MD, DO)" defaultValue={doc.title} onBlur={(e) => updateDoctor.mutate({ id: doc.id, field: "title", value: e.target.value })} />
                          <input className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border col-span-2 md:col-span-1" placeholder="Specialty" defaultValue={doc.specialty || ""} onBlur={(e) => updateDoctor.mutate({ id: doc.id, field: "specialty", value: e.target.value })} />
                        </div>
                        <textarea className="w-full px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm border border-border resize-none" rows={4} placeholder="Doctor testimonial (2-3 paragraphs)..." defaultValue={doc.testimonial} onBlur={(e) => updateDoctor.mutate({ id: doc.id, field: "testimonial", value: e.target.value })} />
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input type="checkbox" checked={doc.is_active} onChange={(e) => updateDoctor.mutate({ id: doc.id, field: "is_active", value: e.target.checked })} className="rounded" />
                          Active
                        </label>
                      </div>

                      {/* Delete */}
                      <button onClick={() => { if (confirm("Remove this doctor?")) deleteDoctor.mutate(doc.id); }} className="shrink-0 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors self-start">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
