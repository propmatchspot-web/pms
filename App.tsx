import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import BrowseFirmsPage from './pages/BrowseFirmsPage';
import FirmDetailPage from './pages/FirmDetailPage';
import ComparePage from './pages/ComparePage';
import OffersPage from './pages/OffersPage';
import UserDashboard from './pages/UserDashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFirmsPage from './pages/admin/AdminFirmsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminBadgesPage from './pages/admin/AdminBadgesPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

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

function App() {
  const location = useLocation();
  const isOffersPage = location.pathname === '/offers';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 flex flex-col font-sans text-white selection:bg-brand-500 selection:text-white">
        {!isOffersPage && !isAdminPage && !isAuthPage && <Navbar />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/firms" element={<BrowseFirmsPage />} />
            <Route path="/firm/:id" element={<FirmDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/offers" element={<OffersPage />} />

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

        {!isOffersPage && !isAdminPage && !isAuthPage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;