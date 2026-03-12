import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import BrowseFirmsPage from './pages/BrowseFirmsPage';
import FirmDetailPage from './pages/FirmDetailPage';
import ComparePage from './pages/ComparePage';
import OffersPage from './pages/OffersPage';
import UserDashboard from './pages/UserDashboard';
import CompetitionsPage from './pages/CompetitionsPage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RiskDisclosurePage from './pages/RiskDisclosurePage';
import SpotAIPage from './pages/SpotAIPage';
import SpotReplayDashboard from './pages/SpotReplayDashboard';
import ReplaySessionPage from './pages/ReplaySessionPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFirmsPage from './pages/admin/AdminFirmsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminBadgesPage from './pages/admin/AdminBadgesPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRewardsPage from './pages/admin/AdminRewardsPage';
import AdminCompetitionsPage from './pages/admin/AdminCompetitionsPage';
import AdminMarketingPage from './pages/admin/AdminMarketingPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import { ComparisonProvider } from './context/ComparisonContext';
import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';
import ComparisonFloatingBar from './components/ComparisonFloatingBar';
import PayoutNotification from './components/PayoutNotification';



// ScrollToTop Component - Scrolls to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'admin' | 'user' }> = ({ children, role }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && !isAdmin) {
    // Redirect non-admins to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main Layout Component (Requires Router Context)
const MainLayout = () => {
  const location = useLocation();
  const isOffersPage = location.pathname === '/offers';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isReplaySessionPage = location.pathname.startsWith('/session/');

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans text-white selection:bg-brand-500 selection:text-white">
      <ScrollToTop />
      {!isAdminPage && !isAuthPage && !isReplaySessionPage && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/firms" element={<BrowseFirmsPage />} />
          <Route path="/firm/:id" element={<FirmDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/competition/:id" element={<CompetitionDetailPage />} />
          <Route path="/offers" element={<OffersPage />} />

          {/* Info Pages */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/risk" element={<RiskDisclosurePage />} />
          <Route path="/spot-ai" element={<SpotAIPage />} />
          <Route path="/spot-replay" element={<SpotReplayDashboard />} />
          <Route path="/session/:sessionId" element={<ReplaySessionPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="firms" element={<AdminFirmsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
            <Route path="badges" element={<AdminBadgesPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="rewards" element={<AdminRewardsPage />} />
            <Route path="marketing" element={<AdminMarketingPage />} />
            <Route path="competitions" element={<AdminCompetitionsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Protected User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </main>

      {!isAdminPage && !isAuthPage && !isReplaySessionPage && <Footer />}

      {/* Global Comparison Floating Bar */}
      {!isAdminPage && !isReplaySessionPage && <ComparisonFloatingBar />}

      {/* Social Proof Payout Notifications */}
      {!isAdminPage && !isAuthPage && !isReplaySessionPage && <PayoutNotification />}

      {/* Global Welcome Popup - Excluded from Admin/Auth pages */}
      {/* Welcome Popup removed */}
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ModalProvider>
          <ComparisonProvider>
            <MainLayout />
            <GlobalModal />
          </ComparisonProvider>
        </ModalProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;