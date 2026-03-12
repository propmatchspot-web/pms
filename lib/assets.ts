export const ASSET_CATEGORIES = {
    CRYPTO: [
        "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT",
        "DOGEUSDT", "AVAXUSDT", "DOTUSDT", "MATICUSDT", "LINKUSDT", "UNIUSDT",
        "LTCUSDT", "ATOMUSDT", "NEARUSDT", "APTUSDT", "XLMUSDT", "HBARUSDT",
        "SHIBUSDT", "ARBUSDT", "OPUSDT", "PEPEUSDT", "SUIUSDT", "TONUSDT",
        "FILUSDT", "INJUSDT", "TIAUSDT", "FETUSDT", "RENDERUSDT", "WIFUSDT"
    ],
    FOREX: [
        "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD",
        "EURGBP", "EURJPY", "GBPJPY", "AUDJPY", "CADJPY",
    ],
    METALS: [
        "XAUUSD", "XAGUSD",
    ],
    INDICES: [
        "SPX500USD", "NAS100USD", "US30USD",
    ],
}

export type AssetCategory = keyof typeof ASSET_CATEGORIES

export function getAllAssets(): string[] {
    return Object.values(ASSET_CATEGORIES).flat()
}

export function getCryptoAssets(): string[] {
    return ASSET_CATEGORIES.CRYPTO
}

export function detectCategory(symbol: string): AssetCategory | undefined {
    const clean = symbol.toUpperCase().replace(/BINANCE:|FX:|OANDA:/g, '')
    for (const [cat, assets] of Object.entries(ASSET_CATEGORIES)) {
        if (assets.includes(clean)) return cat as AssetCategory
    }
    if (clean.endsWith('USDT') || clean.endsWith('BTC')) return 'CRYPTO'
    if (clean.length === 6 && /^[A-Z]+$/.test(clean)) return 'FOREX'
    return undefined
}
