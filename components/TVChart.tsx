import React, { useEffect, useRef, useState } from 'react'
import { Candle } from '../lib/replay-types'

interface Props {
    data: Candle[]
    interval: string
    symbol?: string
    orders?: any[]
    trades?: any[]
    currentPrice?: number
    isPlaying?: boolean
    onPlayPause?: () => void
    onStepForward?: () => void
    onPlaceOrder?: () => void
    onIntervalChange?: (interval: string) => void
    onCloseTrade?: (tradeId: string) => void
    sessionId?: string
}

const mapIntervalToTV = (interval: string) => {
    switch (interval) {
        case '1m': return '1'; case '5m': return '5'; case '15m': return '15'
        case '1h': return '60'; case '4h': return '240'; case 'D': return 'D'
        default: return '60'
    }
}

const mapTVToInterval = (resolution: string) => {
    switch (resolution) {
        case '1': return '1m'; case '5': return '5m'; case '15': return '15m'
        case '60': return '1h'; case '240': return '4h'; case 'D': case '1D': return 'D'
        default: return '1h'
    }
}

const createBacktestDatafeed = (
    dataRef: React.MutableRefObject<Candle[]>,
    currentIntervalRef: React.MutableRefObject<string>,
    onIntervalChange?: (i: string) => void,
) => {
    const supportedResolutions = ['1', '5', '15', '60', '240', 'D']

    return {
        onReady: (callback: any) => {
            setTimeout(() => callback({
                supported_resolutions: supportedResolutions,
                supports_marks: false,
                supports_timescale_marks: false,
            }))
        },
        resolveSymbol: (symbolName: string, onResolvedCallback: any) => {
            const clean = symbolName.toUpperCase()
            const isCrypto = clean.endsWith('USDT') || clean.endsWith('BUSD')
            const isJPY = clean.includes('JPY')
            let pricescale = 100000
            if (isCrypto) pricescale = 100000000
            else if (isJPY) pricescale = 1000
            else if (clean.includes('XAU')) pricescale = 100
            else if (clean.includes('XAG')) pricescale = 10000

            setTimeout(() => onResolvedCallback({
                name: symbolName, description: symbolName,
                type: isCrypto ? 'crypto' : 'forex',
                session: '24x7', timezone: 'Etc/UTC',
                minmov: 1, pricescale,
                has_intraday: true, has_no_volume: false,
                has_weekly_and_monthly: true,
                supported_resolutions: supportedResolutions,
                volume_precision: 2, data_status: 'streaming',
            }))
        },
        getBars: (_symbolInfo: any, resolution: string, periodParams: any, onHistoryCallback: any) => {
            const mappedRes = mapTVToInterval(resolution)

            if (mappedRes !== currentIntervalRef.current) {
                currentIntervalRef.current = mappedRes
                if (onIntervalChange) onIntervalChange(mappedRes)
                const currentData = dataRef.current || []
                if (currentData.length > 0) {
                    const allBars = currentData.map(d => ({
                        time: d.time < 10000000000 ? d.time * 1000 : d.time,
                        open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume,
                    })).sort((a, b) => a.time - b.time)
                    onHistoryCallback(allBars, { noData: false })
                    return
                }
                onHistoryCallback([], { noData: true })
                return
            }

            const currentData = dataRef.current || []
            if (currentData.length === 0) { onHistoryCallback([], { noData: true }); return }

            const allBars = currentData.map(d => ({
                time: d.time < 10000000000 ? d.time * 1000 : d.time,
                open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume,
            })).sort((a, b) => a.time - b.time)

            onHistoryCallback(allBars.length ? allBars : [], { noData: !allBars.length })
        },
        subscribeBars: () => { },
        unsubscribeBars: () => { },
    }
}

