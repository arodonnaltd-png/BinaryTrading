# Arome Binary Signal — Forex Trading Terminal

A professional **real-time forex trading signal generator** with live chart data, multi-AI support, advanced risk management, and Vercel deployment ready.

## Features

✨ **Core Trading Engine**
- Real-time OHLCV candle data via Twelve Data API
- Professional technical indicators: RSI, EMA, MACD, Bollinger Bands, Stochastic, ATR
- Candlestick pattern recognition (Doji, Hammer, Engulfing, etc.)
- Multi-timeframe analysis (1m, 5m, 15m, 1h, 4h)
- Market regime detection (Trending/Ranging/Volatile)

🤖 **AI Signal Generation** (choose one)
- **Groq** (recommended: fastest, most generous free tier)
- **Google Gemini** (free, 1500 req/day)
- **Anthropic Claude** ($5 free credits)

⚡ **Advanced Features**
- **Turbo Mode**: Pure technical analysis without AI
- **Weighted Indicator Scoring**: RSI 30%, MACD 25%, EMA 20%, BB 15%, Stoch 10%
- **Backtesting Module**: Win rate, max drawdown, Sharpe ratio
- **Dynamic Risk Management**: Stop-loss/take-profit based on ATR
- **Real-Time Signal Tracking**: Execution accuracy per timeframe
- **Telegram Alerts**: Real-time notifications
- **Signal Accuracy Report**: Historical performance analytics

## Getting Started (Local)

1. **Download the project:**
   ```bash
   git clone https://github.com/arodonnaltd-png/BinaryTrading.git
   cd BinaryTrading
   ```

2. **Open in browser:**
   ```bash
   open arome-binary-signal.html
   ```

