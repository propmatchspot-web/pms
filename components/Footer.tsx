import React from 'react';
import { Twitter, Linkedin, Github, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark border-t border-neutral-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="http://zainenterprisespakistan.com/wp-content/uploads/2025/12/Untitled-design-28-scaled.png"
                alt="Prop Match Spot"
                className="h-24 w-auto object-contain"
              />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              The #1 destination for traders to compare, review, and find the best proprietary trading firms with verified payouts and exclusive deals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-500 hover:text-brand-gold transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-brand-gold transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-brand-gold transition-colors"><Github size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-brand-gold">Browse Firms</a></li>
              <li><a href="#" className="hover:text-brand-gold">Compare Tool</a></li>
              <li><a href="#" className="hover:text-brand-gold">Offers & Coupons</a></li>
              <li><a href="#" className="hover:text-brand-gold">Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-brand-gold">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-gold">Submit a Firm</a></li>
              <li><a href="#" className="hover:text-brand-gold">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-brand-gold">Report Scam</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-gold" />
                <span>support@propmatchspot.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-gold" />
                <span>+91 88825 11483</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            © 2024 Prop Match Spot. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-600">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;