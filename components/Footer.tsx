import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Mail, Phone } from 'lucide-react';

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark border-t border-neutral-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

          {/* Col 1: Brand (moved from 5th) */}
          <div>
            <img
              src="http://zainenterprisespakistan.com/wp-content/uploads/2025/12/Untitled-design-28-scaled.png"
              alt="Prop Match Spot"
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-neutral-500 text-xs leading-relaxed">
              The #1 destination for traders to compare, review, and find the best prop trading firms.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/firms" className="hover:text-brand-gold transition-colors">Browse Firms</Link></li>
              <li><Link to="/compare" className="hover:text-brand-gold transition-colors">Compare Tool</Link></li>
              <li><Link to="/offers" className="hover:text-brand-gold transition-colors">Offers & Coupons</Link></li>
              <li><Link to="/competitions" className="hover:text-brand-gold transition-colors">Competitions</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/risk" className="hover:text-brand-gold transition-colors">Risk Disclosure</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-gold shrink-0" />
                <a href="mailto:support@propmatchspot.com" className="hover:text-brand-gold transition-colors">support@propmatchspot.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-gold shrink-0" />
                <a href="tel:+918882511483" className="hover:text-brand-gold transition-colors">+91 88825 11483</a>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="https://x.com/propmatchspot" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-brand-gold hover:border-brand-gold/30 transition-all"><Twitter size={14} /></a>
              <a href="https://discord.gg/nByZq2uRs" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-brand-gold hover:border-brand-gold/30 transition-all"><DiscordIcon /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            © 2025 Prop Match Spot. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-neutral-600">
            <Link to="/privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
            <Link to="/risk" className="hover:text-neutral-400 transition-colors">Risk Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;