import React from 'react';
import { AlertTriangle } from 'lucide-react';

const RiskDisclosurePage: React.FC = () => {
    const sections = [
        { title: '1. General Risk Warning', content: 'Trading financial instruments, including forex, CFDs, futures, and other derivatives, carries a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite before making any trading decisions. You could lose some or all of your initial investment.' },
        { title: '2. Prop Firm Risks', content: 'Proprietary trading firm challenges and funded accounts involve financial risk. There is no guarantee that you will pass any evaluation, receive a funded account, or receive payouts. Rules, profit splits, and payout policies vary between firms and may change without notice. PropMatchSpot does not guarantee the performance, reliability, or legitimacy of any listed prop firm.' },
        { title: '3. No Financial Advice', content: 'PropMatchSpot is an informational and comparison platform only. Nothing on this Platform constitutes financial advice, investment advice, trading advice, or any other form of professional advice. All information is provided for educational and comparison purposes. You should consult with a qualified financial advisor before making any financial decisions.' },
        { title: '4. Accuracy of Information', content: 'While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of any data, reviews, ratings, or TrustGuard™ scores presented on the Platform. Prop firm rules, pricing, and policies may change at any time. Always verify information directly with the firm before purchasing.' },
        { title: '5. Third-Party Disclaimer', content: 'PropMatchSpot is not affiliated with, endorsed by, or sponsored by any prop trading firm unless explicitly stated. Links, discount codes, and offers are provided for convenience. We may earn affiliate commissions from some firms, which does not affect our ratings or reviews. Affiliate relationships are clearly disclosed.' },
        { title: '6. Past Performance', content: 'Past performance, whether of individual traders, prop firms, or strategies mentioned on the Platform, is not indicative of future results. Any testimonials or case studies shown represent individual experiences and should not be considered typical results.' },
        { title: '7. User Responsibility', content: 'You are solely responsible for your trading decisions and any resulting financial outcomes. PropMatchSpot shall not be liable for any losses, damages, or costs arising from your use of the Platform or your reliance on any information provided herein.' },
        { title: '8. Regulatory Notice', content: 'PropMatchSpot does not provide regulated financial services. Trading regulations vary by jurisdiction. It is your responsibility to ensure that your trading activities comply with the laws and regulations of your country of residence.' },
        { title: '9. Contact', content: 'If you have any questions about this Risk Disclosure, please contact us at support@propmatchspot.com.' },
    ];

    return (
        <div className="min-h-screen bg-black pt-24">
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.06),transparent)]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6">
                        <AlertTriangle className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Risk Disclosure</h1>
                    <p className="text-neutral-500 text-sm">Last updated: March 4, 2026</p>
                </div>
            </section>

            <section className="pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-10">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-400/80 text-sm leading-relaxed">
                                <strong>Important:</strong> Trading involves substantial risk of loss. The information provided on PropMatchSpot is for comparison and educational purposes only and should not be construed as financial advice. Please read this entire disclosure carefully.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {sections.map((s, i) => (
                            <div key={i}>
                                <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
                                <p className="text-neutral-400 text-sm leading-relaxed">{s.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RiskDisclosurePage;
