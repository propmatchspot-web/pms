import { supabase } from '../lib/supabaseClient'

// ───── Session CRUD ─────

export async function createBacktestSession(data: {
    name: string
    balance: number
    asset: string
    type: 'BACKTEST' | 'PROP_FIRM'
    startDate?: string
    endDate?: string
    challengeRules?: any
}) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: session, error } = await supabase
        .from('backtest_sessions')
        .insert({
            user_id: user.id,
            name: data.name,
            session_type: data.type,
            initial_balance: data.balance,
            current_balance: data.balance,
            pair: data.asset,
            start_date: data.startDate,
            end_date: data.endDate,
            challenge_rules: data.challengeRules,
        })
        .select()
        .single()

    if (error) throw error
    return session
}

export async function getRecentBacktestSessions(limit: number = 20) {
    const { data, error } = await supabase
        .from('backtest_sessions')
        .select('*, backtest_trades(*)')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data || []
}

export async function getBacktestSession(sessionId: string) {
    const { data, error } = await supabase
        .from('backtest_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

    if (error) throw error
    return data
}

export async function updateBacktestSession(sessionId: string, updates: {
    current_balance?: number
    name?: string
    notes?: string
    challenge_status?: any
    last_replay_time?: number
}) {
    const { error } = await supabase
        .from('backtest_sessions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', sessionId)

    if (error) throw error
}

export async function deleteBacktestSession(sessionId: string) {
    const { error } = await supabase
        .from('backtest_sessions')
        .delete()
        .eq('id', sessionId)

    if (error) throw error
}

// ───── Trade CRUD ─────

export async function saveBacktestTrade(tradeData: {
    backtest_session_id: string
    pair: string
    type: 'LONG' | 'SHORT'
    entry_price: number
    exit_price: number
    size: number
    pnl: number
    entry_date: string
    exit_date: string
}) {
    const { error } = await supabase
        .from('backtest_trades')
        .insert(tradeData)

    if (error) throw error
}

export async function getBacktestTrades(sessionId: string) {
    const { data, error } = await supabase
        .from('backtest_trades')
        .select('*')
        .eq('backtest_session_id', sessionId)
        .order('entry_date', { ascending: true })

    if (error) throw error
    return data || []
}

// ───── Market Data ─────

export async function fetchMarketData(
    pair: string,
    interval: string,
    limit: number = 1000,
    startTime?: number,
    endTime?: number,
) {
    // Import Binance fetcher dynamically to keep this service clean
    const { fetchBinanceData } = await import('../lib/binance')
    return fetchBinanceData(pair, interval, limit, startTime, endTime)
}

// ───── Stats ─────

export async function getBacktestStats() {
    const { data: sessions } = await supabase
        .from('backtest_sessions')
        .select('*, backtest_trades(*)')

    if (!sessions) return { totalSessions: 0, totalTrades: 0, totalPnl: 0, winRate: 0 }

    let totalTrades = 0
    let wins = 0
    let totalPnl = 0

    sessions.forEach((s: any) => {
        const trades = s.backtest_trades || []
        totalTrades += trades.length
        trades.forEach((t: any) => {
            totalPnl += t.pnl || 0
            if (t.pnl > 0) wins++
        })
    })

    return {
        totalSessions: sessions.length,
        totalTrades,
        totalPnl,
        winRate: totalTrades > 0 ? (wins / totalTrades) * 100 : 0,
    }
}
