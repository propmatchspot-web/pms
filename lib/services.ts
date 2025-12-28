import { supabase } from './supabaseClient';
import { PropFirm, Challenge } from '../types';

// Helper to determine challenge type
const inferChallengeType = (name: string, dbType?: string): '1-Step' | '2-Step' | '3-Step' | 'Instant' => {
    if (dbType && ['1-Step', '2-Step', '3-Step', 'Instant'].includes(dbType)) return dbType as any;
    const lower = name.toLowerCase();
    if (lower.includes('instant') || lower.includes('hyper')) return 'Instant';
    if (lower.includes('3-step') || lower.includes('bootcamp')) return '3-Step';
    if (lower.includes('1-step') || lower.includes('one step') || lower.includes('stellar 1')) return '1-Step';
    return '2-Step'; // Default
};

// Helper to map DB columns to UI PropFirm type
const mapFirmFromDB = (dbFirm: any): PropFirm => {
    const challenges = dbFirm.challenges?.map(mapChallengeFromDB) || [];

    return {
        id: dbFirm.id,
        name: dbFirm.name,
        website: dbFirm.website,
        affiliateLink: dbFirm.affiliate_link,
        logo: dbFirm.logo_url || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo',
        rating: Number(dbFirm.rating) || 0,
        reviewCount: 0,
        trustScore: 90,
        maxFunding: 200000,
        profitSplit: dbFirm.profit_split || '80%',
        drawdown: '10%',
        price: 0,
        tags: [],
        description: dbFirm.description || 'No description available.',
        founded: parseInt(dbFirm.founded_year) || 2023,
        foundedYear: dbFirm.founded_year,
        hqLocation: dbFirm.hq_location,
        platforms: dbFirm.platforms || [],
        paymentMethods: dbFirm.payment_methods || [],
        status: dbFirm.status,
        challenges: challenges
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
