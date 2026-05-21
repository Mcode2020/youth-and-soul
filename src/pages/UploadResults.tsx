import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, Upload, Camera, Video, Image as ImageIcon, 
  Plus, X, CheckCircle2, Sparkles, Clock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const goals = [
  "Anti-Aging", "Skin Radiance", "Energy & Vitality", 
  "Recovery & Inflammation", "Weight Management", "Hair Growth",
  "Wrinkles & Fine Lines", "Brain Health"
];

const durations = ["2 weeks", "4 weeks", "6 weeks", "8 weeks", "12 weeks", "6 months", "1 year+"];

const UploadResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  useSEOHead({
    title: "Share Your Results",
    description: "Submit your before/after results and reviews to inspire the Youth & Soul community.",
    path: "/upload-results",
    noIndex: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    productName: "",
    goal: "",
    duration: "",
    description: "",
    age: "",
  });

  const handleBeforeUpload = () => {
    setBeforeImage("https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80");
  };

  const handleAfterUpload = () => {
    setAfterImage("https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80");
  };

  const handleVideoUpload = () => {
    setVideoUrl("https://example.com/video-placeholder.mp4");
    toast({ title: "Video uploaded!", description: "Your video review has been uploaded successfully." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Results Submitted!",
      description: "Your transformation is now under review. It will be visible to the community once approved.",
    });
    setIsSubmitting(false);
    navigate("/");
  };

  const isFormValid = formData.productName && formData.goal && formData.description && 
                      (beforeImage || videoUrl);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Share Your Journey
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Results</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Share your before & after photos and video reviews to inspire the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Before & After Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Before & After Photos
              </CardTitle>
              <CardDescription>Upload your transformation photos side by side</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                <div>
                  <Label className="mb-2 block text-center">Before</Label>
                  {beforeImage ? (
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-border group">
                      <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setBeforeImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-medium bg-foreground/80 text-background rounded-md">Before</span>
                    </div>
                  ) : (
                    <button type="button" onClick={handleBeforeUpload}
                      className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add Before Photo</span>
                    </button>
                  )}
                </div>

                {/* After */}
                <div>
                  <Label className="mb-2 block text-center">After</Label>
                  {afterImage ? (
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary/30 group">
                      <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setAfterImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-md">After</span>
                    </div>
                  ) : (
                    <button type="button" onClick={handleAfterUpload}
                      className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add After Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Video Review (Optional)
              </CardTitle>
              <CardDescription>Record or upload a video sharing your experience</CardDescription>
            </CardHeader>
            <CardContent>
              {videoUrl ? (
                <div className="relative p-4 bg-muted/50 rounded-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Video uploaded</p>
                    <p className="text-xs text-muted-foreground">Ready for review</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setVideoUrl(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <button type="button" onClick={handleVideoUpload}
                  className="w-full p-8 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Upload Video Review</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4, MOV up to 100MB</p>
                  </div>
                </button>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Used *</Label>
                  <Input id="productName" placeholder="e.g., Advanced NMN Complex 500mg"
                    value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Input id="age" type="number" placeholder="e.g., 45"
                    value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Goal *</Label>
                  <Select value={formData.goal} onValueChange={(v) => setFormData({ ...formData, goal: v })}>
                    <SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger>
                    <SelectContent>
                      {goals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                    <SelectTrigger><SelectValue placeholder="How long did you use it?" /></SelectTrigger>
                    <SelectContent>
                      {durations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Your Experience *</Label>
                <Textarea id="description" rows={4} placeholder="Describe your results and how the product worked for you..."
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" className="w-full" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />Submitting...</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />Submit Your Results</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Submissions are reviewed before being published. By submitting, you confirm these are your real results.
            </p>
          </div>
        </form>
      </main>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default UploadResults;
