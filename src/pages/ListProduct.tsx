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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Plus, 
  X, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  FileText, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Supplements",
  "Peptides",
  "Skincare",
  "Devices",
  "Testing Kits",
  "Fitness Equipment",
  "Nutrition",
  "Sleep & Recovery",
  "Biohacking Tools",
  "DIY Tools"
];

const goals = [
  "Anti-Aging",
  "Energy & Focus",
  "Sleep Optimization",
  "Immune Support",
  "Gut Health",
  "Skin Health",
  "Brain Health",
  "Fitness & Recovery"
];

const ListProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  useSEOHead({
    title: "List Your Product on Youth & Soul",
    description: "Sell your health, longevity, supplement, peptide, or skincare products on the Youth & Soul marketplace. US-based brands only. GMP/NSF/3rd-party tested.",
    path: "/list-product",
    keywords: "sell supplements online, list health product, supplement marketplace, longevity brand seller",
  });
  const [images, setImages] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    keyIngredients: "",
    benefits: "",
    usage: ""
  });

  const handleImageUpload = () => {
    // Simulate image upload - in production this would use Supabase Storage
    const placeholderImages = [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=400"
    ];
    if (images.length < 5) {
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setImages([...images, randomImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else if (selectedGoals.length < 4) {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Product Submitted!",
      description: "Your product is now under review. We'll notify you within 24-48 hours.",
    });
    
    setIsSubmitting(false);
    navigate("/");
  };

  const isFormValid = formData.name && formData.brand && formData.category && 
                      formData.price && formData.description && images.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Reach millions of wellness seekers
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">List Your Product</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join trusted brands on the #1 longevity marketplace. We charge 15% commission only when you make a sale.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">No Upfront Fees</h3>
              <p className="text-xs text-muted-foreground">15% commission deducted only when your products sell</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">AI-Powered Discovery</h3>
              <p className="text-xs text-muted-foreground">Get matched to buyer intent</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Featured Placements</h3>
              <p className="text-xs text-muted-foreground">Boost visibility with ads</p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Product Images
              </CardTitle>
              <CardDescription>Upload up to 5 high-quality images. First image will be the main display.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border group">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </button>
                )}
              </div>
              {images.length === 0 && (
                <div className="flex items-center gap-2 mt-3 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  At least one image is required
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Advanced Collagen Complex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand Name *</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., VitalLife Labs"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product, its unique benefits, and why customers will love it..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing
              </CardTitle>
              <CardDescription>Set competitive pricing. You keep 85% of each sale.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Sale Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="49.99"
                      className="pl-9"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="69.99"
                      className="pl-9"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Show as strikethrough price if higher than sale price</p>
                </div>
              </div>
              
              {formData.price && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your earnings per sale:</span>
                    <span className="font-semibold text-primary">${(parseFloat(formData.price) * 0.85).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals Targeting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Target Goals
              </CardTitle>
              <CardDescription>Select up to 4 wellness goals your product helps with. This improves AI matching.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedGoals.includes(goal)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {selectedGoals.length}/4 goals selected
              </p>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Product Details (Optional)
              </CardTitle>
              <CardDescription>Add more details to help customers make informed decisions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyIngredients">Key Ingredients</Label>
                <Textarea
                  id="keyIngredients"
                  placeholder="List active ingredients and their benefits..."
                  rows={3}
                  value={formData.keyIngredients}
                  onChange={(e) => setFormData({ ...formData, keyIngredients: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  placeholder="What results can customers expect?"
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage">Usage Instructions</Label>
                <Textarea
                  id="usage"
                  placeholder="How should customers use this product?"
                  rows={3}
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit for Review
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to our Seller Terms and confirm you have rights to sell this product.
            </p>
          </div>
        </form>
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default ListProduct;
