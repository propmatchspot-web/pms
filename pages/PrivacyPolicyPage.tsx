import React from 'react';
import { Lock } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
    const sections = [
        { title: '1. Information We Collect', content: 'We may collect the following types of information: (a) Personal Information you provide when creating an account, such as your name, email address, and password; (b) Usage Data automatically collected when you use the Platform, including IP address, browser type, device information, pages visited, and interaction patterns; (c) Cookies and similar tracking technologies to enhance your experience.' },
        { title: '2. How We Use Your Information', content: 'We use collected information to: (a) provide and maintain the Platform; (b) personalize your experience and show relevant firm comparisons; (c) send account-related notifications; (d) analyze usage patterns to improve our services; (e) detect and prevent fraudulent activity; (f) communicate about new features, offers, and updates (with your consent).' },
        { title: '3. Information Sharing', content: 'We do not sell your personal information. We may share information with: (a) service providers who assist in operating the Platform (hosting, analytics, email); (b) law enforcement when required by law; (c) business partners in anonymized, aggregated form. Affiliate links to prop trading firms may include tracking identifiers but do not share your personal data.' },
        { title: '4. Data Security', content: 'We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
        { title: '5. Your Rights', content: 'You have the right to: (a) access, update, or delete your personal information; (b) opt out of marketing communications; (c) request a copy of your data; (d) withdraw consent at any time. To exercise these rights, contact us at support@propmatchspot.com.' },
        { title: '6. Cookies', content: 'We use cookies and similar technologies to remember your preferences, understand how you interact with the Platform, and serve relevant content. You can control cookies through your browser settings, though disabling them may affect functionality.' },
        { title: '7. Third-Party Services', content: 'Our Platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.' },
        { title: '8. Children\'s Privacy', content: 'PropMatchSpot is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us immediately.' },
        { title: '9. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on the Platform or sending an email. Your continued use after changes constitutes acceptance.' },
        { title: '10. Contact', content: 'For questions about this Privacy Policy, please contact us at support@propmatchspot.com.' },
    ];

    return (
        <div className="min-h-screen bg-black pt-24">
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.06),transparent)]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6">
                        <Lock className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
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

export default PrivacyPolicyPage;
