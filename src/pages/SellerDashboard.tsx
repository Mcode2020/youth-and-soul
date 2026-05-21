import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  DollarSign, 
  Eye, 
  ShoppingCart, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { ProductRow } from "@/components/seller/ProductRow";
import { supabase } from "@/integrations/supabase/client";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { products, stats, loading, updateProductStatus, deleteProduct, isAuthenticated } = useSellerProducts();
  useSEOHead({
    title: "Seller Dashboard",
    description: "Manage your Youth & Soul marketplace listings, track sales, views, and revenue.",
    path: "/seller-dashboard",
    noIndex: true,
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCheckingAuth(false);
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your seller dashboard.
            </p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Seller Dashboard" }]} />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your products and track your earnings
            </p>
          </div>
          <Button onClick={() => navigate("/list-product")} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeProducts}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    ${(stats.totalRevenue * 0.85).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                  <p className="text-3xl font-bold">{stats.totalSales}</p>
                  <p className="text-xs text-primary mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    15% commission to platform
                  </p>
                </div>
                <ShoppingCart className="w-12 h-12 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pendingProducts}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Usually approved within 24-48h
                  </p>
                </div>
                <Clock className="w-12 h-12 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold">
                    {stats.totalViews > 0 
                      ? ((stats.totalSales / stats.totalViews) * 100).toFixed(1) 
                      : "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Views to sales
                  </p>
                </div>
                <BarChart3 className="w-12 h-12 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({products.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({products.filter(p => p.status === "approved").length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({products.filter(p => p.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Paused ({products.filter(p => p.status === "paused").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Your Products</CardTitle>
                <CardDescription>Manage all your listed products</CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No products yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Start selling by listing your first product
                    </p>
                    <Button onClick={() => navigate("/list-product")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                ) : (
                  products.map(product => (
                    <ProductRow 
                      key={product.id} 
                      product={product}
                      onToggleStatus={updateProductStatus}
                      onDelete={deleteProduct}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent className="p-0">
                {products.filter(p => p.status === "approved").length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No active products
                  </div>
                ) : (
                  products
                    .filter(p => p.status === "approved")
                    .map(product => (
                      <ProductRow 
                        key={product.id} 
                        product={product}
                        onToggleStatus={updateProductStatus}
                        onDelete={deleteProduct}
                      />
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                {products.filter(p => p.status === "pending").length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No pending products
                  </div>
                ) : (
                  products
                    .filter(p => p.status === "pending")
                    .map(product => (
                      <ProductRow 
                        key={product.id} 
                        product={product}
                        onToggleStatus={updateProductStatus}
                        onDelete={deleteProduct}
                      />
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paused">
            <Card>
              <CardContent className="p-0">
                {products.filter(p => p.status === "paused").length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No paused products
                  </div>
                ) : (
                  products
                    .filter(p => p.status === "paused")
                    .map(product => (
                      <ProductRow 
                        key={product.id} 
                        product={product}
                        onToggleStatus={updateProductStatus}
                        onDelete={deleteProduct}
                      />
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default SellerDashboard;
