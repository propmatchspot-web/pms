import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, History, Zap, X, ChevronDown, Gauge } from 'lucide-react'
import { getBacktestSession, getBacktestTrades, updateBacktestSession, saveBacktestTrade, fetchMarketData } from '../lib/backtestService'
import { BacktestEngine, Trade } from '../lib/backtest-engine'
import { Candle } from '../lib/replay-types'
import { aggregateCandles, Timeframe } from '../lib/candle-utils'
import TVChart from '../components/TVChart'

const SPEEDS = [
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '5x', value: 5 },
    { label: '10x', value: 10 },
    { label: '25x', value: 25 },
]

export default function ReplaySessionPage() {
    const { id } = useParams<{ id: string }>()
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [allCandles, setAllCandles] = useState<Candle[]>([])
    const [visibleIndex, setVisibleIndex] = useState(100)
    const [timeframe, setTimeframe] = useState<Timeframe>('15m')
    const [displayCandles, setDisplayCandles] = useState<Candle[]>([])

    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)
    const [showSpeedMenu, setShowSpeedMenu] = useState(false)
    const intervalRef = useRef<number | null>(null)

    const engineRef = useRef<BacktestEngine | null>(null)
    const [engineStats, setEngineStats] = useState({ balance: 0, equity: 0, openTrades: 0, closedTrades: 0, maxDrawdown: 0 })
    const [openTrades, setOpenTrades] = useState<Trade[]>([])
    const [closedTrades, setClosedTrades] = useState<Trade[]>([])

    const [showOrder, setShowOrder] = useState(false)
    const [orderSide, setOrderSide] = useState<'LONG' | 'SHORT'>('LONG')
    const [orderSize, setOrderSize] = useState(1)
    const [orderSL, setOrderSL] = useState(0)
    const [orderTP, setOrderTP] = useState(0)

    useEffect(() => { if (id) loadSession() }, [id])

    const loadSession = async () => {
        try {
            const [sessionData, tradesData] = await Promise.all([
                getBacktestSession(id!),
                getBacktestTrades(id!),
            ])
            setSession(sessionData)

            const engine = new BacktestEngine(
                Number(sessionData.initial_balance),
                async (trade: Trade) => {
                    try {
                        await saveBacktestTrade({
                            backtest_session_id: id!,
                            pair: sessionData.pair,
                            type: trade.side,
                            entry_price: trade.entryPrice,
                            exit_price: trade.exitPrice || 0,
                            size: trade.quantity,
                            pnl: trade.pnl || 0,
                            entry_date: new Date(trade.entryTime * 1000).toISOString(),
                            exit_date: new Date((trade.exitTime || Date.now() / 1000) * 1000).toISOString(),
                        })
                        await updateBacktestSession(id!, { current_balance: engine.getStats().balance })
                    } catch (err) { console.error('Failed to save trade:', err) }
                    refreshEngineState()
                }, [],
            )
            engineRef.current = engine
            setEngineStats(engine.getStats())
            await loadMarketData(sessionData.pair)
        } catch (err: any) {
            setError(err.message || 'Failed to load session')
        } finally {
            setLoading(false)
        }
    }

    const loadMarketData = async (pair: string) => {
        try {
            const data = await fetchMarketData(pair, '1m', 5000)
            if (data.length === 0) { setError('No market data available'); return }
            setAllCandles(data)
            setVisibleIndex(Math.min(100, data.length))
        } catch (err) { setError('Failed to load market data') }
    }

    useEffect(() => {
        if (allCandles.length === 0) return
        const visibleBase = allCandles.slice(0, visibleIndex)
        setDisplayCandles(timeframe === '1m' ? visibleBase : aggregateCandles(visibleBase, timeframe))
    }, [allCandles, visibleIndex, timeframe])

    // Replay loop
    useEffect(() => {
        if (isPlaying) {
            const ms = Math.max(50, 500 / speed)
            intervalRef.current = window.setInterval(() => {
                setVisibleIndex(prev => {
                    if (prev >= allCandles.length) { setIsPlaying(false); return prev }
                    const candle = allCandles[prev]
                    if (candle && engineRef.current) {
                        engineRef.current.processCandle(candle)
                        refreshEngineState()
                    }
                    return prev + 1
                })
            }, ms)
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [isPlaying, speed, allCandles])

    const refreshEngineState = () => {
        if (!engineRef.current) return
        setEngineStats(engineRef.current.getStats())
        setOpenTrades(engineRef.current.getTrades().filter(t => t.status === 'OPEN'))
        setClosedTrades(engineRef.current.getTrades().filter(t => t.status === 'CLOSED'))
    }

    const advanceOne = () => {
        if (visibleIndex >= allCandles.length) return
        const candle = allCandles[visibleIndex]
        if (candle && engineRef.current) {
            engineRef.current.processCandle(candle)
            refreshEngineState()
        }
        setVisibleIndex(v => v + 1)
    }

    const placeOrder = () => {
        if (!engineRef.current || displayCandles.length === 0) return
        const lastCandle = displayCandles[displayCandles.length - 1]
        engineRef.current.placeOrder({
            sessionId: id!, symbol: session?.pair || 'BTCUSDT',
            side: orderSide, type: 'MARKET', quantity: orderSize,
            stopLoss: orderSL > 0 ? orderSL : undefined,
            takeProfit: orderTP > 0 ? orderTP : undefined,
        })
        engineRef.current.updatePrice(lastCandle.close, lastCandle.time)
        refreshEngineState()
        setShowOrder(false)
    }

    const closeTrade = (tradeId: string) => {
        if (!engineRef.current || displayCandles.length === 0) return
        engineRef.current.manualCloseTrade(tradeId, displayCandles[displayCandles.length - 1].close)
        refreshEngineState()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <style>{`
                    @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
                `}</style>
                <div className="text-center relative">
                    <div className="absolute inset-0 bg-brand-gold/20 rounded-full animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(246,174,19,0.2)] relative z-10 backdrop-blur-xl">
                        <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-full mb-3">
                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                        <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">Loading Replay Engine</p>
                    </div>
                    <p className="text-neutral-500 text-xs mt-2">Fetching high-resolution tick data</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center bg-white/[0.02] border border-red-500/20 p-8 rounded-3xl backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6">
                        <X size={24} />
                    </div>
                    <h3 className="text-white font-black text-xl mb-2">Session Error</h3>
                    <p className="text-neutral-400 text-sm mb-6 max-w-sm mx-auto">{error}</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-colors font-medium border border-white/10">
                        <ArrowLeft size={16} /> Return to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    const lastPrice = displayCandles.length > 0 ? displayCandles[displayCandles.length - 1].close : 0
    const pnl = engineStats.balance - (session?.initial_balance || 0)
    const pnlPct = session?.initial_balance ? ((pnl / Number(session.initial_balance)) * 100).toFixed(2) : '0.00'

    return (
        <div className="h-screen bg-black flex flex-col overflow-hidden">
            {/* Top Bar — Premium Glassmorphism */}
            <div className="h-14 border-b border-white/[0.06] bg-[#0c0b10]/95 backdrop-blur-2xl flex items-center px-4 gap-4 sm:gap-6 shrink-0 z-50">
                <Link to="/" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
                    <ArrowLeft size={16} />
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shadow-[0_0_15px_rgba(246,174,19,0.15)]">
                        <Zap size={14} className="text-brand-gold" />
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-white font-black text-sm leading-tight">{session?.name}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">Simulator</div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-gold/15 text-brand-gold border border-brand-gold/20 shadow-[0_0_10px_rgba(246,174,19,0.1)]">{session?.pair}</span>
                </div>

                <div className="ml-auto flex items-center gap-4 sm:gap-6 text-xs overflow-x-auto hide-scrollbar">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-neutral-500 font-medium uppercase text-[10px] tracking-wider hidden sm:inline">Balance</span>
                        <span className="text-white font-black text-sm">${engineStats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="h-5 w-px bg-white/[0.08] shrink-0" />

                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-neutral-500 font-medium uppercase text-[10px] tracking-wider hidden sm:inline">Net P&L</span>
                        <div className={`flex items-baseline gap-1.5 ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span className="font-black text-sm">{pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-[10px] font-bold bg-white/5 px-1.5 py-0.5 rounded border border-current/10 opacity-90">{pnl >= 0 ? '+' : ''}{pnlPct}%</span>
                        </div>
                    </div>

                    <div className="h-5 w-px bg-white/[0.08] shrink-0 hidden sm:block" />

                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <span className="text-neutral-500 font-medium uppercase text-[10px] tracking-wider">Open Positions</span>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${engineStats.openTrades > 0 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-neutral-400 border border-white/10'}`}>{engineStats.openTrades}</span>
                    </div>

                    <div className="h-5 w-px bg-white/[0.08] shrink-0" />

                    {/* Premium Speed Selector */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/15 transition-all shadow-[0_0_10px_rgba(246,174,19,0.1)]"
                        >
                            <Gauge size={14} />
                            <span className="font-black text-sm">{speed}x</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${showSpeedMenu ? 'rotate-180' : ''}`} />
                        </button>
                        {showSpeedMenu && (
                            <div className="absolute top-full right-0 mt-2 w-28 bg-[#0c0b10] border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] z-50 backdrop-blur-xl">
                                {SPEEDS.map((s, idx) => (
                                    <button
                                        key={s.value}
                                        onClick={() => { setSpeed(s.value); setShowSpeedMenu(false) }}
                                        className={`block w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${speed === s.value ? 'bg-brand-gold/15 text-brand-gold border-l-2 border-brand-gold' : 'text-neutral-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                                            } ${idx !== SPEEDS.length - 1 ? 'border-b border-white/5' : ''}`}
                                    >
                                        Speed {s.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart — Full TradingView */}
            <div className="flex-1 relative z-10 border-b border-white/[0.06]">
                <TVChart
                    data={displayCandles}
                    interval={timeframe}
                    symbol={session?.pair}
                    orders={engineRef.current?.getOrders()}
                    trades={engineRef.current?.getTrades()}
                    currentPrice={lastPrice}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onStepForward={advanceOne}
                    onPlaceOrder={() => setShowOrder(true)}
                    onIntervalChange={(i) => setTimeframe(i as Timeframe)}
                    onCloseTrade={closeTrade}
                    sessionId={id}
                />
            </div>

            {/* Premium Open Positions Bar */}
            {openTrades.length > 0 && (
                <div className="bg-[#0c0b10] px-4 py-3 shrink-0 relative z-20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Active Positions</div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                        {openTrades.map(t => {
                            const unrealizedPnl = t.side === 'LONG'
                                ? (lastPrice - t.entryPrice) * t.quantity
                                : (t.entryPrice - lastPrice) * t.quantity
                            const pnlRowColor = unrealizedPnl >= 0 ? "emerald" : "red"
                            return (
                                <div key={t.id} className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 rounded-2xl px-4 py-3 min-w-[200px] shrink-0 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-black tracking-wider text-[9px] px-2 py-0.5 rounded-md uppercase ${t.side === 'LONG' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                                                }`}>{t.side}</span>
                                            <span className="text-white font-bold text-xs">{t.quantity} Lots</span>
                                        </div>
                                        <button onClick={() => closeTrade(t.id)} className="w-6 h-6 rounded-full bg-white/5 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 flex items-center justify-center transition-all">
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="text-[10px] space-y-0.5">
                                            <div className="text-neutral-500 font-medium">Entry <span className="text-neutral-300 font-mono">${t.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                            <div className="text-neutral-500 font-medium">Current <span className="text-white font-mono">${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                        </div>
                                        <div className={`px-2.5 py-1.5 rounded-lg border border-${pnlRowColor}-500/20 bg-${pnlRowColor}-500/10 text-right`}>
                                            <div className={`font-black text-sm leading-none text-${pnlRowColor}-400`}>
                                                {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Premium Order Entry Modal */}
            {showOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowOrder(false)}></div>
                    <div className="w-full max-w-[380px] bg-[#0c0b10] border border-white/10 rounded-[24px] overflow-hidden animate-fade-in shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative z-10 flex flex-col">

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-brand-gold" />
                                <h3 className="text-white font-black text-lg">New Order</h3>
                            </div>
                            <button onClick={() => setShowOrder(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 flex items-center justify-center transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Order Side Tabs */}
                        <div className="flex p-5 pb-0">
                            <div className="flex w-full bg-white/[0.03] border border-white/10 p-1 rounded-xl">
                                <button
                                    onClick={() => setOrderSide('LONG')}
                                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2 rounded-lg transition-all ${orderSide === 'LONG' ? 'bg-emerald-500/15 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    Buy Long
                                </button>
                                <button
                                    onClick={() => setOrderSide('SHORT')}
                                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2 rounded-lg transition-all ${orderSide === 'SHORT' ? 'bg-red-500/15 text-red-400 shadow-sm border border-red-500/20' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    Sell Short
                                </button>
                            </div>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] px-4 py-3 rounded-xl">
                                <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Market Price</span>
                                <span className="text-brand-gold font-mono font-black text-lg tracking-tight">${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</span>
                            </div>

                            <div>
                                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-2 px-1">Position Size (Lots)</label>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {[0.1, 0.5, 1, 5].map(s => (
                                        <button key={s} onClick={() => setOrderSize(s)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${orderSize === s ? 'bg-brand-gold text-black shadow-[0_0_15px_rgba(246,174,19,0.3)]' : 'bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]'
                                                }`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input type="number" value={orderSize} onChange={e => setOrderSize(Number(e.target.value))}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-white font-black text-lg focus:outline-none focus:border-brand-gold/50 focus:bg-white/[0.04] transition-all font-mono" step="0.01" min="0.01" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold uppercase">Lots</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <label className="text-[10px] text-red-400/80 uppercase tracking-widest font-bold block mb-2 px-1">Stop Loss</label>
                                    <input type="number" value={orderSL || ''} onChange={e => setOrderSL(Number(e.target.value))}
                                        className="w-full bg-red-500/[0.02] border border-red-500/10 rounded-xl px-3 py-3 text-white text-base focus:outline-none focus:border-red-500/40 focus:bg-red-500/[0.05] transition-all font-mono placeholder:text-neutral-700" step="0.01" placeholder="Optional" />
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-bold block mb-2 px-1">Take Profit</label>
                                    <input type="number" value={orderTP || ''} onChange={e => setOrderTP(Number(e.target.value))}
                                        className="w-full bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl px-3 py-3 text-white text-base focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.05] transition-all font-mono placeholder:text-neutral-700" step="0.01" placeholder="Optional" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={placeOrder}
                                    className={`w-full py-4 rounded-xl font-black text-base transition-all shadow-xl flex items-center justify-center gap-2 overflow-hidden relative group ${orderSide === 'LONG'
                                        ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                                        : 'bg-red-500 text-white hover:bg-red-400 shadow-red-500/20'
                                        }`}
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                                    {orderSide === 'LONG' ? 'Place Buy Order' : 'Place Sell Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
