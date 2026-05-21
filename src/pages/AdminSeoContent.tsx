import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSEOHead } from "@/hooks/useSEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, RefreshCw, Zap, Globe, FileText, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Hub = {
  id: string;
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  created_at: string;
};

type Spoke = {
  id: string;
  hub_id: string;
  slug: string;
  title: string;
  page_type: string;
  is_published: boolean;
  is_ai_generated: boolean;
  created_at: string;
};

type QueueItem = {
  id: string;
  hub_id: string;
  topic: string;
  question: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

export default function AdminSeoContent() {
  const { toast } = useToast();
  const [hubs, setHubs] = useState<Hub[]>([]);
  useSEOHead({ title: "Admin — SEO Content", description: "Manage SEO hub and spoke pages.", path: "/admin/seo-content", noIndex: true });
  const [spokes, setSpokes] = useState<Spoke[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedHub, setSelectedHub] = useState<string>("");
  const [newTopic, setNewTopic] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [generating, setGenerating] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [bestGenerating, setBestGenerating] = useState(false);

  // Queue form
  const [queueHubId, setQueueHubId] = useState("");
  const [queueTopic, setQueueTopic] = useState("");
  const [queueQuestion, setQueueQuestion] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedHub) loadSpokes(selectedHub);
  }, [selectedHub]);

  const loadData = async () => {
    const [{ data: h }, { data: q }] = await Promise.all([
      supabase.from("seo_hub_pages").select("id, slug, title, category, is_published, created_at").order("category"),
      supabase.from("seo_generation_queue").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (h) setHubs(h);
    if (q) setQueue(q as QueueItem[]);
  };

  const loadSpokes = async (hubId: string) => {
    const { data } = await supabase
      .from("seo_spoke_pages")
      .select("id, hub_id, slug, title, page_type, is_published, is_ai_generated, created_at")
      .eq("hub_id", hubId)
      .order("created_at", { ascending: false });
    if (data) setSpokes(data);
  };

  const generateSingle = async () => {
    if (!selectedHub || !newTopic) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-seo-content", {
        body: { hub_id: selectedHub, topic: newTopic, question: newQuestion || undefined },
      });
      if (error) throw error;
      toast({ title: "Page generated!", description: data.page?.title });
      setNewTopic("");
      setNewQuestion("");
      loadSpokes(selectedHub);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setGenerating(false);
  };

  const runBatch = async () => {
    setBatchGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-seo-content", {
        body: { batch_mode: true },
      });
      if (error) throw error;
      toast({ title: "Batch complete!", description: `Generated ${data.generated} pages` });
      loadData();
      if (selectedHub) loadSpokes(selectedHub);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setBatchGenerating(false);
  };

  const runBestQuestions = async () => {
    setBestGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-seo-content", {
        body: { daily_best_questions: true },
      });
      if (error) throw error;
      toast({ title: "Best questions generated!", description: `Queued ${data.queued} and generated ${data.generated} pages` });
      loadData();
      if (selectedHub) loadSpokes(selectedHub);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setBestGenerating(false);
  };

  const addToQueue = async () => {
    if (!queueHubId || !queueTopic) return;
    const { error } = await supabase.from("seo_generation_queue").insert({
      hub_id: queueHubId,
      topic: queueTopic,
      question: queueQuestion || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added to queue" });
      setQueueTopic("");
      setQueueQuestion("");
      loadData();
    }
  };

  const deleteSpoke = async (id: string) => {
    await supabase.from("seo_spoke_pages").delete().eq("id", id);
    if (selectedHub) loadSpokes(selectedHub);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("seo_spoke_pages").update({
      is_published: !current,
      published_at: !current ? new Date().toISOString() : null,
    }).eq("id", id);
    if (selectedHub) loadSpokes(selectedHub);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/programs"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">SEO Content Engine</h1>
          <Badge variant="secondary">{spokes.length} spoke pages</Badge>
        </div>

        <Tabs defaultValue="generate">
          <TabsList>
            <TabsTrigger value="generate"><Zap className="h-4 w-4 mr-1" />Generate</TabsTrigger>
            <TabsTrigger value="pages"><FileText className="h-4 w-4 mr-1" />Pages</TabsTrigger>
            <TabsTrigger value="queue"><RefreshCw className="h-4 w-4 mr-1" />Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Single Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedHub} onValueChange={setSelectedHub}>
                  <SelectTrigger><SelectValue placeholder="Select hub category" /></SelectTrigger>
                  <SelectContent>
                    {hubs.map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Topic (e.g. 'Best GLP-1 peptides for weight loss 2026')" value={newTopic} onChange={e => setNewTopic(e.target.value)} />
                <Input placeholder="Question (optional, for Q&A format)" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                <Button onClick={generateSingle} disabled={generating || !selectedHub || !newTopic}>
                  {generating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Zap className="h-4 w-4 mr-2" />Generate Page</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Batch Generate (Process Queue)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Processes up to 7 pending queue items and generates AI content for each.</p>
                <Button onClick={runBatch} disabled={batchGenerating} variant="secondary">
                  {batchGenerating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Processing...</> : <><RefreshCw className="h-4 w-4 mr-2" />Run Batch (up to 7)</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Questions Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Creates the “best health questions” hub and generates 7 Google/AI-indexable “what is the best…” pages.</p>
                <Button onClick={runBestQuestions} disabled={bestGenerating}>
                  {bestGenerating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Zap className="h-4 w-4 mr-2" />Generate 7 Best Questions</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4 mt-4">
            <div className="flex gap-3 mb-4">
              <Select value={selectedHub} onValueChange={setSelectedHub}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Filter by hub" /></SelectTrigger>
                <SelectContent>
                  {hubs.map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              {hubs.map(h => (
                <Card key={h.id} className="border-primary/20">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{h.title}</span>
                        <Badge>{h.category}</Badge>
                        {h.is_published && <Badge variant="secondary">Published</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">/learn/{h.slug}</p>
                    </div>
                    <Link to={`/learn/${h.slug}`} target="_blank">
                      <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedHub && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Spoke Pages</h3>
                <div className="grid gap-2">
                  {spokes.map(s => (
                    <Card key={s.id}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{s.title}</span>
                            <Badge variant="outline">{s.page_type}</Badge>
                            {s.is_ai_generated && <Badge variant="secondary">AI</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">/learn/{s.slug}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => togglePublish(s.id, s.is_published)}>
                            {s.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Link to={`/learn/${s.slug}`} target="_blank">
                            <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          </Link>
                          <Button size="sm" variant="ghost" onClick={() => deleteSpoke(s.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {spokes.length === 0 && <p className="text-sm text-muted-foreground">No spoke pages yet. Generate some!</p>}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="queue" className="space-y-4 mt-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Add to Generation Queue</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={queueHubId} onValueChange={setQueueHubId}>
                  <SelectTrigger><SelectValue placeholder="Select hub" /></SelectTrigger>
                  <SelectContent>
                    {hubs.map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Topic" value={queueTopic} onChange={e => setQueueTopic(e.target.value)} />
                <Input placeholder="Question (optional)" value={queueQuestion} onChange={e => setQueueQuestion(e.target.value)} />
                <Button onClick={addToQueue} disabled={!queueHubId || !queueTopic}><Plus className="h-4 w-4 mr-2" />Add to Queue</Button>
              </CardContent>
            </Card>

            <div className="grid gap-2">
              {queue.map(q => (
                <Card key={q.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{q.topic}</p>
                      {q.question && <p className="text-xs text-muted-foreground">Q: {q.question}</p>}
                      {q.error_message && <p className="text-xs text-destructive">{q.error_message}</p>}
                    </div>
                    <Badge variant={q.status === "completed" ? "default" : q.status === "failed" ? "destructive" : "secondary"}>
                      {q.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
