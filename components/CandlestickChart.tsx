import { useEffect, useRef, useState, useCallback } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'
import { Candle } from '../lib/types'

interface Props {
    candles: Candle[]
    visibleCount: number
    onCrosshairMove?: (price: number | null) => void
}

export default function CandlestickChart({ candles, visibleCount, onCrosshairMove }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const chart = createChart(containerRef.current, {
            layout: {
                background: { color: '#0a0908' },
                textColor: '#8a8577',
                fontFamily: 'Inter, sans-serif',
            },
            grid: {
                vertLines: { color: '#1a1810' },
                horzLines: { color: '#1a1810' },
            },
            crosshair: {
                mode: 0,
                vertLine: { color: '#F6AE13', width: 1, style: 2, labelBackgroundColor: '#F6AE13' },
                horzLine: { color: '#F6AE13', width: 1, style: 2, labelBackgroundColor: '#F6AE13' },
            },
            timeScale: {
                borderColor: '#2a2720',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: '#2a2720',
            },
        })

        const series = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderDownColor: '#ef4444',
            borderUpColor: '#22c55e',
            wickDownColor: '#ef4444',
            wickUpColor: '#22c55e',
        })

        chartRef.current = chart
        seriesRef.current = series

        // Handle resize
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                chart.applyOptions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                })
            }
        })
        resizeObserver.observe(containerRef.current)

        // Crosshair move
        if (onCrosshairMove) {
            chart.subscribeCrosshairMove(param => {
                if (!param.point || !param.time) {
                    onCrosshairMove(null)
                    return
                }
                const data = param.seriesData.get(series) as any
                if (data) {
                    onCrosshairMove(data.close)
                }
            })
        }

        return () => {
            resizeObserver.disconnect()
            chart.remove()
        }
    }, [])

    // Update data
    useEffect(() => {
        if (!seriesRef.current || candles.length === 0) return

        const visible = candles.slice(0, visibleCount)
        const chartData: CandlestickData<Time>[] = visible.map(c => ({
            time: c.time as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }))

        seriesRef.current.setData(chartData)

        // Scroll to end
        if (chartRef.current && chartData.length > 0) {
            chartRef.current.timeScale().scrollToPosition(2, false)
        }
    }, [candles, visibleCount])

    return (
        <div ref={containerRef} className="w-full h-full" />
    )
}
