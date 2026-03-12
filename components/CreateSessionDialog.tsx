import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronRight, ChevronLeft, History, Zap } from 'lucide-react'
import { createBacktestSession } from '../lib/backtestService'
import { getCryptoAssets } from '../lib/assets'

interface Props {
    open: boolean
    onClose: () => void
}

const POPULAR_ASSETS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT']

export default function CreateSessionDialog({ open, onClose }: Props) {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [name, setName] = useState('')
    const [asset, setAsset] = useState('BTCUSDT')
    const [balance, setBalance] = useState(10000)
    const [sessionType, setSessionType] = useState<'BACKTEST' | 'PROP_FIRM'>('BACKTEST')
    const [creating, setCreating] = useState(false)

    if (!open) return null

    const handleCreate = async () => {
        setCreating(true)
        try {
            const session = await createBacktestSession({
                name: name || `${asset} Replay`,
                balance,
                asset,
                type: sessionType,
            })
            navigate(`/session/${session.id}`)
        } catch (err) {
            console.error(err)
            alert('Failed to create session. Make sure you are logged in.')
        } finally {
            setCreating(false)
        }
    }

    const steps = [
        // Step 0: Asset Selection
        <div key="asset">
            <h3 className="text-xl font-black text-white mb-2">Choose Your Asset</h3>
            <p className="text-brand-muted text-sm mb-6">Select the trading pair to replay.</p>
            <div className="grid grid-cols-2 gap-3">
                {POPULAR_ASSETS.map(a => (
                    <button
                        key={a}
                        onClick={() => { setAsset(a); setStep(1) }}
                        className={`p-4 rounded-xl border text-left transition-all ${asset === a
                            ? 'border-brand-gold bg-brand-gold/10 text-white'
                            : 'border-brand-border bg-brand-dark hover:border-brand-gold/30 text-neutral-300'
                            }`}
                    >
                        <div className="font-bold text-sm">{a}</div>
                        <div className="text-[10px] text-brand-muted mt-1">Binance</div>
                    </button>
                ))}
            </div>
        </div>,

        // Step 1: Configuration
        <div key="config">
            <h3 className="text-xl font-black text-white mb-2">Configure Session</h3>
            <p className="text-brand-muted text-sm mb-6">Set your starting balance and session name.</p>
            <div className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">Session Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={`${asset} Replay`}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/40"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">Starting Balance ($)</label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {[1000, 5000, 10000, 50000].map(b => (
                            <button
                                key={b}
                                onClick={() => setBalance(b)}
                                className={`py-2 rounded-lg text-xs font-bold transition-all ${balance === b
                                    ? 'bg-brand-gold text-black'
                                    : 'bg-brand-dark border border-brand-border text-neutral-300 hover:border-brand-gold/30'
                                    }`}
                            >
                                ${b.toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={balance}
                        onChange={e => setBalance(Number(e.target.value))}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/40"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">Session Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {(['BACKTEST', 'PROP_FIRM'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setSessionType(t)}
                                className={`p-4 rounded-xl border text-left transition-all ${sessionType === t
                                    ? 'border-brand-gold bg-brand-gold/10'
                                    : 'border-brand-border bg-brand-dark hover:border-brand-gold/30'
                                    }`}
                            >
                                <div className="text-white font-bold text-sm">{t === 'BACKTEST' ? 'Free Replay' : 'Prop Firm Sim'}</div>
                                <div className="text-[10px] text-brand-muted mt-1">{t === 'BACKTEST' ? 'Practice freely' : 'With challenge rules'}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-brand-charcoal border border-brand-border rounded-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                            <History className="w-4 h-4 text-brand-gold" />
                        </div>
                        <span className="text-white font-bold text-sm">New Replay Session</span>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Step Dots */}
                <div className="flex items-center justify-center gap-2 py-4">
                    {[0, 1].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-brand-gold w-6' : i < step ? 'bg-brand-gold' : 'bg-brand-border'}`} />
                    ))}
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {steps[step]}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-brand-border">
                    <button
                        onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
                        className="text-brand-muted hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
                    >
                        <ChevronLeft size={14} /> {step > 0 ? 'Back' : 'Cancel'}
                    </button>

                    {step === steps.length - 1 ? (
                        <button
                            onClick={handleCreate}
                            disabled={creating}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-black text-sm font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
                        >
                            <Zap size={14} /> {creating ? 'Creating...' : 'Start Replay'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="inline-flex items-center gap-1 text-brand-gold text-sm font-bold hover:text-amber-400 transition-colors"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
