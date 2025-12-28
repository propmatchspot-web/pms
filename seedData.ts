
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials from vite.config.ts to ensure it works immediately
const SUPABASE_URL = 'https://bolltbelnkxrosiudosi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGx0YmVsbmt4cm9zaXVkb3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTIxNDYsImV4cCI6MjA4MjI4ODE0Nn0.z8qyPf9engFTRQ4McZQldcyuI-0Ie7vPS4JnBVbWXj8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MOCK_FIRMS = [
    {
        name: 'Alpha Capital',
        website: 'https://alphacapitalgroup.uk',
        affiliate_link: 'https://alphacapitalgroup.uk/?ref=propmatch',
        logo_url: 'https://alphacapitalgroup.uk/static/media/companyLogoInitials.879d8bbc8b528b1fd27761f4e43c34a0.svg',
        rating: 4.8,
        status: 'active',
        description: 'Leading industry prop firm with instant funding options and high trust score.',
        founded_year: '2021',
        hq_location: 'London, UK',
        profit_split: '80% - 90%',
        platforms: ['MT4', 'MT5', 'cTrader'],
        challenges: [
            { name: 'Standard', account_size: '$10,000', price: '$97', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' },
            { name: 'Standard', account_size: '$25,000', price: '$197', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' },
            { name: 'Standard', account_size: '$50,000', price: '$297', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' },
            { name: 'Standard', account_size: '$100,000', price: '$497', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' }
        ]
    },
    {
        name: 'Blue Guardian',
        website: 'https://blueguardian.com',
        affiliate_link: 'https://blueguardian.com/?ref=propmatch',
        logo_url: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
        rating: 4.6,
        status: 'active',
        description: 'Guardian of your capital. Low spreads and high leverage accounts available.',
        founded_year: '2019',
        hq_location: 'Dubai, UAE',
        profit_split: '85%',
        platforms: ['MT4', 'MT5'],
        challenges: [
            { name: 'Unlimited', account_size: '$10,000', price: '$87', profit_target: '10%', daily_drawdown: '4%', max_drawdown: '8%', min_trading_days: '5' },
            { name: 'Unlimited', account_size: '$50,000', price: '$247', profit_target: '10%', daily_drawdown: '4%', max_drawdown: '8%', min_trading_days: '5' },
            { name: 'Unlimited', account_size: '$100,000', price: '$497', profit_target: '10%', daily_drawdown: '4%', max_drawdown: '8%', min_trading_days: '5' }
        ]
    },
    {
        name: 'FundedNext',
        website: 'https://fundednext.com',
        affiliate_link: 'https://fundednext.com/?ref=propmatch',
        logo_url: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundedNext_Logo_White_Christmas_2025.png&w=384&q=75',
        rating: 4.9,
        status: 'active',
        description: 'Get funded and paid within 24 hours. The fastest growing firm in 2024.',
        founded_year: '2022',
        hq_location: 'Dubai, UAE',
        profit_split: 'Up to 95%',
        platforms: ['MT4', 'MT5', 'TradeLocker'],
        challenges: [
            { name: 'Stellar', account_size: '$6,000', price: '$59', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' },
            { name: 'Stellar', account_size: '$15,000', price: '$119', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' },
            { name: 'Stellar', account_size: '$25,000', price: '$199', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' },
            { name: 'Stellar', account_size: '$50,000', price: '$299', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '0' }
        ]
    },
    {
        name: 'FundingPips',
        website: 'https://fundingpips.com',
        affiliate_link: 'https://fundingpips.com/?ref=propmatch',
        logo_url: 'https://www.fundingpips.com/_next/image?url=%2Fimgs%2Ffp-logo-xms.png&w=384&q=75&dpl=dpl_FYvbqGZXv69q1sK5yL6gLsnh7uSr',
        rating: 4.7,
        status: 'active',
        description: 'One of the most affordable options in the market with reliable payouts.',
        founded_year: '2022',
        hq_location: 'Dubai, UAE',
        profit_split: '80% - 90%',
        platforms: ['MT5', 'cTrader'],
        challenges: [
            { name: 'Evaluation', account_size: '$5,000', price: '$32', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '5' },
            { name: 'Evaluation', account_size: '$10,000', price: '$60', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '5' },
            { name: 'Evaluation', account_size: '$50,000', price: '$239', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '5' },
            { name: 'Evaluation', account_size: '$100,000', price: '$399', profit_target: '8%', daily_drawdown: '5%', max_drawdown: '10%', min_trading_days: '5' }
        ]
    },
    {
        name: 'The 5ers',
        website: 'https://the5ers.com',
        affiliate_link: 'https://the5ers.com/?ref=propmatch',
        logo_url: 'https://the5ers.com/wp-content/uploads/2025/09/5erslogo.svg',
        rating: 4.8,
        status: 'active',
        description: 'Unique instant funding model and high-stakes accounts for career traders.',
        founded_year: '2016',
        hq_location: 'Ra\'anana, Israel',
        profit_split: '50% - 100%',
        platforms: ['MT5'],
        challenges: [
            { name: 'Bootcamp', account_size: '$100,000', price: '$95', profit_target: '6%', daily_drawdown: 'None', max_drawdown: '5%', min_trading_days: '0' },
            { name: 'Hyper Growth', account_size: '$10,000', price: '$260', profit_target: '10%', daily_drawdown: '3%', max_drawdown: '6%', min_trading_days: '0' },
            { name: 'Hyper Growth', account_size: '$20,000', price: '$450', profit_target: '10%', daily_drawdown: '3%', max_drawdown: '6%', min_trading_days: '0' }
        ]
    }
];

async function seedData() {
    console.log('Seeding data...');

    for (const firm of MOCK_FIRMS) {
        console.log(`Inserting ${firm.name}...`);

        // 1. Insert Firm
        const { data: firmData, error: firmError } = await supabase
            .from('firms')
            .insert([{
                name: firm.name,
                website: firm.website,
                affiliate_link: firm.affiliate_link,
                logo_url: firm.logo_url,
                rating: firm.rating,
                status: firm.status,
                description: firm.description,
                founded_year: firm.founded_year,
                hq_location: firm.hq_location,
                profit_split: firm.profit_split,
                platforms: firm.platforms
            }])
            .select()
            .single();

        if (firmError) {
            console.error(`Error inserting ${firm.name}:`, firmError);
            continue;
        }

        if (!firmData) {
            console.error(`No data returned for ${firm.name}`);
            continue;
        }

        // 2. Insert Challenges
        if (firm.challenges.length > 0) {
            const challengesToInsert = firm.challenges.map(c => ({
                firm_id: firmData.id,
                ...c
            }));

            const { error: challengeError } = await supabase
                .from('challenges')
                .insert(challengesToInsert);

            if (challengeError) {
                console.error(`Error inserting challenges for ${firm.name}:`, challengeError);
            } else {
                console.log(`Inserted ${firm.challenges.length} challenges for ${firm.name}`);
            }
        }
    }

    console.log('Seeding complete!');
}

seedData();
