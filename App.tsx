import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import BrowseFirmsPage from './pages/BrowseFirmsPage';
import OffersPage from './pages/OffersPage';
import ComparePage from './pages/ComparePage';
import UserDashboard from './pages/UserDashboard';
import FirmDetailPage from './pages/FirmDetailPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFirmsPage from './pages/admin/AdminFirmsPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminBadgesPage from './pages/admin/AdminBadgesPage';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => window.location, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-gold selection:text-black">
            <Navbar />
            <LandingPage />
            <Footer />
          </div>
        } />
        <Route path="/firms" element={
          <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-gold selection:text-black">
            <Navbar />
            <BrowseFirmsPage />
            <Footer />
          </div>
        } />
        <Route path="/firm/:id" element={
          <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-gold selection:text-black">
            <Navbar />
            <FirmDetailPage />
            <Footer />
          </div>
        } />
        <Route path="/offers" element={
          <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-gold selection:text-black">
            <Navbar />
            <OffersPage />
            <Footer />
          </div>
        } />
        <Route path="/compare" element={
          <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-gold selection:text-black">
            <Navbar />
            <ComparePage />
            <Footer />
          </div>
        } />
        <Route path="/dashboard" element={
          <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-gold selection:text-black">
            <Navbar />
            <UserDashboard />
            <Footer />
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="firms" element={<AdminFirmsPage />} />
          <Route path="offers" element={<AdminOffersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="payouts" element={<AdminPayoutsPage />} />
          <Route path="badges" element={<AdminBadgesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;