import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, Stethoscope, MapPin, DollarSign, Phone, 
  Camera, Calendar, Upload, CheckCircle2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const specialties = [
  "Longevity Medicine",
  "Functional Medicine",
  "Anti-Aging Medicine",
  "Dermatology",
  "Nutrition & Dietetics",
  "Wellness Coaching",
  "Mental Health",
  "Integrative Health",
  "Sports Medicine",
  "Endocrinology",
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ApplyConsultant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  useSEOHead({
    title: "Apply as a Doctor or Health Consultant",
    description: "Join Youth & Soul as a licensed doctor, therapist, dietitian, or wellness consultant. Set your own rates and connect with health-conscious patients nationwide.",
    path: "/apply-consultant",
    keywords: "apply doctor telehealth, become a health consultant, longevity doctor jobs, telehealth practitioner",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    location: "",
    ratePer10Min: "",
    teleHealthNumber: "",
    bio: "",
    credentials: "",
    experience: "",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
  });

  const handleImageUpload = () => {
    const placeholderImages = [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    ];
    setProfileImage(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 48 hours.",
    });
    setIsSubmitting(false);
    navigate("/");
  };

  const isFormValid = formData.fullName && formData.specialty && formData.location && 
                      formData.ratePer10Min && formData.bio && profileImage;

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
            <Stethoscope className="w-4 h-4" />
            Join Our Expert Network
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Apply as Consultant</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect with thousands of health-conscious clients through our Tele-Health platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Profile Picture
              </CardTitle>
              <CardDescription>Upload a professional headshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                {profileImage ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Button type="button" variant="outline" onClick={handleImageUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  {profileImage ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Dr. Jane Smith" value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Select value={formData.specialty} onValueChange={(v) => setFormData({ ...formData, specialty: v })}>
                    <SelectTrigger><SelectValue placeholder="Select specialty" /></SelectTrigger>
                    <SelectContent>
                      {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location *
                  </Label>
                  <Input id="location" placeholder="Los Angeles, CA" value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teleHealthNumber" className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Tele-Health Number
                  </Label>
                  <Input id="teleHealthNumber" placeholder="+1 (555) 123-4567" value={formData.teleHealthNumber}
                    onChange={(e) => setFormData({ ...formData, teleHealthNumber: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratePer10Min" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Rate per 10 Minutes *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="ratePer10Min" type="number" step="0.01" min="0" placeholder="29.99" className="pl-9"
                    value={formData.ratePer10Min}
                    onChange={(e) => setFormData({ ...formData, ratePer10Min: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea id="bio" rows={4} placeholder="Tell clients about your expertise, approach, and what makes you unique..."
                  value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentials">Credentials & Certifications</Label>
                <Textarea id="credentials" rows={3} placeholder="Board certifications, degrees, licenses..."
                  value={formData.credentials} onChange={(e) => setFormData({ ...formData, credentials: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Availability Schedule
              </CardTitle>
              <CardDescription>Select the days and hours you're available for consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3 block">Available Days</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedDays.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={formData.startTime} onValueChange={(v) => setFormData({ ...formData, startTime: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select value={formData.endTime} onValueChange={(v) => setFormData({ ...formData, endTime: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" className="w-full" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />Submitting...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" />Submit Application</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By applying, you agree to our Consultant Terms and verify your professional credentials.
            </p>
          </div>
        </form>
      </main>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default ApplyConsultant;