export default function TVChart({
    data, interval, symbol, orders, trades, currentPrice,
    isPlaying, onPlayPause, onStepForward, onPlaceOrder,
    onIntervalChange, onCloseTrade, sessionId,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetRef = useRef<any>(null)
    const realtimeCallbackRef = useRef<any>(null)
    const dataRef = useRef(data)
    const intervalRef = useRef(interval)
    const hasInitializedRef = useRef(false)
    const widgetReadyRef = useRef(false)
    const playButtonRef = useRef<HTMLElement | null>(null)
    const tradeShapeIdsRef = useRef<any[]>([])
    const [isTransitioning, setIsTransitioning] = useState(false)
    const prevDataLengthRef = useRef(0)
    const prevIntervalRef = useRef(interval)

    useEffect(() => { intervalRef.current = interval }, [interval])
    useEffect(() => { dataRef.current = data }, [data])

    // Play button icon update
    useEffect(() => {
        if (playButtonRef.current) {
            playButtonRef.current.innerHTML = isPlaying
                ? `<div style="display:flex;align-items:center;color:#ef4444;font-weight:600" title="Pause"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg></div>`
                : `<div style="display:flex;align-items:center;color:#10b981;font-weight:600" title="Play"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>`
        }
    }, [isPlaying])

    // ONE-TIME Widget Init
    useEffect(() => {
        if (hasInitializedRef.current) return
        if (!containerRef.current) return
        const currentData = dataRef.current
        if (!currentData || currentData.length === 0) return
        if (widgetRef.current) return

        function initializeWidget() {
            if (!containerRef.current) { setTimeout(initializeWidget, 200); return }

            const datafeed = createBacktestDatafeed(dataRef, intervalRef, onIntervalChange)
            const originalSubscribe = datafeed.subscribeBars
            datafeed.subscribeBars = (_si: any, _res: string, onRealtimeCallback: any) => {
                realtimeCallbackRef.current = onRealtimeCallback
            }

            const widgetOptions = {
                symbol: symbol || 'BTCUSDT',
                datafeed,
                interval: mapIntervalToTV(interval),
                container: containerRef.current!,
                library_path: '/charting_library/',
                locale: 'en',
                disabled_features: [
                    'header_symbol_search', 'header_compare', 'display_market_status',
                    'study_templates', 'header_saveload',
                ],
                enabled_features: [
                    'header_widget', 'header_resolutions', 'header_interval_dialog_button',
                    'left_toolbar', 'control_bar', 'timeframes_toolbar',
                    'context_menus', 'header_settings', 'header_screenshot',
                ],
                fullscreen: false,
                autosize: true,
                theme: 'Dark',
                time_scale: { right_offset: 20, bar_spacing: 6, min_bar_spacing: 2 },
                studies_overrides: {
                    "volume.volume.color.0": "#ef4444",
                    "volume.volume.color.1": "#10b981",
                    "volume.volume.transparency": 50,
                },
                overrides: {
                    "paneProperties.background": "#07060a",
                    "paneProperties.vertGridProperties.color": "#141018",
                    "paneProperties.horzGridProperties.color": "#141018",
                    "scalesProperties.textColor": "#71717a",
                    "mainSeriesProperties.candleStyle.upColor": "#10b981",
                    "mainSeriesProperties.candleStyle.downColor": "#ef4444",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
                    "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
                },
            }

            if ((window as any).TradingView) {
                const widget = new (window as any).TradingView.widget(widgetOptions as any)
                widgetRef.current = widget

                widget.onChartReady(() => {
                    widgetReadyRef.current = true

                    widget.headerReady().then(() => {
                        // Step Forward button
                        if (onStepForward) {
                            const btn = widget.createButton({ align: 'left' })
                            btn.setAttribute('title', 'Next Candle')
                            btn.addEventListener('click', () => onStepForward())
                            btn.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;cursor:pointer;color:#d1d4dc;border-right:1px solid #2a2e39;transition:color 0.2s"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></div>`
                            btn.onmouseenter = () => { btn.querySelector('div')!.style.color = '#f0f3fa' }
                            btn.onmouseleave = () => { btn.querySelector('div')!.style.color = '#d1d4dc' }
                        }

                        // Play/Pause button
                        if (onPlayPause) {
                            const btn = widget.createButton({ align: 'left' })
                            btn.setAttribute('title', 'Play/Pause')
                            btn.addEventListener('click', () => onPlayPause())
                            playButtonRef.current = btn
                            btn.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;cursor:pointer;color:#10b981;font-weight:600;padding:0 4px"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>`
                        }

                        // Place Order button
                        if (onPlaceOrder) {
                            const btn = widget.createButton({ align: 'right' })
                            btn.setAttribute('title', 'Place Order')
                            btn.addEventListener('click', () => onPlaceOrder())
                            btn.innerHTML = `<div style="display:flex;gap:8px;align-items:center;cursor:pointer;color:white;font-weight:600;font-family:Inter,sans-serif;background:linear-gradient(135deg,#F6AE13 0%,#d4950f 100%);padding:6px 16px;border-radius:6px;box-shadow:0 4px 6px -1px rgba(246,174,19,0.2);border:1px solid rgba(255,255,255,0.1);font-size:13px;letter-spacing:0.3px;transition:all 0.2s ease;color:#000"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>NEW ORDER</span></div>`
                            btn.onmouseenter = () => { const d = btn.querySelector('div'); if (d) { d.style.transform = 'translateY(-1px)'; d.style.boxShadow = '0 6px 8px -1px rgba(246,174,19,0.3)' } }
                            btn.onmouseleave = () => { const d = btn.querySelector('div'); if (d) { d.style.transform = 'translateY(0)'; d.style.boxShadow = '0 4px 6px -1px rgba(246,174,19,0.2)' } }
                        }

                        // Drawing persistence: load saved state
                        const STORAGE_KEY = sessionId ? `spot_replay_${sessionId}` : 'spot_replay_default'
                        const saved = localStorage.getItem(STORAGE_KEY)
                        if (saved) {
                            try { widget.load(JSON.parse(saved)) } catch (e) { localStorage.removeItem(STORAGE_KEY) }
                        }
                    })
                })

                hasInitializedRef.current = true
            }
        }

        // Load TradingView script
        const existingScript = document.querySelector('script[src="/charting_library/charting_library.js"]')
        if (existingScript && (window as any).TradingView) {
            setTimeout(initializeWidget, 100)
        } else {
            const script = document.createElement('script')
            script.src = '/charting_library/charting_library.js'
            script.async = true
            script.onload = () => setTimeout(initializeWidget, 100)
            document.head.appendChild(script)
        }

        // Auto-save drawings
        const STORAGE_KEY = sessionId ? `spot_replay_${sessionId}` : 'spot_replay_default'
        const saveTimer = setInterval(() => {
            if (widgetRef.current && widgetReadyRef.current) {
                try {
                    widgetRef.current.save((state: any) => {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
                    })
                } catch (e) { }
            }
        }, 3000)

        return () => {
            clearInterval(saveTimer)
            if (widgetRef.current) {
                try { widgetRef.current.remove() } catch (e) { }
                widgetRef.current = null; playButtonRef.current = null
            }
            widgetReadyRef.current = false; hasInitializedRef.current = false
        }
    }, [data?.length])

    // Handle interval change
    useEffect(() => {
        if (prevIntervalRef.current === interval) return
        prevIntervalRef.current = interval
        if (!widgetRef.current || !widgetReadyRef.current) return
        setIsTransitioning(true)
        dataRef.current = data; intervalRef.current = interval

        try {
            const chart = widgetRef.current.activeChart()
            const tvInterval = mapIntervalToTV(interval)
            chart.setResolution(tvInterval, () => {
                try { chart.resetData() } catch (e) { }
                setTimeout(() => setIsTransitioning(false), 200)
            })
        } catch (e) { setIsTransitioning(false) }
    }, [interval, data])

    // Handle new candles (replay tick)
    useEffect(() => {
        if (!widgetRef.current || data.length === 0 || isTransitioning) return
        const prevLen = prevDataLengthRef.current
        const currLen = data.length
        prevDataLengthRef.current = currLen

        if (currLen < prevLen && prevLen > 0) {
            try {
                const chart = widgetRef.current.activeChart()
                chart.setResolution(mapIntervalToTV(interval), () => chart.executeActionById('chartReset'))
            } catch (e) { }
            return
        }

        if (realtimeCallbackRef.current && currLen > prevLen && prevLen > 0) {
            const last = data[data.length - 1]
            realtimeCallbackRef.current({
                time: last.time < 10000000000 ? last.time * 1000 : last.time,
                open: last.open, high: last.high, low: last.low, close: last.close, volume: last.volume,
            })
        }
    }, [data])

    // Draw trade markers
    const clearTradeShapes = () => {
        if (!widgetRef.current) return
        try {
            const chart = widgetRef.current.activeChart()
            tradeShapeIdsRef.current.forEach(id => { try { chart.removeEntity(id) } catch (e) { } })
        } catch (e) { }
        tradeShapeIdsRef.current = []
    }

    useEffect(() => {
        if (!widgetRef.current || !widgetReadyRef.current || !data || data.length === 0) return
        let chart: any
        try { chart = widgetRef.current.activeChart() } catch (e) { return }
        if (!chart) return
        clearTradeShapes()

        const price = currentPrice || (data.length > 0 ? data[data.length - 1].close : 0)
        const lastCandle = data[data.length - 1]
        const fmtPnl = (pnl: number) => (pnl >= 0 ? '+' : '') + '$' + Math.abs(pnl).toFixed(2)
        const fmtPrice = (p: number) => p >= 1000 ? p.toFixed(2) : p >= 10 ? p.toFixed(4) : p.toFixed(5)

        trades?.forEach(trade => {
            if (trade.status !== 'OPEN') return
            const isLong = trade.side === 'LONG'
            const priceDiff = isLong ? (price - trade.entryPrice) : (trade.entryPrice - price)
            const livePnl = priceDiff * (trade.quantity || 1)

            try {
                const entryId = chart.createShape(
                    { time: lastCandle.time, price: trade.entryPrice },
                    {
                        shape: 'horizontal_line', lock: true, disableSelection: false, disableSave: true, disableUndo: true, zOrder: 'top',
                        overrides: {
                            linecolor: isLong ? '#3b82f6' : '#ef4444', linestyle: 0, linewidth: 2,
                            showPrice: true, showLabel: true,
                            text: (isLong ? 'LONG' : 'SHORT') + ' Entry ' + fmtPrice(trade.entryPrice) + '  |  PnL: ' + fmtPnl(livePnl),
                            textcolor: isLong ? '#93c5fd' : '#fca5a5', fontsize: 12, horzLabelsAlign: 'right', bold: true,
                        }
                    }
                )
                if (entryId) tradeShapeIdsRef.current.push(entryId)

                if (trade.takeProfit && trade.takeProfit > 0) {
                    const tpPnl = (isLong ? (trade.takeProfit - trade.entryPrice) : (trade.entryPrice - trade.takeProfit)) * (trade.quantity || 1)
                    const tpId = chart.createShape(
                        { time: lastCandle.time, price: trade.takeProfit },
                        {
                            shape: 'horizontal_line', lock: true, disableSelection: false, disableSave: true, disableUndo: true, zOrder: 'top',
                            overrides: {
                                linecolor: '#22c55e', linestyle: 2, linewidth: 1, showPrice: true, showLabel: true,
                                text: 'TP ' + fmtPrice(trade.takeProfit) + '  |  ' + fmtPnl(tpPnl),
                                textcolor: '#86efac', fontsize: 11, horzLabelsAlign: 'right',
                            }
                        }
                    )
                    if (tpId) tradeShapeIdsRef.current.push(tpId)
                }

                if (trade.stopLoss && trade.stopLoss > 0) {
                    const slPnl = (isLong ? (trade.stopLoss - trade.entryPrice) : (trade.entryPrice - trade.stopLoss)) * (trade.quantity || 1)
                    const slId = chart.createShape(
                        { time: lastCandle.time, price: trade.stopLoss },
                        {
                            shape: 'horizontal_line', lock: true, disableSelection: false, disableSave: true, disableUndo: true, zOrder: 'top',
                            overrides: {
                                linecolor: '#ef4444', linestyle: 2, linewidth: 1, showPrice: true, showLabel: true,
                                text: 'SL ' + fmtPrice(trade.stopLoss) + '  |  ' + fmtPnl(slPnl),
                                textcolor: '#fca5a5', fontsize: 11, horzLabelsAlign: 'right',
                            }
                        }
                    )
                    if (slId) tradeShapeIdsRef.current.push(slId)
                }
            } catch (e) { }
        })

        orders?.forEach(order => {
            if (order.status !== 'PENDING') return
            const orderPrice = order.limitPrice || order.stopPrice
            if (!orderPrice) return
            try {
                const oid = chart.createShape(
                    { time: lastCandle.time, price: orderPrice },
                    {
                        shape: 'horizontal_line', lock: true, disableSelection: false, disableSave: true, disableUndo: true, zOrder: 'top',
                        overrides: {
                            linecolor: order.side === 'LONG' ? '#60a5fa' : '#f97316', linestyle: 1, linewidth: 1,
                            showPrice: true, showLabel: true,
                            text: order.side + ' ' + order.type + ' @ ' + fmtPrice(orderPrice),
                            textcolor: order.side === 'LONG' ? '#93c5fd' : '#fdba74', fontsize: 10, horzLabelsAlign: 'right',
                        }
                    }
                )
                if (oid) tradeShapeIdsRef.current.push(oid)
            } catch (e) { }
        })

        return () => clearTradeShapes()
    }, [orders, trades, data, currentPrice, JSON.stringify(trades?.map(t => ({ id: t.id, status: t.status })))])

    return (
        <div className="h-full w-full relative">
            <div ref={containerRef} className="h-full w-full" />
            {isTransitioning && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-brand-muted font-medium">Switching timeframe...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
