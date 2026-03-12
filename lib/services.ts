import { supabase } from './supabaseClient';
import { PropFirm, Challenge } from '../types';

// Helper to determine challenge type - ALWAYS prioritizes explicit DB value
const inferChallengeType = (name: string, dbType?: string): '1-Step' | '2-Step' | '3-Step' | 'Instant' => {
    // ALWAYS use the explicit database value first if it exists
    if (dbType && dbType.trim() !== '') {
        console.log('[ChallengeType] Using DB value:', dbType);
        // Normalize common formats
        if (dbType === '1-Step' || dbType === '1Step' || dbType === '1 Step') return '1-Step';
        if (dbType === '2-Step' || dbType === '2Step' || dbType === '2 Step') return '2-Step';
        if (dbType === '3-Step' || dbType === '3Step' || dbType === '3 Step') return '3-Step';
        if (dbType === 'Instant' || dbType.toLowerCase() === 'instant') return 'Instant';
        // If it's any other value, try to match
        if (dbType.includes('1')) return '1-Step';
        if (dbType.includes('3')) return '3-Step';
        // Return as-is if valid format
        if (['1-Step', '2-Step', '3-Step', 'Instant'].includes(dbType)) return dbType as any;
    }
    // Fallback to inference from name only if NO db value
    console.log('[ChallengeType] Inferring from name:', name);
    const lower = name.toLowerCase();
    if (lower.includes('instant') || lower.includes('hyper')) return 'Instant';
    if (lower.includes('3-step') || lower.includes('3 step') || lower.includes('bootcamp')) return '3-Step';
    if (lower.includes('1-step') || lower.includes('1 step') || lower.includes('one step') || lower.includes('stellar 1')) return '1-Step';
    return '2-Step'; // Default fallback
};

// Helper to map DB columns to UI PropFirm type
export const mapFirmFromDB = (dbFirm: any): PropFirm => {
    const challenges = dbFirm.challenges?.map(mapChallengeFromDB) || [];

    // Parse max_funding - it's stored as text like "$400,000" or "400k"
    const maxFundingStr = dbFirm.max_funding || '200000';
    let maxFundingNum = parseInt(maxFundingStr.replace(/[$,]/g, '')) || 200000;
    // If it ends with 'k', multiply by 1000
    if (maxFundingStr.toLowerCase().includes('k')) {
        maxFundingNum = parseInt(maxFundingStr.replace(/[$,k]/gi, '')) * 1000 || 200000;
    }

    return {
        id: dbFirm.id,
        name: dbFirm.name,
        website: dbFirm.website || dbFirm.website_url,
        websiteUrl: dbFirm.website_url || dbFirm.website,
        affiliateLink: dbFirm.affiliate_link,
        discountCode: dbFirm.discount_code || '',
        logo: dbFirm.logo_url || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo',
        favicon: dbFirm.favicon || null,
        rating: Number(dbFirm.rating) || 4.5,
        reviewCount: Number(dbFirm.review_count) || 0,
        trustScore: Number(dbFirm.trust_score) || 95,
        maxFunding: maxFundingNum,
        profitSplit: dbFirm.profit_split || '80 - 90%',
        drawdown: dbFirm.drawdown || '10%',
        price: 0,
        tags: dbFirm.tags || dbFirm.platforms || [],
        description: dbFirm.description || 'No description available.',
        founded: parseInt(dbFirm.founded_year) || 2023,
        foundedYear: dbFirm.founded_year,
        hqLocation: dbFirm.hq_location,
        platforms: dbFirm.platforms || [],
        paymentMethods: dbFirm.payment_methods || [],
        status: dbFirm.status,
        challenges: challenges,
        // Trading Specs - REAL values from database
        leverage: dbFirm.leverage || '1:100',
        newsTrading: dbFirm.news_trading || false,
        weekendHolding: dbFirm.weekend_holding || false,
        scalingPlan: dbFirm.scaling_plan !== false, // Default to true if null/undefined, or strictly boolean
        scalingPlanDetails: dbFirm.scaling_plan_details || 'Yes (every 3 months)',
        // Payout Stats
        avgPayoutTime: dbFirm.avg_payout_time || '12 Hours',
        payoutPercentage: dbFirm.payout_percentage || 95,
        last30DaysPayouts: dbFirm.last_30_days_payouts || '$0',
        payoutGrowth: dbFirm.payout_growth || '0%',
    };
};

const mapChallengeFromDB = (dbChallenge: any): Challenge => {
    return {
        id: dbChallenge.id,
        firmId: dbChallenge.firm_id,
        name: dbChallenge.name,
        accountSize: dbChallenge.account_size,
        price: dbChallenge.price,
        profitTarget: dbChallenge.profit_target,
        dailyDrawdown: dbChallenge.daily_drawdown,
        maxDrawdown: dbChallenge.max_drawdown,
        minTradingDays: dbChallenge.min_trading_days,
        maxLeverage: dbChallenge.max_leverage,
        challengeType: inferChallengeType(dbChallenge.name, dbChallenge.challenge_type)
    };
};

export const FirmService = {
    // Fetch all ACTIVE firms for Browse Page
    async getActiveFirms(): Promise<PropFirm[]> {
        const { data, error } = await supabase
            .from('firms')
            .select('*, challenges(*)')
            .eq('status', 'active')
            .order('rating', { ascending: false });

        if (error) {
            console.error('Error fetching active firms:', error);
            return [];
        }

        return data.map(mapFirmFromDB);
    },

    async trackClick(firmId: string, source: string) {
        try {
            const { data: session } = await supabase.auth.getSession();
            await supabase.from('clicks').insert({
                firm_id: firmId,
                page_source: source,
                user_id: session.session?.user?.id || null
            });
        } catch (err) {
            console.error('Failed to track click', err);
            // Silently fail to not disrupt user flow
        }
    },

    // Fetch single firm with full details + challenges
    async getFirmDetails(id: string): Promise<PropFirm | null> {
        const { data: firm, error: firmError } = await supabase
            .from('firms')
            .select('*')
            .eq('id', id)
            .single();

        if (firmError || !firm) {
            console.error('Error fetching firm details:', firmError);
            return null;
        }

        const { data: challenges, error: challengeError } = await supabase
            .from('challenges')
            .select('*')
            .eq('firm_id', id)
            .order('created_at', { ascending: true }); // Maybe order by price later?

        if (challengeError) {
            console.error('Error fetching challenges:', challengeError);
        }

        const mappedFirm = mapFirmFromDB(firm);
        mappedFirm.challenges = challenges?.map(mapChallengeFromDB) || [];

        // Update derived fields from challenges if available
        if (mappedFirm.challenges.length > 0) {
            // Example: Set Generic Drawdown from first challenge
            mappedFirm.drawdown = mappedFirm.challenges[0].maxDrawdown || '10%';
        }

        return mappedFirm;
    }
};
