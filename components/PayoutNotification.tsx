import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface FirmData {
    name: string;
    favicon: string;
}

interface ChallengeData {
    id: string;
    accountSize: string; // "10K", "10,000", etc.
    price: number | string;
    firmId: string;
    firms: FirmData; // specific to the join query structure
}

type NotificationType = 'payout' | 'discount';

interface Notification {
    type: NotificationType;
    firm: { name: string; favicon: string };
    accountSize: string;
    currency: string;
    amount: string;
    discountCode?: string;
    savedAmount?: string;
    wasPrice?: string; // For discount display context if needed, though mostly calculating savedAmount
}

const PayoutNotification: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [challenges, setChallenges] = useState<ChallengeData[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);

    // Fetch active challenges + firms
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // Fetch challenges where related firm is active
                // Note: 'firms!inner' ensures we only get challenges that have a matching active firm
                const { data, error } = await supabase
                    .from('challenges')
                    .select('id, accountSize:account_size, price, firms!inner(name, favicon)')
                    .eq('firms.status', 'active');

                if (error) {
                    console.error('Error fetching challenges for popup:', error);
                    return;
                }

                if (data && data.length > 0) {
                    // Filter out any missing data just in case
                    const validChallenges = data.filter((c: any) =>
                        c.accountSize &&
                        c.price &&
                        c.firms &&
                        c.firms.name &&
                        c.firms.favicon
                    );
                    console.log('Loaded active challenges for popup:', validChallenges.length);
                    setChallenges(validChallenges);
                }
            } catch (err) {
                console.error('Failed to fetch challenges:', err);
            }
        };

        fetchChallenges();
    }, []);

    // Helper to parse "100K", "50,000", "200000" into a number
    const parseAccountSize = (sizeStr: string): number => {
        if (!sizeStr) return 0;
        const s = sizeStr.toUpperCase().replace(/,/g, '');
        if (s.includes('K')) {
            return parseFloat(s.replace('K', '')) * 1000;
        }
        if (s.includes('M')) {
            return parseFloat(s.replace('M', '')) * 1000000;
        }
        return parseFloat(s) || 0;
    };

    const parsePrice = (priceVal: string | number): number => {
        if (typeof priceVal === 'number') return priceVal;
        return parseFloat(priceVal.toString().replace(/[^0-9.]/g, '')) || 0;
    };

    const generateRandomNotification = (availableChallenges: ChallengeData[]): Notification | null => {
        if (availableChallenges.length === 0) return null;

        const challenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
        const firm = challenge.firms;

        // 50/50 chance for payout vs discount? Or keep 65/35?
        // User didn't specify ratio, keeping previous logic slightly adjusted or 50/50.
        // Let's do 50/50 for variety.
        const type: NotificationType = Math.random() > 0.5 ? 'discount' : 'payout';

        // Common Data
        const accountSizeNum = parseAccountSize(challenge.accountSize);
        // Standardize account size display (e.g. ensure K format or comma)
        // We'll just use the string from DB for display to match what they sell, e.g. "100K"
        const accountSizeDisplay = challenge.accountSize;

        if (type === 'payout') {
            // Logic: 1% to 20% of account size
            // If account size parsing fails (0), fallback to a safe random range or skip
            const baseSize = accountSizeNum > 0 ? accountSizeNum : 10000;
            const pct = (Math.random() * 0.19) + 0.01; // 0.01 to 0.20
            const payoutVal = Math.floor(baseSize * pct);

            return {
                type,
                firm,
                accountSize: accountSizeDisplay,
                currency: '$', // Defaulting to $ since DB price usually doesn't have currency code column easily accessible without more logic, safe bet for prop firms
                amount: payoutVal.toLocaleString(),
            };
        } else {
            // Discount Logic
            // Code: SPOT
            // Real Price = challenge.price
            // "Was" Price (implied) = Real Price / 0.8
            // Saved = Was - Real
            const realPrice = parsePrice(challenge.price);
            if (realPrice <= 0) {
                // Fallback if price missing
                return {
                    type,
                    firm,
                    accountSize: accountSizeDisplay,
                    currency: '$',
                    amount: '',
                    discountCode: 'SPOT',
                    savedAmount: '20'
                };
            }

            const wasPrice = realPrice / 0.8;
            const saved = Math.floor(wasPrice - realPrice);

            return {
                type,
                firm,
                accountSize: accountSizeDisplay,
                currency: '$',
                amount: '',
                discountCode: 'SPOT', // HARDCODED
                savedAmount: saved.toLocaleString(),
            };
        }
    };

    useEffect(() => {
        // Initial setup once challenges load
        if (challenges.length > 0 && !notification) {
            const notif = generateRandomNotification(challenges);
            if (notif) setNotification(notif);
        }
    }, [challenges]);

    useEffect(() => {
        if (challenges.length === 0) return;

        const initialDelay = Math.random() * 5000 + 5000;

        const showNotification = () => {
            const notif = generateRandomNotification(challenges);
            if (notif) {
                setNotification(notif);
                setIsVisible(true);

                setTimeout(() => {
                    setIsVisible(false);
                }, 5000);
            }
        };

        const initialTimer = setTimeout(showNotification, initialDelay);

        const interval = setInterval(() => {
            showNotification();
        }, Math.random() * 15000 + 15000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [challenges]);

    if (!notification) return null;

    return (
        <div
            className={`fixed bottom-6 left-6 z-50 max-w-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible
                ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
                : '-translate-x-8 translate-y-4 opacity-0 scale-95 pointer-events-none'
                }`}
        >
            {/* Main card with gold border glow */}
            <div className="relative bg-brand-charcoal backdrop-blur-xl rounded-xl border border-brand-gold/50 shadow-[0_0_20px_-5px_rgba(246,174,19,0.4)] overflow-hidden">

                {/* Close button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-brand-muted hover:text-white transition-all duration-300 hover:rotate-90 z-10"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex items-center p-4">
                    {/* Favicon container - Bigger, no full-height bg */}
                    <div className="flex-shrink-0 mr-4">
                        <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center border border-purple-500/40 p-2 shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]">
                            <img
                                src={notification.firm.favicon}
                                alt={notification.firm.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/000000/F6AE13?text=' + notification.firm.name.charAt(0);
                                }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-4">
                        {notification.type === 'payout' ? (
                            <p className="text-white text-[15px] leading-relaxed">
                                A trader just received a{' '}
                                <span className="text-green-400 font-bold">
                                    {notification.currency}{notification.amount}
                                </span>{' '}
                                payout from{' '}
                                <span className="text-white font-bold">{notification.firm.name}</span>{' '}
                                with a{' '}
                                <span className="text-brand-gold font-bold underline underline-offset-2">
                                    {notification.accountSize}
                                </span>{' '}
                                account!
                            </p>
                        ) : (
                            <p className="text-white text-[15px] leading-relaxed">
                                A trader just purchased a{' '}
                                <span className="text-brand-gold font-bold underline underline-offset-2">
                                    {notification.accountSize}
                                </span>{' '}
                                challenge from{' '}
                                <span className="text-white font-bold">{notification.firm.name}</span>{' '}
                                and saved{' '}
                                <span className="text-green-400 font-bold">
                                    ${notification.savedAmount}
                                </span>{' '}
                                using the code{' '}
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 font-bold text-sm border border-pink-500/30 ml-1">
                                    {notification.discountCode}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutNotification;
