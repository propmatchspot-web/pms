import { supabase } from '../lib/supabaseClient';

export interface QuizPreferences {
    experienceLevel: string;
    tradingStyle: string;
    budget: number;
    riskAppetite: string;
    preferredPlatform: string;
}

/**
 * Queries the Supabase database for active firms and asks the Groq API (LLaMA 3.3)
 * to determine the single best match for the user's quiz preferences.
 */
export const determineGroqMatch = async (prefs: QuizPreferences): Promise<{ firmId: string | null, explanation: string }> => {
    const MOCK_FALLBACK = {
        firmId: null,
        explanation: `Based on your ${prefs.tradingStyle} style and budget of $${prefs.budget}, we found a strong match due to its evaluation model and profit split.`
    };

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
        console.warn("Missing VITE_GROQ_API_KEY. Using mock match fallback.");
        return MOCK_FALLBACK;
    }

    try {
        // 1. Fetch available firms from Supabase
        const { data: rawFirms, error } = await supabase
            .from('firms')
            .select('*, challenges(*)')
            .eq('status', 'active');

        if (error || !rawFirms || rawFirms.length === 0) {
            console.error("Failed to fetch live firms for AI matching:", error);
            return MOCK_FALLBACK;
        }

        // 2. Format firm data into token-efficient context for the LLM
        const availableFirmsContext = rawFirms.map((f: any) => {
            const minPrice = f.challenges?.reduce((min: number, c: any) => c.price < min ? c.price : min, Infinity);
            const maxAccount = f.challenges?.reduce((max: number, c: any) => c.account_size > max ? c.account_size : max, 0);

            return `
    FIRM ID: ${f.id}
    Name: ${f.name}
    Profit Split: ${f.profit_split_max}%
    Drawdown limits: Daily ${f.max_daily_drawdown}%, Total ${f.max_total_drawdown}%
    Account Sizes: Up to $${maxAccount}
    Starting Price: $${minPrice !== Infinity ? minPrice : 'N/A'}
    Trading Rules: ${JSON.stringify(f.trading_rules)}
    Allowed Assets: ${JSON.stringify(f.trust_score?.assets || [])}
    `;
        }).join('\n---');

        // 3. Build prompt
        const prompt = `
      You are an expert prop trading AI consultant for PropMatchSpot.
      Your task is to analyze the user's preferences and select the SINGLE best firm from our live database.

      USER PROFILE:
      - Experience: ${prefs.experienceLevel || 'Not specified'}
      - Style: ${prefs.tradingStyle || 'Not specified'}
      - Budget: $${prefs.budget || 'Not specified'}
      - Risk Strategy: ${prefs.riskAppetite || 'Not specified'}
      - Preferred Platform: ${prefs.preferredPlatform || 'Not specified'}

      AVAILABLE LIVE FIRMS:
      ${availableFirmsContext}

      INSTRUCTIONS:
      1. Analyze the User Profile against the Available Live Firms.
         (e.g., If their budget is $50, they cannot use a firm where the starting price is $100. If they scalp, check if trading rules allow it).
      2. Choose exactly ONE winning firm.
      3. Write a concise, persuasive 2-3 sentence explanation directly to the user (using "you", "your") about why this specific firm is their perfect match based exactly on their requirements and the firm's specific stats provided above.
      
      OUTPUT FORMAT:
      You must respond with ONLY valid JSON formatted exactly like this, nothing else:
      {
        "winningFirmId": "THE_EXACT_FIRM_ID_FROM_THE_LIST_ABOVE",
        "explanation": "Your 2-3 sentence persuasive explanation here."
      }
    `;

        // 4. Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" },
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
            })
        });

        const data = await response.json();
        console.log("Spot AI Response:", data);

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const resultJson = JSON.parse(data.choices[0].message.content);
            return {
                firmId: resultJson.winningFirmId || null,
                explanation: resultJson.explanation || MOCK_FALLBACK.explanation
            };
        }

        return MOCK_FALLBACK;
    } catch (error) {
        console.error("Spot AI Error:", error);
        return MOCK_FALLBACK;
    }
};
