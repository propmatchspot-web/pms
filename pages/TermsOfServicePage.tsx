import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
    const sections = [
        { title: '1. Acceptance of Terms', content: 'By accessing or using PropMatchSpot ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.' },
        { title: '2. Description of Service', content: 'PropMatchSpot is a comparison and informational platform that helps traders discover, compare, and evaluate proprietary trading firms. We aggregate publicly available data, user reviews, and exclusive discount offers. We are not a financial advisor, broker, or prop trading firm ourselves.' },
        { title: '3. User Accounts', content: 'Some features may require account registration. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.' },
        { title: '4. Acceptable Use', content: 'You agree not to: (a) use the Platform for any unlawful purpose; (b) attempt to gain unauthorized access to any part of the Platform; (c) submit false reviews or manipulate ratings; (d) scrape, crawl, or harvest data from the Platform without permission; (e) impersonate any person or entity.' },
        { title: '5. Disclaimer of Warranties', content: 'The Platform is provided "as is" and "as available." We make no warranties, express or implied, regarding the accuracy, completeness, or reliability of any information, reviews, or data presented. Trading involves significant risk, and past performance does not guarantee future results.' },
        { title: '6. Limitation of Liability', content: 'PropMatchSpot shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to financial losses from trading decisions made based on information found on our Platform.' },
        { title: '7. Third-Party Links & Offers', content: 'The Platform may contain links to third-party websites, including prop trading firms and their offers. We are not responsible for the content, accuracy, or practices of these third-party sites. Discount codes and offers are subject to the respective firm\'s terms and conditions.' },
        { title: '8. Intellectual Property', content: 'All content on PropMatchSpot, including text, graphics, logos, and software, is the property of PropMatchSpot or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.' },
        { title: '9. Termination', content: 'We reserve the right to suspend or terminate your access to the Platform at any time, for any reason, without notice. Upon termination, all provisions that should reasonably survive will remain in effect.' },
        { title: '10. Governing Law', content: 'These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where PropMatchSpot operates, without regard to its conflict of law provisions.' },
        { title: '11. Contact', content: 'For questions about these Terms, please contact us at support@propmatchspot.com.' },
    ];

    return (
        <div className="min-h-screen bg-black pt-24">
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.06),transparent)]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6">
                        <FileText className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-neutral-500 text-sm">Last updated: March 4, 2026</p>
                </div>
            </section>

            <section className="pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {sections.map((s, i) => (
                        <div key={i}>
                            <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
                            <p className="text-neutral-400 text-sm leading-relaxed">{s.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TermsOfServicePage;
