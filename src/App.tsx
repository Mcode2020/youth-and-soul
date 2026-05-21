import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Goals from "./pages/Goals";
import ProductDetail from "./pages/ProductDetail";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import ListProduct from "./pages/ListProduct";
import SellerDashboard from "./pages/SellerDashboard";
import ApplyConsultant from "./pages/ApplyConsultant";
import UploadResults from "./pages/UploadResults";
import About from "./pages/About";
import Article from "./pages/Article";
import AllProducts from "./pages/AllProducts";
import WeightLoss from "./pages/WeightLoss";
import WeightLossGLP from "./pages/WeightLossGLP";
import GLPIntakeForm from "./pages/GLPIntakeForm";
import HairLossIntake from "./pages/HairLossIntake";
import ComingSoon from "./pages/ComingSoon";
import ApplyInfluencer from "./pages/ApplyInfluencer";
import HealthQuiz from "./pages/HealthQuiz";
import QuizResults from "./pages/QuizResults";
import ProgramDetail from "./pages/ProgramDetail";
import Enroll from "./pages/Enroll";
import EnrollSuccess from "./pages/EnrollSuccess";
import AdminPrograms from "./pages/AdminPrograms";
import AdminBrandDiscounts from "./pages/AdminBrandDiscounts";
import AdminSeoContent from "./pages/AdminSeoContent";
import AdminReviews from "./pages/AdminReviews";
import SeoPage from "./pages/SeoPage";
import Learn from "./pages/Learn";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import EarnAffiliate from "./pages/EarnAffiliate";
import SafetyInfoGLP1 from "./pages/SafetyInfoGLP1";
import InsuranceAccess from "./pages/InsuranceAccess";
import Checkout from "./pages/Checkout";
import CheckoutReturn from "./pages/CheckoutReturn";
import Peptides from "./pages/Peptides";
import Programs from "./pages/Programs";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const hideChat = location.pathname.includes("intake") || location.pathname === "/glp-weightloss" || location.pathname.startsWith("/enroll");

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/goals/:goalId" element={<Goals />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/products/featured" element={<AllProducts title="Featured Products" defaultOrderBy="views" />} />
        <Route path="/products/top-rated" element={<AllProducts title="Top Rated Products" defaultOrderBy="sales_count" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/list-product" element={<ListProduct />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/apply-consultant" element={<ApplyConsultant />} />
        <Route path="/upload-results" element={<UploadResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/earn-affiliate" element={<EarnAffiliate />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/weightloss" element={<WeightLoss />} />
        <Route path="/weightloss-glp" element={<WeightLossGLP />} />
        <Route path="/glp-weightloss" element={<GLPIntakeForm />} />
        <Route path="/weightloss-glp-intake" element={<GLPIntakeForm />} />
        <Route path="/hairloss-intake" element={<HairLossIntake />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/apply-influencer" element={<ApplyInfluencer />} />
        <Route path="/health-quiz/:area" element={<HealthQuiz />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/enroll/:slug/:tier" element={<Enroll />} />
        <Route path="/enroll-success/:slug" element={<EnrollSuccess />} />
        <Route path="/quiz-results/:area" element={<QuizResults />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/admin/brand-discounts" element={<AdminBrandDiscounts />} />
        <Route path="/admin/seo-content" element={<AdminSeoContent />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/learn/:slug" element={<SeoPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/safety-info/glp1" element={<SafetyInfoGLP1 />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/return" element={<CheckoutReturn />} />
        <Route path="/insurance-access" element={<InsuranceAccess />} />
        <Route path="/peptides" element={<Peptides />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChat && <LiveChatWidget />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
