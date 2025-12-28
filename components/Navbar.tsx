import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Browse Firms', path: '/firms' },
    { name: 'Offers', path: '/offers' },
    { name: 'Compare', path: '/compare' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed z-50 transition-all duration-500 ease-in-out ${scrolled
      ? 'top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-7xl bg-[#181611]/80 backdrop-blur-xl border border-brand-border/50 rounded-2xl py-2 shadow-glow'
      : 'top-0 left-0 right-0 w-full bg-transparent py-6'
      }`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${scrolled ? 'max-w-full' : 'max-w-7xl'}`}>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="http://zainenterprisespakistan.com/wp-content/uploads/2025/12/Untitled-design-28-scaled.png"
              alt="Prop Match Spot"
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium px-5 py-2 rounded-full transition-all ${isActive(link.path)
                  ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4 group-focus-within:text-brand-gold transition-colors" />
              <input
                type="text"
                placeholder="Search firms..."
                className="bg-brand-border/50 border border-brand-border text-sm rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-brand-gold/50 focus:bg-brand-black text-white placeholder-brand-muted w-40 transition-all focus:w-60"
              />
            </div>

            {user ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" className="gap-2 bg-brand-gold/10 text-brand-gold border-brand-gold/20 hover:bg-brand-gold hover:text-black">
                  <User size={16} /> Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
                  Log In
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-brand-gold text-black hover:bg-white hover:text-black border-none shadow-glow">
                    Get Funded
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-black border-b border-brand-border">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-brand-muted hover:text-brand-gold hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-brand-border mt-4 space-y-3">
              {user ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center gap-2 bg-brand-gold text-black">
                    <User size={18} /> Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center border-brand-charcoal hover:bg-brand-charcoal">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center bg-brand-gold text-black border-none shadow-glow">
                      Get Funded
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;