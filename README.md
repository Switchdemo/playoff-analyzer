# 🏀 Playoff Edge — NBA Prop Bet Analyzer

AI-powered NBA 2026 playoff prop bet analyzer with Underdog Fantasy lines, full rosters for all 8 playoff teams, and AI parlay intelligence.

## Features

- **🏆 Top 5 AI Parlays** — Algorithmic engine scores every prop combination by hit rate, edge, and correlation bonus, then ranks the 5 best parlays by strategy type
- **📊 Player Props** — All active players across NYK, PHI, DET, CLE, SAS, MIN, OKC, LAL with real Underdog Fantasy lines
- **🏟️ Game Lines** — Spreads, totals, moneylines, and win probabilities for all upcoming games
- **🎲 My Parlay Slip** — Build custom parlays with AI validation
- **🚨 Live Injury Tracking** — Embiid OUT, Williams OUT, Doncic OUT flags with usage-shift context
- **🤖 Claude AI Analysis** — On-demand sharp breakdowns for props and parlays

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/playoff-edge.git
cd playoff-edge
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Anthropic API key
```bash
cp .env.example .env
```
Then open `.env` and replace `your_anthropic_api_key_here` with your real key from [console.anthropic.com](https://console.anthropic.com).

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel (free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. In **Environment Variables**, add:
   - `VITE_ANTHROPIC_API_KEY` = your Anthropic API key
4. Click **Deploy** — done ✅

Your app will be live at `https://playoff-edge.vercel.app` (or similar)

## Deploy to Netlify (free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add New Site** → import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. In **Site Settings → Environment Variables**, add `VITE_ANTHROPIC_API_KEY`
6. Deploy ✅

## Tech Stack

- **React 18** + **Vite**
- **Claude AI** (claude-sonnet-4) via Anthropic API
- Data sources: Underdog Fantasy, DraftKings, FanDuel, BetMGM, CBS SportsLine, SportRadar

## Notes

- The AI analysis buttons require a valid Anthropic API key
- Player lines and stats reflect the 2026 NBA Playoff second round (as of May 6-7, 2026)
- For entertainment purposes only — not financial advice

## License

MIT
