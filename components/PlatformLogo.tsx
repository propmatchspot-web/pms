import React from 'react';

type PlatformName = 'MT4' | 'MT5' | 'cTrader' | 'MatchTrader' | 'DXTrade' | 'TradeLocker' | 'NinjaTrader' | string;

interface PlatformLogoProps {
    platform: PlatformName;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showName?: boolean; // Option to show name next to logo
}

const PlatformLogo: React.FC<PlatformLogoProps> = ({
    platform,
    size = 'md',
    className = '',
    showName = false
}) => {
    // Normalize platform name
    const p = platform.toLowerCase().replace(/ /g, '');

    // Size classes
    const sizeClasses = {
        sm: 'h-4 w-auto',
        md: 'h-6 w-auto',
        lg: 'h-8 w-auto'
    };

    // Define logo assets (using public URLs or inline SVGs)
    // For this implementation, I will use high-quality SVGs where possible or fallback to text if unknown

    // User requested to revert to text labels.
    // The safest and most consistent way is to just render the styled badge.

    return (
        <span className={`inline-flex items-center rounded-md bg-brand-border px-2 py-1 text-xs font-bold text-white uppercase ${className}`}>
            {platform}
        </span>
    );
};

export default PlatformLogo;