3. **Get API keys** (free, only needed for local testing):
   - [Twelve Data](https://twelvedata.com) — chart/candle data (800 req/day)
   - One AI key:
     - [Groq](https://console.groq.com)
     - [Gemini](https://aistudio.google.com)
     - [Anthropic](https://console.anthropic.com)
   - (Optional) [Telegram Bot Token](https://t.me/BotFather) for alerts

4. **Click ⚙ API Keys** and paste your keys, then **Save**. (local storage only)

5. **Select asset → timeframe → Click ⚡ Generate Signals**

**Note:** On Vercel, you don't need to enter API keys in the UI — they're stored as environment variables server-side. The app calls `/api/...` proxies automatically.

## Deploy to Vercel

### Architecture

This project uses a **hybrid approach**:
- **Frontend:** Static HTML with real-time indicator analysis (client-side)
- **Backend:** Serverless API proxies (`/api/twelvedata.js`, `/api/ai.js`, `/api/telegram.js`) that hold all secret API keys server-side
- **Keys:** Stored securely as **Vercel Environment Variables** (not in frontend code)

This keeps your API keys private while allowing the frontend to call proxies via same-origin requests (no CORS issues).

### Step 1: Link GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New… → Project**
3. Choose **Import Git Repository** → **GitHub**
4. Find `arodonnaltd-png/BinaryTrading` and click **Import**

### Step 2: Configure Project

On the configuration screen:

- **Framework Preset:** "Other" (static site + serverless)
- **Root Directory:** `./` (repo root)
- **Build Command:** leave default
- **Output Directory:** leave default

### Step 3: Set Environment Variables (Server-Side)

Before deploying, add environment variables in **Project → Settings → Environment Variables**.

Add each as a separate entry (Name + Value), select all environments (Production/Preview/Development):

| Name | Required? | Where to Get |
|------|-----------|--------------|
| `TWELVEDATA_API_KEY` | **Yes** (chart data) | [twelvedata.com](https://twelvedata.com) |
| `GROQ_API_KEY` | One AI key required | [console.groq.com](https://console.groq.com) |
| `GEMINI_API_KEY` | …or this one | [aistudio.google.com](https://aistudio.google.com) |
| `ANTHROPIC_API_KEY` | …or this one | [console.anthropic.com](https://console.anthropic.com) |
| `TELEGRAM_BOT_TOKEN` | Optional (alerts only) | Telegram [@BotFather](https://t.me/BotFather) |

**Key difference:** You only add these to Vercel Settings, NOT in the app UI. The app calls `/api/...` endpoints that use these env vars server-side.

### Step 4: Deploy

1. Click **Deploy**
2. Vercel builds and deploys automatically
3. You'll get a live URL like `https://your-app.vercel.app`

Every push/merge to `main` auto-deploys. Other branches get preview URLs.

### Step 5: Verification

After deployment:

- ✅ Open your Vercel URL — chart should load (confirms `/api/twelvedata` works)
- ✅ Select asset → timeframe → Click **⚡ Generate Signals** — AI signals appear (confirms `/api/ai` works)
- ✅ Status bar shows "Chart: Proxy ✓" and "AI: (server) ✓"

If charts show an error, check that `TWELVEDATA_API_KEY` is set in Vercel Settings. If missing, add it and click **Redeploy**.

### Why Server-Side Proxies?

1. **Security:** API keys never leave your Vercel servers or appear in frontend code
2. **Rate limiting:** Centralized control over API request throttling
3. **Cost control:** Monitor and limit API spend from one place
4. **Privacy:** Users don't see your keys; they just use the app
5. **No CORS issues:** Frontend and `/api` are same-origin on Vercel

## Local Development

### Requirements
- Modern browser (Chrome, Firefox, Safari, Edge)
- No build step needed
- Works offline with cached data (if API keys are stored locally)

### File Structure
```
BinaryTrading/
├── arome-binary-signal.html      (main frontend app)
├── api/
│   ├── twelvedata.js              (Vercel proxy → Twelve Data API)
│   ├── ai.js                      (Vercel proxy → Groq/Gemini/Anthropic)
│   └── telegram.js                (Vercel proxy → Telegram Bot API)
├── vercel.json                    (Vercel routing + serverless config)
├── package.json                   (Node.js runtime config)
└── README.md
```

### How It Works

**On Vercel (production):**
1. **Frontend** → calls `/api/twelvedata` (same-origin)
2. **Proxy** → uses env var `TWELVEDATA_API_KEY` → fetches from Twelve Data
3. **Frontend** ← gets candle data
4. **Analysis:** Calculates 6+ technical indicators in real-time
5. **Frontend** → calls `/api/ai` with prompt
6. **Proxy** → uses env var (`GROQ_API_KEY`, etc.) → calls your chosen AI
7. **Signals:** AI returns BUY/SELL/NEUTRAL with timeframes & confidence
8. **Frontend** → optionally calls `/api/telegram` to send alerts
9. **Tracking:** Monitors signal execution in real-time, records accuracy

**Locally (development):**
Simply open `arome-binary-signal.html` in a browser and use client-side key storage (no proxies needed).
On Vercel, the API keys are hidden server-side via the proxies.

## Indicators & Methodology

### Technical Indicators
- **RSI(14):** Momentum (oversold/overbought)
- **EMA(9, 21, 50):** Trend direction & crossovers
- **MACD(12, 26, 9):** Momentum & divergence
- **Bollinger Bands(20):** Volatility & support/resistance
- **Stochastic(14, 3):** Momentum confirmation
- **ATR(14):** Volatility & dynamic risk sizing
- **Support/Resistance:** 50-candle lookback
- **Candlestick Patterns:** Doji, Hammer, Engulfing, etc.

### Confidence Scoring (41–94%)
- Weighted sum of indicator signals
- Adjusted for market regime
- Sanity checks for conflicting signals
- Confidence only valid 41–94 (no round numbers)

### Market Regimes
- **TRENDING_UP:** Strong uptrend (use BUY bias)
- **TRENDING_DOWN:** Strong downtrend (use SELL bias)
- **RANGING:** No trend (favor reversals)
- **VOLATILE:** High volatility (lower confidence)

## Tips for Best Results

1. **Start with Groq** — it's the fastest and most reliable free option
2. **Use Turbo Mode** during high API latency or when AI isn't available
3. **Multi-timeframe confluence** = higher confidence. Look for signals across 1m, 5m, 15m
4. **Risk management is key** — always set stop-loss/take-profit before entering
5. **Backtest first** — use ⚡ Advanced → Backtesting to validate on historical data
6. **Export signal history** — track accuracy and refine strategy over time

## Troubleshooting

### Chart won't load
- Check `TWELVEDATA_API_KEY` in ⚙ API Keys
- Verify it's the correct key from twelvedata.com
- If still blank, redeploy on Vercel (env vars may not have taken effect)

### Signals don't appear
- Ensure one AI key is set (⚙ API Keys)
- Select Turbo Mode (⚡ Advanced) to skip AI dependency
- Check browser console for errors (F12)

### Telegram alerts not working
- Verify bot token and chat ID are correct
- Check Telegram bot is active (@BotFather)

### Deployment issues
- Redeploy after adding env vars
- Check Vercel build logs for errors
- Ensure no build step is set (this is a static file app)

## License

MIT

## Support & Feedback

For issues, suggestions, or PRs: [GitHub Issues](https://github.com/arodonnaltd-png/BinaryTrading/issues)
