
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bolltbelnkxrosiudosi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGx0YmVsbmt4cm9zaXVkb3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTIxNDYsImV4cCI6MjA4MjI4ODE0Nn0.z8qyPf9engFTRQ4McZQldcyuI-0Ie7vPS4JnBVbWXj8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedPayoutsBadges() {
    console.log('Fetching firms to link data...');
    const { data: firms, error: firmsError } = await supabase.from('firms').select('id,name');

    if (firmsError || !firms || firms.length === 0) {
        console.error('No firms found. Please seed firms first.');
        return;
    }

    const alphaCapital = firms.find(f => f.name === 'Alpha Capital') || firms[0];
    const fundedNext = firms.find(f => f.name === 'FundedNext') || firms[1] || firms[0];
    const the5ers = firms.find(f => f.name === 'The 5ers') || firms[2] || firms[0];

    console.log('Seeding Payouts...');
    const payouts = [
        {
            firm_id: alphaCapital.id,
            amount: 1250.00,
            currency: 'USD',
            status: 'pending',
            trader_name: 'John Doe',
            payout_date: new Date().toISOString()
        },
        {
            firm_id: fundedNext.id,
            amount: 5000.00,
            currency: 'USD',
            status: 'processed',
            trader_name: 'Jane Smith',
            payout_date: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
            firm_id: the5ers.id,
            amount: 15400.50,
            currency: 'USD',
            status: 'rejected',
            trader_name: 'Mike Ross',
            payout_date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
    ];

    const { error: payoutError } = await supabase.from('payouts').insert(payouts);
    if (payoutError) console.error('Error seeding payouts:', payoutError);
    else console.log('Payouts seeded successfully.');

    console.log('Seeding Badges...');
    const badges = [
        {
            firm_id: alphaCapital.id,
            badge_type: 'Verified Firm',
            issued_at: new Date().toISOString()
        },
        {
            firm_id: fundedNext.id,
            badge_type: 'Fast Payouts',
            issued_at: new Date().toISOString()
        }
    ];

    const { error: badgeError } = await supabase.from('trust_badges').insert(badges);
    if (badgeError) console.error('Error seeding badges:', badgeError);
    else console.log('Badges seeded successfully.');
}

seedPayoutsBadges();
