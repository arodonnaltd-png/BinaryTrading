import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Settings2, SlidersHorizontal, Zap, X, TrendingUp, TrendingDown,
  Minus, Play, ShieldCheck, Radio, Info, RefreshCw, Circle,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════════
   STYLE — precision instrument panel
   ════════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

  .arome-root {
    --bg: #07090d;
    --panel: #0d1017;
    --panel2: #12161f;
    --panel3: #181e2a;
    --line: rgba(255,255,255,0.055);
    --line2: rgba(255,255,255,0.12);
    --brass: #c9963f;
    --brass-bright: #ecc077;
    --brass-dim: #7a5a29;
    --phosphor: #2fe6a0;
    --signal: #ff5568;
    --ink: #edf1f7;
    --ink-dim: #8c96a8;
    --ink-faint: #4c5566;
    font-family: 'IBM Plex Mono', monospace;
    background: var(--bg);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--line2);
    box-shadow: 0 40px 80px -30px rgba(0,0,0,0.7);
  }
  .arome-root *, .arome-root *::before, .arome-root *::after { box-sizing: border-box; }
  .arome-root button, .arome-root input { font-family: inherit; }
  .arome-root::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 40; opacity: 0.05; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  .disp { font-family: 'Space Grotesk', sans-serif; }
  .tnum { font-variant-numeric: tabular-nums; }

  /* ── ticker tape ── */
  .ticker-wrap { background: #050709; border-bottom: 1px solid var(--line); overflow: hidden; height: 25px; flex-shrink: 0; position: relative; }
  .ticker-wrap::after { content:""; position:absolute; inset:0; background: linear-gradient(90deg, #050709 0%, transparent 4%, transparent 96%, #050709 100%); pointer-events:none; }
  .ticker-track { display: flex; align-items: center; gap: 26px; height: 100%; width: max-content; animation: tickerScroll 38s linear infinite; padding-left: 20px; }
  @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .tick-item { font-size: 9.5px; letter-spacing: 0.04em; display: flex; align-items: center; gap: 6px; color: var(--ink-faint); white-space: nowrap; }
  .tick-sym { color: var(--ink-dim); font-weight: 600; }
  .tick-up { color: var(--phosphor); } .tick-dn { color: var(--signal); }

  /* ── nav ── */
  .nav { background: var(--panel); border-bottom: 1px solid var(--line2); padding: 0 18px; height: 54px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .nav-logo { display: flex; align-items: center; gap: 11px; }
  .logo-mark { width: 27px; height: 27px; border-radius: 7px; background: linear-gradient(155deg, var(--brass-bright), var(--brass) 55%, #7a5a29); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -6px 8px rgba(0,0,0,0.25); position: relative; }
  .logo-mark .dot { width: 6px; height: 6px; border-radius: 50%; background: #07090d; box-shadow: inset 0 1px 1px rgba(0,0,0,0.6); }
  .nav-title { font-weight: 800; font-size: 13px; letter-spacing: 0.1em; color: var(--ink); }
  .nav-sub { font-size: 8.5px; letter-spacing: 0.24em; color: var(--ink-faint); margin-top: 2px; }
  .live-pill { font-size: 8.5px; letter-spacing: 0.15em; color: var(--phosphor); border: 1px solid rgba(47,230,160,0.3); border-radius: 20px; padding: 3px 9px 3px 7px; display: flex; align-items: center; gap: 5px; }
  .live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--phosphor); animation: pulse 1.8s ease-in-out infinite; box-shadow: 0 0 6px var(--phosphor); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
  .nav-right { display: flex; align-items: center; gap: 8px; }
  .nav-clock { font-size: 10.5px; color: var(--ink-faint); letter-spacing: 0.07em; margin-right: 6px; }
  .icon-btn { background: var(--panel2); border: 1px solid var(--line2); color: var(--ink-dim); font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; padding: 7px 13px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all .15s; }
  .icon-btn:hover { border-color: var(--brass); color: var(--brass-bright); background: var(--panel3); }

  /* ── layout ── */
  .main { display: flex; flex: 1; min-height: 0; }
  .sidebar { width: 218px; background: var(--panel); border-right: 1px solid var(--line); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; }
  .side-sec { padding: 15px 14px; border-bottom: 1px solid var(--line); }
  .side-label { font-family: 'Space Grotesk', sans-serif; font-size: 8.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
  .asset-row { display: flex; flex-direction: column; gap: 2px; }
  .asset-item { padding: 9px 10px 8px; border-radius: 8px; border: 1px solid transparent; border-left: 2px solid transparent; cursor: pointer; transition: all .12s; }
  .asset-item:hover { background: var(--panel2); }
  .asset-item.active { background: var(--panel3); border-color: var(--line2); border-left-color: var(--brass); }
  .asset-item-top { display: flex; align-items: baseline; justify-content: space-between; }
  .asset-name { font-size: 11px; font-weight: 700; color: var(--ink); letter-spacing: 0.02em; }
  .asset-price { font-size: 10.5px; color: var(--brass-bright); }
  .asset-item-bot { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; }
  .asset-sub { font-size: 8px; color: var(--ink-faint); letter-spacing: 0.06em; text-transform: uppercase; }
  .asset-chg { font-size: 8.5px; }
  .spark-wrap { margin-top: 6px; height: 16px; }

  .tf-grid { display: flex; gap: 5px; flex-wrap: wrap; }
  .tf-btn { background: var(--panel2); border: 1px solid var(--line2); color: var(--ink-dim); font-size: 10px; padding: 6px 10px; border-radius: 6px; cursor: pointer; transition: all .12s; }
  .tf-btn.active { background: rgba(201,150,63,0.15); border-color: rgba(201,150,63,0.5); color: var(--brass-bright); }
  .gen-btn { width: 100%; background: linear-gradient(135deg, var(--brass-bright), var(--brass)); border: none; color: #0a0d12; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; padding: 12px; border-radius: 10px; cursor: pointer; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 7px; transition: transform .12s, opacity .12s, box-shadow .12s; box-shadow: 0 6px 18px -6px rgba(201,150,63,0.55); }
  .gen-btn:hover { transform: translateY(-1px); opacity: 0.94; }
  .gen-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow:none; }
  .ghost-btn { width: 100%; justify-content: center; margin-top: 8px; }

  /* ── center chart ── */
  .center { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .chart-head { background: var(--panel); border-bottom: 1px solid var(--line); padding: 10px 18px; display: flex; align-items: center; gap: 14px; }
  .chart-sym { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: 0.01em; }
  .chart-px { font-size: 13px; color: var(--brass-bright); }
  .chart-chg { font-size: 10.5px; padding: 3px 9px; border-radius: 5px; font-weight: 600; }
  .up-chip { color: var(--phosphor); background: rgba(47,230,160,0.1); } .dn-chip { color: var(--signal); background: rgba(255,85,104,0.1); }
  .regime-chip { margin-left: auto; font-size: 9px; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--line2); color: var(--ink-dim); display:flex; align-items:center; gap:6px; }
  .chart-body { flex: 1; position: relative; min-height: 0; background: radial-gradient(ellipse 900px 500px at 15% 0%, rgba(201,150,63,0.055), transparent 60%), var(--bg); }
  .chart-tooltip { position: absolute; top: 14px; padding: 8px 11px; background: rgba(13,16,23,0.92); border: 1px solid var(--line2); border-radius: 9px; font-size: 9.5px; pointer-events: none; transform: translateX(-50%); backdrop-filter: blur(4px); white-space: nowrap; box-shadow: 0 10px 24px -10px rgba(0,0,0,0.7); z-index: 10; }
  .chart-tooltip .tt-row { display: flex; gap: 8px; }
  .chart-tooltip .tt-k { color: var(--ink-faint); min-width: 34px; }
  .chart-tooltip .tt-v { color: var(--ink); font-weight: 600; }

  /* ── signal panel ── */
  .signal-panel { width: 312px; background: var(--panel); border-left: 1px solid var(--line); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; }
  .sp-head { padding: 13px 17px 10px; border-bottom: 1px solid var(--line); display:flex; align-items:center; justify-content:space-between; }
  .sp-title { font-family: 'Space Grotesk', sans-serif; font-size: 8.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-faint); }
  .sp-body { padding: 16px 17px; display: flex; flex-direction: column; gap: 16px; }

  .hero-card { background: radial-gradient(ellipse at top, rgba(201,150,63,0.09), transparent 65%), var(--panel2); border: 1px solid var(--line2); border-radius: 16px; padding: 14px 10px 12px; display: flex; flex-direction: column; align-items: center; position: relative; overflow: hidden; }
  .hero-dir-row { display: flex; align-items: center; gap: 7px; margin-top: -8px; }
  .hero-dir { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 0.03em; }
  .hero-sub { font-size: 8.5px; color: var(--ink-faint); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 3px; }

  .ledger { border: 1px solid var(--line2); border-radius: 14px; overflow: hidden; background: var(--panel2); }
  .ledger-head { padding: 9px 13px; border-bottom: 1px solid var(--line); font-family: 'Space Grotesk', sans-serif; font-size: 8.5px; font-weight: 700; letter-spacing: 0.18em; color: var(--ink-faint); text-transform: uppercase; display:flex; align-items:center; justify-content:space-between; }
  .tf-row { display: flex; align-items: center; gap: 10px; padding: 9px 13px; border-bottom: 1px solid var(--line); animation: rowIn .35s ease both; transition: background .12s; }
  .tf-row:last-child { border-bottom: none; }
  .tf-row:hover { background: rgba(255,255,255,0.02); }
  @keyframes rowIn { from{opacity:0; transform: translateX(6px);} to{opacity:1; transform:translateX(0);} }
  .tf-row-mid { flex: 1; min-width: 0; }
  .tf-row-name { font-size: 10.5px; color: var(--ink); letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px; font-weight: 600; }
  .best-tag { font-size: 7px; color: #0a0d12; background: var(--brass-bright); border-radius: 4px; padding: 1.5px 5px; letter-spacing: 0.08em; font-weight: 800; }
  .tf-reason { font-size: 8.8px; color: var(--ink-faint); margin-top: 3px; letter-spacing: 0.01em; line-height: 1.4; }
  .tf-row-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .dir-pill { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.06em; padding: 2.5px 8px; border-radius: 20px; display:flex; align-items:center; gap:4px; }
  .dp-buy { color: var(--phosphor); background: rgba(47,230,160,0.1); border: 1px solid rgba(47,230,160,0.28); }
  .dp-sell { color: var(--signal); background: rgba(255,85,104,0.1); border: 1px solid rgba(255,85,104,0.28); }
  .dp-neu { color: var(--ink-dim); background: rgba(140,150,168,0.08); border: 1px solid rgba(140,150,168,0.2); }
  .tf-conf { font-size: 10.5px; font-weight: 700; }

  .sum-box { border-left: 2px solid var(--brass); background: linear-gradient(90deg, rgba(201,150,63,0.07), transparent 70%); border-radius: 0 10px 10px 0; padding: 10px 13px; }
  .sum-txt { font-size: 10px; color: #cbab72; line-height: 1.7; letter-spacing: 0.015em; }

  .info-panel { background: var(--panel2); border: 1px solid var(--line2); border-radius: 14px; overflow: hidden; }
  .info-head { font-family: 'Space Grotesk', sans-serif; font-size: 8.5px; font-weight: 700; letter-spacing: 0.18em; color: var(--ink-faint); text-transform: uppercase; padding: 9px 13px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 7px; }
  .led { width: 5px; height: 5px; border-radius: 50%; box-shadow: 0 0 5px currentColor; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .info-cell { padding: 8px 13px; font-size: 9.5px; border-bottom: 1px solid var(--line); display:flex; align-items:center; justify-content:space-between; }
  .info-cell:nth-last-child(-n+2) { border-bottom: none; }
  .info-k { color: var(--ink-faint); }
  .info-v { font-weight: 700; }

  .idle-state, .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; padding: 40px 22px; text-align: center; flex: 1; }
  .idle-ring { width: 54px; height: 54px; border-radius: 50%; border: 1px dashed var(--line2); display: flex; align-items: center; justify-content: center; color: var(--ink-faint); }
  .idle-txt { font-size: 10px; color: var(--ink-faint); letter-spacing: 0.06em; line-height: 2; }
  .spin-ring { width: 30px; height: 30px; border: 2px solid var(--line2); border-top-color: var(--brass); border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-lbl { font-size: 9px; color: var(--ink-dim); letter-spacing: 0.14em; text-transform: uppercase; animation: blink 1.4s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }

  /* ── status bar ── */
  .statusbar { background: var(--panel); border-top: 1px solid var(--line); padding: 7px 18px; display: flex; align-items: center; gap: 18px; flex-shrink: 0; flex-wrap: wrap; }
  .sb-item { font-size: 8.5px; color: var(--ink-faint); letter-spacing: 0.06em; display:flex; align-items:center; gap:5px; }
  .sb-ok { color: var(--phosphor); } .sb-warn { color: var(--brass-bright); }

  /* ── modal ── */
  .overlay { position: absolute; inset: 0; background: rgba(3,4,6,0.8); z-index: 50; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
  .modal { background: var(--panel); border: 1px solid var(--line2); border-radius: 18px; width: 490px; max-width: 92%; max-height: 84%; overflow-y: auto; animation: modalIn .2s ease; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6); }
  @keyframes modalIn { from{opacity:0; transform: translateY(12px) scale(0.98);} to{opacity:1; transform:translateY(0) scale(1);} }
  .modal-head { padding: 17px 20px 14px; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 0.04em; color: var(--brass-bright); display:flex; align-items:center; gap:8px; }
  .modal-close { background: none; border: 1px solid var(--line2); color: var(--ink-dim); width: 27px; height: 27px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .12s; }
  .modal-close:hover { border-color: var(--signal); color: var(--signal); }
  .modal-body { padding: 19px 20px; display: flex; flex-direction: column; gap: 19px; }
  .field-group { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); }
  .field-desc { font-size: 9.5px; color: var(--ink-dim); line-height: 1.65; }
  .num-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .num-field label { font-size: 9px; color: var(--ink-faint); display: block; margin-bottom: 4px; letter-spacing: 0.05em; }
  .num-field input { width: 100%; background: var(--panel2); border: 1px solid var(--line2); color: var(--ink); padding: 9px 10px; border-radius: 8px; font-size: 10.5px; outline: none; transition: border-color .12s; }
  .num-field input:focus { border-color: var(--brass); }
  .divider { height: 1px; background: var(--line); }
  .modal-foot { padding: 15px 20px 19px; border-top: 1px solid var(--line); display: flex; gap: 9px; align-items: center; justify-content: flex-end; }
  .btn-secondary { background: var(--panel2); border: 1px solid var(--line2); color: var(--ink-dim); font-family:'Space Grotesk',sans-serif; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; padding: 9px 16px; border-radius: 8px; cursor: pointer; text-transform: uppercase; transition: all .12s; display:flex; align-items:center; gap:6px; }
  .btn-secondary:hover { border-color: var(--line2); color: var(--ink); background: var(--panel3); }
  .btn-primary { background: linear-gradient(135deg, var(--brass-bright), var(--brass)); border: none; color: #0a0d12; font-family:'Space Grotesk',sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; padding: 9px 19px; border-radius: 8px; cursor: pointer; text-transform: uppercase; }
  .bt-result { background: var(--panel3); border: 1px solid var(--line); border-radius: 10px; padding: 13px; font-size: 9.5px; margin-top: 4px; }
  .bt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  @media (max-width: 900px) {
    .sidebar { width: 180px; }
    .signal-panel { width: 262px; }
  }
`;

/* ════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════ */
const ASSETS = [
  { sym: "XAU/USD", name: "Gold", sub: "Commodity", base: 2412, vol: 0.09, digits: 2 },
  { sym: "EUR/USD", name: "Euro", sub: "Forex", base: 1.0852, vol: 0.045, digits: 5 },
  { sym: "GBP/USD", name: "Pound", sub: "Forex", base: 1.2714, vol: 0.05, digits: 5 },
  { sym: "USD/JPY", name: "Yen", sub: "Forex", base: 157.32, vol: 0.06, digits: 3 },
  { sym: "BTC/USD", name: "Bitcoin", sub: "Crypto", base: 64200, vol: 0.6, digits: 0 },
  { sym: "USD/NGN", name: "Naira", sub: "Forex", base: 1531, vol: 0.07, digits: 2 },
  { sym: "WTI/USD", name: "Oil", sub: "Commodity", base: 78.4, vol: 0.35, digits: 2 },
  { sym: "XAG/USD", name: "Silver", sub: "Commodity", base: 29.1, vol: 0.3, digits: 3 },
];
const TIMEFRAMES = [
  { tf: "1", label: "1M" }, { tf: "5", label: "5M" }, { tf: "15", label: "15M" },
  { tf: "60", label: "1H" }, { tf: "240", label: "4H" },
];
const SIGNAL_TFS = ["30 sec", "1 min", "2 min", "5 min", "15 min"];

/* ════════════════════════════════════════════════════════════════════════
   INDICATOR MATH
   ════════════════════════════════════════════════════════════════════════ */
function calcEMA(closes, period) {
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const out = [ema];
  for (let i = period; i < closes.length; i++) { ema = closes[i] * k + ema * (1 - k); out.push(ema); }
  return out;
}
function calcRSI(closes, period = 14) {
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) { const d = closes[i] - closes[i - 1]; if (d >= 0) gains += d; else losses -= d; }
  let avgGain = gains / period, avgLoss = losses / period;
  const rsis = [];
  for (let i = period; i < closes.length; i++) {
    if (i > period) {
      const d = closes[i] - closes[i - 1];
      avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsis.push(100 - 100 / (1 + rs));
  }
  return rsis;
}
function calcMACD(closes) {
  const ema12 = calcEMA(closes, 12), ema26 = calcEMA(closes, 26);
  const offset = closes.length - ema26.length;
  const macdLine = ema26.map((_, i) => ema12[i + offset] - ema26[i]);
  const signal = calcEMA(macdLine, 9);
  const sigOffset = macdLine.length - signal.length;
  const hist = signal.map((_, i) => macdLine[i + sigOffset] - signal[i]);
  return { macd: macdLine.at(-1), signal: signal.at(-1), histogram: hist.at(-1), prevHistogram: hist.at(-2) ?? 0 };
}
function calcBollinger(closes, period = 20, mult = 2) {
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period);
  return { upper: mean + mult * std, middle: mean, lower: mean - mult * std, std };
}
function calcStochastic(candles, kPeriod = 14, dPeriod = 3) {
  if (candles.length < kPeriod) return { k: 50, d: 50 };
  const kValues = [];
  for (let i = kPeriod - 1; i < candles.length; i++) {
    const slice = candles.slice(i - kPeriod + 1, i + 1);
    const hi = Math.max(...slice.map((c) => c.high)), lo = Math.min(...slice.map((c) => c.low));
    kValues.push(hi === lo ? 50 : ((candles[i].close - lo) / (hi - lo)) * 100);
  }
  const dValues = [];
  for (let i = dPeriod - 1; i < kValues.length; i++) dValues.push(kValues.slice(i - dPeriod + 1, i + 1).reduce((a, b) => a + b, 0) / dPeriod);
  return { k: kValues.at(-1), d: dValues.at(-1) ?? kValues.at(-1) };
}
function calcATR(candles, period = 14) {
  const trs = candles.slice(1).map((c, i) => {
    const p = candles[i];
    return Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
  });
  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}
function calcVolumeProfile(candles, period = 20) {
  const vols = candles.map((c) => c.volume || 0);
  const priorWindow = vols.slice(-period - 1, -1);
  const avgVolume = priorWindow.length ? priorWindow.reduce((a, b) => a + b, 0) / priorWindow.length : vols.at(-1) || 1;
  const volume = vols.at(-1) || 0;
  const volRatio = avgVolume > 0 ? volume / avgVolume : 1;
  let obv = 0;
  const obvArr = [0];
  for (let i = 1; i < candles.length; i++) {
    const dir = candles[i].close > candles[i - 1].close ? 1 : candles[i].close < candles[i - 1].close ? -1 : 0;
    obv += dir * (candles[i].volume || 0);
    obvArr.push(obv);
  }
  const lookback = Math.min(6, obvArr.length - 1);
  const obvNow = obvArr.at(-1), obvPast = obvArr.at(-1 - lookback);
  return { volume, avgVolume, volRatio, volSpike: volRatio > 1.4, volDry: volRatio < 0.6, obvRising: obvNow > obvPast, obvFalling: obvNow < obvPast };
}
function detectCandlePattern(candles) {
  const last = candles.at(-1), prev = candles.at(-2), prev2 = candles.at(-3);
  const body = Math.abs(last.close - last.open), range = last.high - last.low || 1e-9;
  const bodyPct = body / range;
  const upperWick = last.high - Math.max(last.open, last.close);
  const lowerWick = Math.min(last.open, last.close) - last.low;
  const bull = last.close > last.open, bear = last.close < last.open;
  if (bodyPct < 0.1) return { pattern: "Doji", bias: "NEUTRAL" };
  if (lowerWick > body * 2 && upperWick < body * 0.3 && bear) return { pattern: "Hammer", bias: "BUY" };
  if (upperWick > body * 2 && lowerWick < body * 0.3 && bull) return { pattern: "Shooting Star", bias: "SELL" };
  if (bull && prev.close < prev.open && last.open < prev.close && last.close > prev.open) return { pattern: "Bullish Engulfing", bias: "BUY" };
  if (bear && prev.close > prev.open && last.open > prev.close && last.close < prev.open) return { pattern: "Bearish Engulfing", bias: "SELL" };
  if (candles.length >= 3 && last.close > last.open && prev.close > prev.open && prev2.close > prev2.open && last.close > prev.close && prev.close > prev2.close) return { pattern: "Three White Soldiers", bias: "BUY" };
  if (candles.length >= 3 && last.close < last.open && prev.close < prev.open && prev2.close < prev2.open && last.close < prev.close && prev.close < prev2.close) return { pattern: "Three Black Crows", bias: "SELL" };
  if (bull && bodyPct > 0.7) return { pattern: "Strong Bullish", bias: "BUY" };
  if (bear && bodyPct > 0.7) return { pattern: "Strong Bearish", bias: "SELL" };
  return { pattern: bull ? "Bullish" : "Bearish", bias: bull ? "BUY" : "SELL" };
}
function findSupportResistance(candles, lookback = 50) {
  const recent = candles.slice(-lookback);
  const resistance = Math.max(...recent.map((c) => c.high));
  const support = Math.min(...recent.map((c) => c.low));
  const last = candles.at(-1).close;
  const range = resistance - support || 1e-9;
  return { resistance, support, position: (last - support) / range };
}
function detectMarketRegime(candles, period = 14) {
  if (candles.length < period) return { regime: "UNKNOWN", trendStrength: 0, volatility: 0, atr: 0 };
  const closes = candles.map((c) => c.close), highs = candles.map((c) => c.high), lows = candles.map((c) => c.low);
  const upMoves = [], downMoves = [];
  for (let i = 1; i < candles.length; i++) { upMoves.push(Math.max(0, highs[i] - highs[i - 1])); downMoves.push(Math.max(0, lows[i - 1] - lows[i])); }
  const su = upMoves.slice(-period).reduce((a, b) => a + b, 0), sd = downMoves.slice(-period).reduce((a, b) => a + b, 0);
  const trendStrength = su + sd > 0 ? (su - sd) / (su + sd) : 0;
  const trs = candles.slice(1).map((c, i) => { const p = candles[i]; return Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)); });
  const atr = trs.slice(-period).reduce((a, b) => a + b, 0) / period;
  const recentCloses = closes.slice(-period);
  const mean = recentCloses.reduce((a, b) => a + b, 0) / period;
  const volatility = (Math.sqrt(recentCloses.reduce((a, b) => a + (b - mean) ** 2, 0) / period) / mean) * 100;
  let regime = "RANGING";
  if (Math.abs(trendStrength) > 0.4) regime = trendStrength > 0 ? "TRENDING_UP" : "TRENDING_DOWN";
  else if (volatility > 2.5) regime = "VOLATILE";
  return { regime, trendStrength, volatility, atr };
}
function calculateRiskLevels(price, atr, slMult, tpMult, balance, riskPercent) {
  const stopLoss = price - atr * slMult;
  const takeProfit = price + atr * tpMult;
  const riskReward = ((takeProfit - price) / (price - stopLoss)).toFixed(2);
  const riskAmount = balance * (riskPercent / 100);
  const dist = Math.abs(price - stopLoss);
  const lot = dist > 0 ? (riskAmount / dist).toFixed(2) : "0.01";
  return { stopLoss, takeProfit, riskReward, lotSize: Math.max(0.01, Math.min(lot, 10)) };
}
function analyzeCandles(candles, settings) {
  const closes = candles.map((c) => c.close);
  const rsiArr = calcRSI(closes, settings.rsiPeriod);
  const rsi = rsiArr.at(-1), rsiPrev = rsiArr.at(-2) ?? rsi;
  const ema9 = calcEMA(closes, 9).at(-1), ema21 = calcEMA(closes, 21).at(-1), ema50 = calcEMA(closes, 50).at(-1);
  const price = closes.at(-1);
  const macd = calcMACD(closes);
  const bb = calcBollinger(closes, settings.bbPeriod);
  const stoch = calcStochastic(candles);
  const atr = calcATR(candles, settings.atrPeriod);
  const candle = detectCandlePattern(candles);
  const sr = findSupportResistance(candles);
  const vol = calcVolumeProfile(candles);
  const emaUptrend = ema9 > ema21 && ema21 > ema50, emaDowntrend = ema9 < ema21 && ema21 < ema50;
  const emaCrossUp = ema9 > ema21;
  const bbPosition = bb.std > 0 ? (price - bb.lower) / (bb.upper - bb.lower) : 0.5;
  const nearUpperBB = bbPosition > 0.85, nearLowerBB = bbPosition < 0.15;
  const macdBullish = macd.histogram > 0 && macd.histogram > macd.prevHistogram;
  const macdBearish = macd.histogram < 0 && macd.histogram < macd.prevHistogram;
  const rsiOversold = rsi < 35, rsiOverbought = rsi > 65, rsiRising = rsi > rsiPrev;
  const nearResistance = sr.position > 0.88, nearSupport = sr.position < 0.12;
  const volatility = (atr / price) * 100;
  return { price, rsi, rsiPrev, rsiOversold, rsiOverbought, rsiRising, ema9, ema21, ema50, emaUptrend, emaDowntrend, emaCrossUp,
    macdHistogram: macd.histogram, macdBullish, macdBearish, bbUpper: bb.upper, bbLower: bb.lower, bbMiddle: bb.middle,
    nearUpperBB, nearLowerBB, bbPosition, stochK: stoch.k, stochD: stoch.d, atr, volatility, candle,
    resistance: sr.resistance, support: sr.support, srPosition: sr.position, nearResistance, nearSupport,
    volume: vol.volume, avgVolume: vol.avgVolume, volRatio: vol.volRatio, volSpike: vol.volSpike, volDry: vol.volDry,
    obvRising: vol.obvRising, obvFalling: vol.obvFalling };
}
function getSignalScore(ind, tfBias) {
  const w = { rsi: 0.26, macd: 0.22, ema: 0.18, bb: 0.13, stoch: 0.09, volume: 0.12 };
  if (tfBias === "fast") { w.rsi = 0.28; w.stoch = 0.13; w.ema = 0.11; w.macd = 0.18; w.bb = 0.09; w.volume = 0.21; }
  if (tfBias === "slow") { w.ema = 0.27; w.macd = 0.25; w.rsi = 0.16; w.bb = 0.1; w.stoch = 0.07; w.volume = 0.15; }
  let score = 0;
  if (ind.rsiOversold || ind.rsiRising) score += w.rsi * 0.5;
  if (ind.rsi < 50 && ind.rsiRising) score += w.rsi * 0.2;
  if (ind.macdBullish) score += w.macd * 0.6;
  if (ind.macdHistogram > 0) score += w.macd * 0.4;
  if (ind.emaUptrend) score += w.ema * 0.7;
  if (ind.emaCrossUp) score += w.ema * 0.3;
  if (ind.nearLowerBB) score += w.bb * 0.6;
  if (ind.bbPosition < 0.3) score += w.bb * 0.4;
  if (ind.stochK < 35 && ind.stochD < 35) score += w.stoch * 0.5;
  if (ind.stochK > ind.stochD && ind.stochK < 50) score += w.stoch * 0.5;
  if (ind.volSpike && ind.obvRising) score += w.volume * 0.65;
  else if (ind.obvRising) score += w.volume * 0.35;
  if (ind.volSpike && ind.candle.bias === "BUY") score += w.volume * 0.25;
  if (ind.volDry) score -= w.volume * 0.2;
  return Math.max(9, Math.min(94, Math.round(score * 100)));
}
function reasonFor(ind) {
  if (ind.volSpike && ind.obvRising) return "Volume spike confirms buying pressure";
  if (ind.volSpike && ind.obvFalling) return "Volume spike confirms selling pressure";
  if (ind.nearLowerBB) return "Price at lower Bollinger band";
  if (ind.nearUpperBB) return "Price at upper Bollinger band";
  if (ind.rsiOversold) return "RSI oversold, momentum turning";
  if (ind.rsiOverbought) return "RSI overbought, momentum fading";
  if (ind.emaUptrend) return "EMA 9/21/50 stacked bullish";
  if (ind.emaDowntrend) return "EMA 9/21/50 stacked bearish";
  if (ind.macdBullish) return "MACD histogram expanding up";
  if (ind.macdBearish) return "MACD histogram expanding down";
  if (ind.nearSupport) return "Price testing range support";
  if (ind.nearResistance) return "Price testing range resistance";
  if (ind.volDry) return "Thin volume, low conviction move";
  return `${ind.candle.pattern} candle pattern`;
}
function buildSignals(ind, regime) {
  const biasFor = (tf) => (tf === "30 sec" || tf === "1 min" ? "fast" : tf === "15 min" ? "slow" : "mid");
  const signals = SIGNAL_TFS.map((tf) => {
    const bias = biasFor(tf);
    let score = getSignalScore(ind, bias);
    let direction = score >= 62 ? "BUY" : score <= 38 ? "SELL" : "NEUTRAL";
    if (direction === "SELL") score = 100 - score;
    if (regime.regime === "VOLATILE" && score > 80) score -= 8;
    if (regime.regime === "TRENDING_UP" && direction === "SELL") score = Math.min(score, 48);
    if (regime.regime === "TRENDING_DOWN" && direction === "BUY") score = Math.min(score, 48);
    if (score < 46) direction = "NEUTRAL";
    score = Math.max(41, Math.min(94, score));
    return { timeframe: tf, direction, confidence: Math.round(score), reason: reasonFor(ind) };
  });
  const buys = signals.filter((s) => s.direction === "BUY").length;
  const sells = signals.filter((s) => s.direction === "SELL").length;
  const best = signals.reduce((a, b) => (b.confidence > a.confidence ? b : a));
  const regimeWord = regime.regime.replace("_", " ").toLowerCase();
  const summary = `${regimeWord.charAt(0).toUpperCase() + regimeWord.slice(1)} conditions with ${regime.volatility.toFixed(2)}% volatility. ${
    buys > sells ? "Confluence leans bullish across shorter timeframes." : sells > buys ? "Confluence leans bearish across shorter timeframes." : "Signals are mixed — wait for confirmation."
  }`;
  return { signals, summary, bestTimeframe: best.timeframe };
}
function runBacktest(candles, settings, balance) {
  if (candles.length < 60) return { error: "Not enough candles" };
  let bal = balance, peak = balance, maxDD = 0, wins = 0, losses = 0;
  const trades = [];
  for (let i = 50; i < candles.length - 1; i++) {
    const slice = candles.slice(i - 50, i);
    const ind = analyzeCandles(slice, settings);
    const score = getSignalScore(ind, "mid");
    let direction = null;
    if (score > 68) direction = "BUY"; else if (score < 40) direction = "SELL";
    if (!direction) continue;
    const entry = candles[i].close, exit = candles[i + 1].close;
    const move = ((exit - entry) / entry) * 100;
    const correct = (direction === "BUY" && move > 0) || (direction === "SELL" && move < 0);
    const signedPnl = direction === "BUY" ? (move / 100) * entry : (-move / 100) * entry;
    bal += signedPnl;
    if (bal > peak) peak = bal;
    maxDD = Math.max(maxDD, ((peak - bal) / peak) * 100);
    correct ? wins++ : losses++;
    trades.push({ pnl: signedPnl });
  }
  const total = wins + losses;
  const returns = trades.map((t) => t.pnl);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const variance = returns.reduce((a, b) => a + (b - avgReturn) ** 2, 0) / (returns.length || 1);
  const sharpe = Math.sqrt(variance) > 0 ? (avgReturn / Math.sqrt(variance)).toFixed(2) : "0.00";
  return {
    totalTrades: total, wins, losses, winRate: total ? ((wins / total) * 100).toFixed(1) : "0.0",
    maxDrawdown: maxDD.toFixed(2), sharpeRatio: sharpe, finalBalance: bal.toFixed(2), initialBalance: balance,
    profitReturn: (((bal - balance) / balance) * 100).toFixed(2),
  };
}

/* ════════════════════════════════════════════════════════════════════════
   SIMULATED CANDLE ENGINE
   ════════════════════════════════════════════════════════════════════════ */
function seededRandom(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function genCandles(asset, tfMinutes, count = 220, seedOffset = 0) {
  const rand = seededRandom(asset.base * 1000 + tfMinutes * 7 + seedOffset + 1);
  const candles = [];
  let price = asset.base;
  let drift = 0;
  const now = Math.floor(Date.now() / 1000);
  const stepSec = Number(tfMinutes) * 60;
  const baseVolume = asset.sub === "Crypto" ? 8000 : asset.sub === "Commodity" ? 3200 : 5200;
  for (let i = 0; i < count; i++) {
    if (i % 22 === 0) drift = (rand() - 0.5) * 0.6;
    const noise = (rand() - 0.5) * asset.vol;
    const change = drift * asset.vol * 0.4 + noise;
    const open = price;
    const close = Math.max(open * 0.0005, open + change);
    const high = Math.max(open, close) + Math.abs(noise) * rand() * 0.6;
    const low = Math.min(open, close) - Math.abs(noise) * rand() * 0.6;
    price = close;
    const spike = rand() > 0.9 ? 1.6 + rand() * 1.8 : 1;
    const volume = Math.round(baseVolume * (0.5 + rand()) * (0.6 + Math.abs(change) / asset.vol) * spike);
    candles.push({ time: now - (count - i) * stepSec, open, high, low, close: Math.max(close, 0.0001), volume });
  }
  return candles;
}

/* ════════════════════════════════════════════════════════════════════════
   VISUAL COMPONENTS
   ════════════════════════════════════════════════════════════════════════ */
function dirColor(dir) { return dir === "BUY" ? "var(--phosphor)" : dir === "SELL" ? "var(--signal)" : "var(--ink-dim)"; }
function gaugeColor(conf, dir) { if (dir === "NEUTRAL") return "#8c96a8"; return conf >= 72 ? "#2fe6a0" : conf >= 55 ? "#c9963f" : "#ff5568"; }

const GSTART = 210, GSWEEP = 240;
function polarPt(cx, cy, r, angleDeg) { const rad = (angleDeg * Math.PI) / 180; return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }; }
function arcPath(cx, cy, r, a1, a2) {
  const p1 = polarPt(cx, cy, r, a1), p2 = polarPt(cx, cy, r, a2);
  const large = Math.abs(a1 - a2) > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}
function angleForValue(v) { return GSTART - (Math.max(0, Math.min(100, v)) / 100) * GSWEEP; }

function Gauge({ value = 50, color = "#c9963f", size = 150, hero = false }) {
  const cx = 100, cy = 106, r = 78;
  const valueAngle = angleForValue(value);
  const zones = [{ from: 0, to: 45, color: "#ff5568" }, { from: 45, to: 68, color: "#c9963f" }, { from: 68, to: 100, color: "#2fe6a0" }];
  const ticks = hero ? Array.from({ length: 11 }, (_, i) => i * 10) : [];
  const needle = polarPt(cx, cy, r - 16, valueAngle);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <path d={arcPath(cx, cy, r, GSTART, GSTART - GSWEEP)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={hero ? 10 : 7} strokeLinecap="round" />
      {hero && zones.map((z, i) => (
        <path key={i} d={arcPath(cx, cy, r + 14, angleForValue(z.from), angleForValue(z.to))} fill="none" stroke={z.color} strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
      ))}
      <path d={arcPath(cx, cy, r, GSTART, valueAngle)} fill="none" stroke={color} strokeWidth={hero ? 10 : 7} strokeLinecap="round"
        style={{ transition: "d .8s cubic-bezier(.22,1,.36,1)", filter: hero ? `drop-shadow(0 0 7px ${color}90)` : "none" }} />
      {ticks.map((t) => {
        const a = angleForValue(t);
        const major = t === 0 || t === 50 || t === 100;
        const p1 = polarPt(cx, cy, r - 20, a), p2 = polarPt(cx, cy, r - (major ? 31 : 26), a);
        return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={major ? "#8c96a8" : "#4c5566"} strokeWidth={major ? 1.6 : 1} />;
      })}
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={color} strokeWidth={hero ? 3 : 2.2} strokeLinecap="round" style={{ transition: "all .8s cubic-bezier(.22,1,.36,1)" }} />
      <circle cx={cx} cy={cy} r={hero ? 7 : 4.5} fill="#12161f" stroke={color} strokeWidth="2.4" />
      <circle cx={cx} cy={cy} r={hero ? 2.4 : 1.6} fill={color} />
      {hero && (
        <>
          <text x={cx} y={cy + 44} textAnchor="middle" fontSize="36" fontWeight="800" fill={color} fontFamily="'Space Grotesk',sans-serif" letterSpacing="-1.5">{Math.round(value)}</text>
          <text x={cx} y={cy + 62} textAnchor="middle" fontSize="9" fill="#4c5566" letterSpacing="3" fontFamily="'IBM Plex Mono',monospace">CONFIDENCE</text>
        </>
      )}
    </svg>
  );
}

function Sparkline({ data, color, width = 100, height = 16 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(" ");
  const areaPts = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={areaPts} fill={color} opacity="0.08" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Candles({ candles, digits, hoverIdx }) {
  const W = 760, H = 340, pad = 30;
  if (!candles || candles.length === 0) return null;
  const priceH = H * 0.72;
  const volTop = priceH + 16;
  const volH = H - volTop - 8;
  const highs = candles.map((c) => c.high), lows = candles.map((c) => c.low);
  const maxP = Math.max(...highs), minP = Math.min(...lows);
  const range = maxP - minP || 1;
  const maxVol = Math.max(...candles.map((c) => c.volume || 1));
  const cw = (W - pad * 2) / candles.length;
  const y = (p) => pad + (1 - (p - minP) / range) * (priceH - pad);
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const hc = hoverIdx != null ? candles[hoverIdx] : null;
  const hx = hoverIdx != null ? pad + hoverIdx * cw + cw / 2 : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
      {gridLines.map((g, i) => (
        <line key={i} x1={pad} x2={W - pad} y1={pad + g * (priceH - pad)} y2={pad + g * (priceH - pad)} stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
      ))}
      {gridLines.map((g, i) => (
        <text key={`t${i}`} x={W - pad + 4} y={pad + g * (priceH - pad) + 3} fontSize="9" fill="#4c5566">{(maxP - g * range).toFixed(digits)}</text>
      ))}
      {candles.map((c, i) => {
        const x = pad + i * cw + cw / 2;
        const up = c.close >= c.open;
        const color = up ? "#2fe6a0" : "#ff5568";
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyBot = y(Math.min(c.open, c.close));
        return (
          <g key={i} opacity={hoverIdx != null && hoverIdx !== i ? 0.55 : 1}>
            <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1" opacity="0.85" />
            <rect x={x - cw * 0.32} y={bodyTop} width={cw * 0.64} height={Math.max(1.2, bodyBot - bodyTop)} fill={color} opacity="0.95" />
          </g>
        );
      })}
      <text x={pad} y={volTop - 4} fontSize="8" fill="#4c5566" letterSpacing="2">VOLUME</text>
      {candles.map((c, i) => {
        const x = pad + i * cw + cw / 2;
        const up = c.close >= c.open;
        const color = up ? "#2fe6a0" : "#ff5568";
        const barH = Math.max(1, ((c.volume || 0) / maxVol) * volH);
        return <rect key={`v${i}`} x={x - cw * 0.32} y={volTop + volH - barH} width={cw * 0.64} height={barH} fill={color} opacity={hoverIdx != null && hoverIdx !== i ? 0.28 : 0.55} />;
      })}
      {hc && (
        <g>
          <line x1={hx} x2={hx} y1={pad} y2={volTop + volH} stroke="#ecc077" strokeDasharray="3 3" strokeWidth="1" opacity="0.55" />
          <line x1={pad} x2={W - pad} y1={y(hc.close)} y2={y(hc.close)} stroke="#ecc077" strokeDasharray="3 3" strokeWidth="1" opacity="0.35" />
          <circle cx={hx} cy={y(hc.close)} r="3" fill="#ecc077" />
        </g>
      )}
    </svg>
  );
}

export default function AromeTerminal() {
  const [assetIdx, setAssetIdx] = useState(0);
  const [tf, setTf] = useState("1");
  const [seedTick, setSeedTick] = useState(0);
  const [livePrices, setLivePrices] = useState(() => Object.fromEntries(ASSETS.map((a) => [a.sym, { price: a.base, chg: 0 }] )));
  const [priceHistory, setPriceHistory] = useState(() => Object.fromEntries(ASSETS.map((a) => [a.sym, Array(22).fill(a.base)])));
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [regime, setRegime] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [risk, setRisk] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [hoverIdx, setHoverIdx] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [backendUrl, setBackendUrl] = useState("");

  const [cfg, setCfg] = useState({ balance: 1000, riskPercent: 2, rsiPeriod: 14, bbPeriod: 20, atrPeriod: 14, slMult: 1.5, tpMult: 2.5 });
  const [backtest, setBacktest] = useState(null);
  const [backtestBusy, setBacktestBusy] = useState(false);

  const [clock, setClock] = useState("");
  const asset = ASSETS[assetIdx];

  const candles = useMemo(() => genCandles(asset, tf, 220, seedTick), [asset, tf, seedTick]);

  useEffect(() => {
    const t = () => setClock(new Date().toLocaleTimeString("en-GB", { hour12: false }) + " WAT");
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLivePrices((prev) => {
        const next = { ...prev };
        ASSETS.forEach((a) => {
          const cur = prev[a.sym].price;
          const move = (Math.random() - 0.5) * a.vol * 0.15;
          const p = Math.max(cur + move, 0.0001);
          next[a.sym] = { price: p, chg: ((p - a.base) / a.base) * 100 };
        });
        return next;
      });
      setPriceHistory((prev) => {
        const next = {};
        ASSETS.forEach((a) => { next[a.sym] = [...prev[a.sym].slice(-21), livePrices[a.sym]?.price ?? a.base]; });
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [livePrices]);

  const runAnalysis = useCallback(() => {
    setStatus("loading"); setErrMsg("");
    setTimeout(() => {
      try {
        const ind = analyzeCandles(candles, cfg);
        const reg = detectMarketRegime(candles);
        const rl = calculateRiskLevels(ind.price, ind.atr, cfg.slMult, cfg.tpMult, cfg.balance, cfg.riskPercent);
        const built = buildSignals(ind, reg);
        setIndicators(ind); setRegime(reg); setRisk(rl); setResult(built);
        setStatus("done");
      } catch (e) { setErrMsg(e.message || "Analysis failed"); setStatus("error"); }
    }, 650);
  }, [candles, cfg]);

  const runBacktestNow = useCallback(() => {
    setBacktestBusy(true);
    setTimeout(() => { setBacktest(runBacktest(candles, cfg, cfg.balance)); setBacktestBusy(false); }, 500);
  }, [candles, cfg]);

  const onChartMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const idx = Math.max(0, Math.min(candles.length - 1, Math.floor(fx * candles.length)));
    setHoverIdx(idx);
  };

  const last = candles.at(-1), first = candles[0];
  const chgPct = (((last.close - first.open) / first.open) * 100).toFixed(2);
  const hc = hoverIdx != null ? candles[hoverIdx] : null;

  const overall = result ? (() => {
    const buys = result.signals.filter((s) => s.direction === "BUY").length;
    const sells = result.signals.filter((s) => s.direction === "SELL").length;
    return buys > sells ? "BUY" : sells > buys ? "SELL" : "NEUTRAL";
  })() : null;
  const overallConf = result ? Math.round(result.signals.reduce((a, s) => a + s.confidence, 0) / result.signals.length) : 0;

  return (
    <div className="arome-root">
      <style>{CSS}</style>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...ASSETS, ...ASSETS].map((a, i) => {
            const lp = livePrices[a.sym]; const up = lp.chg >= 0;
            return (
              <span className="tick-item" key={i}>
                <span className="tick-sym">{a.sym}</span>{lp.price.toFixed(a.digits)}
                <span className={up ? "tick-up" : "tick-dn"}>{up ? "▲" : "▼"} {Math.abs(lp.chg).toFixed(2)}%</span>
              </span>
            );
          })}
        </div>
      </div>

      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-mark"><div className="dot" /></div>
          <div>
            <div className="nav-title disp">AROME SIGNAL</div>
            <div className="nav-sub">TERMINAL · SIMULATED FEED</div>
          </div>
          <span className="live-pill"><span className="live-dot" />LIVE DEMO</span>
        </div>
        <div className="nav-right">
          <span className="nav-clock tnum">{clock}</span>
          <button className="icon-btn" onClick={() => setAdvancedOpen(true)}><SlidersHorizontal size={13} />Advanced</button>
          <button className="icon-btn" onClick={() => setSettingsOpen(true)}><Settings2 size={13} />Connection</button>
        </div>
      </nav>

      <div className="main">
        <aside className="sidebar">
          <div className="side-sec">
            <div className="side-label">Assets</div>
            <div className="asset-row">
              {ASSETS.map((a, i) => {
                const lp = livePrices[a.sym]; const up = lp.chg >= 0;
                return (
                  <div key={a.sym} className={`asset-item${i === assetIdx ? " active" : ""}`} onClick={() => { setAssetIdx(i); setResult(null); setStatus("idle"); }}>
                    <div className="asset-item-top">
                      <span className="asset-name">{a.sym}</span>
                      <span className="asset-price tnum">{lp.price.toFixed(a.digits)}</span>
                    </div>
                    <div className="asset-item-bot">
                      <span className="asset-sub">{a.sub}</span>
                      <span className="asset-chg tnum" style={{ color: up ? "var(--phosphor)" : "var(--signal)" }}>{up ? "+" : ""}{lp.chg.toFixed(2)}%</span>
                    </div>
                    <div className="spark-wrap"><Sparkline data={priceHistory[a.sym]} color={up ? "#2fe6a0" : "#ff5568"} /></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="side-sec">
            <div className="side-label">Timeframe</div>
            <div className="tf-grid">
              {TIMEFRAMES.map((t) => (
                <button key={t.tf} className={`tf-btn${tf === t.tf ? " active" : ""}`} onClick={() => { setTf(t.tf); setResult(null); setStatus("idle"); }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div className="side-sec" style={{ borderBottom: "none", marginTop: "auto" }}>
            <button className="gen-btn" onClick={runAnalysis} disabled={status === "loading"}>
              <Zap size={14} />{status === "loading" ? "Analyzing…" : "Generate Signals"}
            </button>
            <button className="icon-btn ghost-btn" onClick={() => setSeedTick((s) => s + 1)}><RefreshCw size={12} />New Candles</button>
          </div>
        </aside>

        <div className="center">
          <div className="chart-head">
            <span className="chart-sym disp">{asset.sym}</span>
            <span className="chart-px tnum">{last.close.toFixed(asset.digits)}</span>
            <span className={`chart-chg tnum ${chgPct >= 0 ? "up-chip" : "dn-chip"}`}>{chgPct >= 0 ? "+" : ""}{chgPct}%</span>
            {regime && <span className="regime-chip"><Circle size={6} fill="currentColor" />{regime.regime.replace("_", " ")}</span>}
          </div>
          <div className="chart-body" onMouseMove={onChartMove} onMouseLeave={() => setHoverIdx(null)}>
            <Candles candles={candles} digits={asset.digits} hoverIdx={hoverIdx} />
            {hc && (
              <div className="chart-tooltip" style={{ left: `${((hoverIdx + 0.5) / candles.length) * 100}%` }}>
                <div className="tt-row"><span className="tt-k">O</span><span className="tt-v tnum">{hc.open.toFixed(asset.digits)}</span></div>
                <div className="tt-row"><span className="tt-k">H</span><span className="tt-v tnum">{hc.high.toFixed(asset.digits)}</span></div>
                <div className="tt-row"><span className="tt-k">L</span><span className="tt-v tnum">{hc.low.toFixed(asset.digits)}</span></div>
                <div className="tt-row"><span className="tt-k">C</span><span className="tt-v tnum">{hc.close.toFixed(asset.digits)}</span></div>
                <div className="tt-row"><span className="tt-k">Vol</span><span className="tt-v tnum">{hc.volume.toLocaleString()}</span></div>
              </div>
            )}
          </div>
        </div>

        <aside className="signal-panel">
          <div className="sp-head"><span className="sp-title">Signal Output</span></div>

          {status === "idle" && (
            <div className="idle-state">
              <div className="idle-ring">📡</div>
              <div className="idle-txt">Pick an asset,<br />set your timeframe,<br />then Generate Signals.</div>
            </div>
          )}
          {status === "loading" && (
            <div className="loading-state"><div className="spin-ring" /><div className="loading-lbl">Reading indicators…</div></div>
          )}
          {status === "error" && (
            <div className="idle-state"><div className="idle-ring" style={{ borderColor: "var(--signal)" }}>⚠</div><div className="idle-txt" style={{ color: "var(--signal)" }}>{errMsg}</div></div>
          )}

          {status === "done" && result && (
            <div className="sp-body">
              <div className="hero-card">
                <Gauge value={overallConf} size={172} hero color={gaugeColor(overallConf, overall)} />
                <div className="hero-dir-row">
                  {overall === "BUY" ? <TrendingUp size={16} color={dirColor(overall)} /> : overall === "SELL" ? <TrendingDown size={16} color={dirColor(overall)} /> : <Minus size={16} color={dirColor(overall)} />}
                  <span className="hero-dir disp" style={{ color: dirColor(overall) }}>{overall}</span>
                </div>
                <div className="hero-sub">{asset.sym} · {result.bestTimeframe} best read</div>
              </div>

              <div className="ledger">
                <div className="ledger-head"><span>Timeframe Ladder</span><span>{result.signals.length} reads</span></div>
                {result.signals.map((s, i) => (
                  <div className="tf-row" style={{ animationDelay: `${i * 0.05}s` }} key={s.timeframe}>
                    <Gauge value={s.confidence} size={44} color={gaugeColor(s.confidence, s.direction)} />
                    <div className="tf-row-mid">
                      <div className="tf-row-name">{s.timeframe}{s.timeframe === result.bestTimeframe && <span className="best-tag">BEST</span>}</div>
                      <div className="tf-reason">{s.reason}</div>
                    </div>
                    <div className="tf-row-right">
                      <span className={`dir-pill ${s.direction === "BUY" ? "dp-buy" : s.direction === "SELL" ? "dp-sell" : "dp-neu"}`}>
                        {s.direction === "BUY" ? <TrendingUp size={10} /> : s.direction === "SELL" ? <TrendingDown size={10} /> : <Minus size={10} />}{s.direction}
                      </span>
                      <span className="tf-conf tnum" style={{ color: gaugeColor(s.confidence, s.direction) }}>{s.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sum-box"><div className="sum-txt">{result.summary}</div></div>

              {risk && (
                <div className="info-panel">
                  <div className="info-head"><span className="led" style={{ background: "var(--brass)", color: "var(--brass)" }} />Risk Management</div>
                  <div className="info-grid">
                    <div className="info-cell"><span className="info-k">Stop loss</span><span className="info-v tnum">{risk.stopLoss.toFixed(asset.digits)}</span></div>
                    <div className="info-cell"><span className="info-k">Take profit</span><span className="info-v tnum">{risk.takeProfit.toFixed(asset.digits)}</span></div>
                    <div className="info-cell"><span className="info-k">R : R</span><span className="info-v tnum">{risk.riskReward}:1</span></div>
                    <div className="info-cell"><span className="info-k">Lot ({cfg.riskPercent}%)</span><span className="info-v tnum">{risk.lotSize}</span></div>
                  </div>
                </div>
              )}

              {indicators && (
                <div className="info-panel">
                  <div className="info-head"><span className="led" style={{ background: "var(--phosphor)", color: "var(--phosphor)" }} />Live Indicators</div>
                  <div className="info-grid">
                    <div className="info-cell"><span className="info-k">RSI(14)</span><span className="info-v tnum" style={{ color: indicators.rsi < 35 ? "var(--phosphor)" : indicators.rsi > 65 ? "var(--signal)" : "var(--ink)" }}>{indicators.rsi.toFixed(1)}</span></div>
                    <div className="info-cell"><span className="info-k">EMA trend</span><span className="info-v" style={{ color: indicators.emaUptrend ? "var(--phosphor)" : indicators.emaDowntrend ? "var(--signal)" : "var(--ink)" }}>{indicators.emaUptrend ? "UP" : indicators.emaDowntrend ? "DOWN" : "MIXED"}</span></div>
                    <div className="info-cell"><span className="info-k">MACD</span><span className="info-v" style={{ color: indicators.macdBullish ? "var(--phosphor)" : indicators.macdBearish ? "var(--signal)" : "var(--ink)" }}>{indicators.macdBullish ? "BULL" : indicators.macdBearish ? "BEAR" : "FLAT"}</span></div>
                    <div className="info-cell"><span className="info-k">Stoch K</span><span className="info-v tnum">{indicators.stochK.toFixed(1)}</span></div>
                    <div className="info-cell"><span className="info-k">Volume</span><span className="info-v tnum" style={{ color: indicators.volSpike ? "var(--phosphor)" : indicators.volDry ? "var(--signal)" : "var(--ink)" }}>{indicators.volRatio.toFixed(2)}×</span></div>
                    <div className="info-cell"><span className="info-k">OBV</span><span className="info-v" style={{ color: indicators.obvRising ? "var(--phosphor)" : "var(--signal)" }}>{indicators.obvRising ? "RISING" : "FALLING"}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      <div className="statusbar">
        <span className="sb-item"><Circle size={6} fill="currentColor" className="sb-ok" style={{ color: "var(--phosphor)" }} />Feed: <span className="sb-ok">Simulated</span></span>
        <span className="sb-item">Engine: <span className="sb-ok">Technical (client-side)</span></span>
        <span className="sb-item">Asset: {asset.sym}</span>
        <span className="sb-item">Interval: {TIMEFRAMES.find((t) => t.tf === tf)?.label}</span>
      </div>

      {settingsOpen && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setSettingsOpen(false)}>
          <div className="modal">
            <div className="modal-head"><span className="modal-title disp"><Radio size={15} />Data Connection</span><button className="modal-close" onClick={() => setSettingsOpen(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <div className="field-group">
                <span className="field-label">Current mode</span>
                <div className="field-desc">This terminal runs entirely in your browser, so it's on <strong style={{ color: "var(--phosphor)" }}>simulated market data</strong> — every chart, indicator and signal you see is computed live from generated candles using the real technical engine. Nothing here calls an external service.</div>
              </div>
              <div className="divider" />
              <div className="field-group">
                <span className="field-label">Wiring up live data</span>
                <div className="field-desc">To point this at real prices and your own AI provider, host a small backend that holds your API keys as server-side environment variables, then have this UI call your backend instead of providers directly. Pasting provider keys into a browser app exposes them to anyone with dev tools open.</div>
                <div className="num-field"><label>Your backend base URL (optional, stored only in this session)</label><input value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} placeholder="https://your-app.vercel.app" /></div>
              </div>
            </div>
            <div className="modal-foot"><button className="btn-secondary" onClick={() => setSettingsOpen(false)}>Close</button></div>
          </div>
        </div>
      )}

      {advancedOpen && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setAdvancedOpen(false)}>
          <div className="modal" style={{ width: 540 }}>
            <div className="modal-head"><span className="modal-title disp"><SlidersHorizontal size={15} />Advanced Settings</span><button className="modal-close" onClick={() => setAdvancedOpen(false)}><X size={14} /></button></div>
            <div className="modal-body">
              <div className="field-group">
                <span className="field-label">Risk Management</span>
                <div className="field-desc">Feeds position sizing and stop-loss / take-profit distances shown in the signal panel.</div>
                <div className="num-grid">
                  <div className="num-field"><label>Account balance ($)</label><input type="number" value={cfg.balance} onChange={(e) => setCfg({ ...cfg, balance: Number(e.target.value) || 0 })} /></div>
                  <div className="num-field"><label>Risk per trade (%)</label><input type="number" step="0.5" value={cfg.riskPercent} onChange={(e) => setCfg({ ...cfg, riskPercent: Number(e.target.value) || 0 })} /></div>
                  <div className="num-field"><label>Stop-loss × ATR</label><input type="number" step="0.5" value={cfg.slMult} onChange={(e) => setCfg({ ...cfg, slMult: Number(e.target.value) || 0 })} /></div>
                  <div className="num-field"><label>Take-profit × ATR</label><input type="number" step="0.5" value={cfg.tpMult} onChange={(e) => setCfg({ ...cfg, tpMult: Number(e.target.value) || 0 })} /></div>
                </div>
              </div>
              <div className="divider" />
              <div className="field-group">
                <span className="field-label">Indicator Periods</span>
                <div className="field-desc">Weights: RSI 26% · MACD 22% · EMA 18% · Bollinger 13% · Stochastic 9% · Volume 12% — volume carries more weight on the 30s/1m signals, trend indicators carry more on 15m.</div>
                <div className="num-grid">
                  <div className="num-field"><label>RSI period</label><input type="number" value={cfg.rsiPeriod} onChange={(e) => setCfg({ ...cfg, rsiPeriod: Number(e.target.value) || 14 })} /></div>
                  <div className="num-field"><label>Bollinger period</label><input type="number" value={cfg.bbPeriod} onChange={(e) => setCfg({ ...cfg, bbPeriod: Number(e.target.value) || 20 })} /></div>
                  <div className="num-field"><label>ATR period</label><input type="number" value={cfg.atrPeriod} onChange={(e) => setCfg({ ...cfg, atrPeriod: Number(e.target.value) || 14 })} /></div>
                </div>
              </div>
              <div className="divider" />
              <div className="field-group">
                <span className="field-label">Backtest ({asset.sym} · simulated history)</span>
                <div className="field-desc">Runs the same weighted-scoring engine over the generated candle history to sanity-check win rate, drawdown and Sharpe ratio.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-secondary" onClick={runBacktestNow} disabled={backtestBusy}><Play size={12} />{backtestBusy ? "Running…" : "Run backtest"}</button>
                </div>
                {backtest && !backtest.error && (
                  <div className="bt-result">
                    <div className="bt-grid">
                      <div className="info-cell" style={{ border: "none", padding: 0 }}><span className="info-k">Total trades</span><span className="info-v tnum">{backtest.totalTrades}</span></div>
                      <div className="info-cell" style={{ border: "none", padding: 0 }}><span className="info-k">Win rate</span><span className="info-v tnum" style={{ color: "var(--phosphor)" }}>{backtest.winRate}%</span></div>
                      <div className="info-cell" style={{ border: "none", padding: 0 }}><span className="info-k">Wins / losses</span><span className="info-v tnum">{backtest.wins} / {backtest.losses}</span></div>
                      <div className="info-cell" style={{ border: "none", padding: 0 }}><span className="info-k">Max drawdown</span><span className="info-v tnum" style={{ color: "var(--signal)" }}>{backtest.maxDrawdown}%</span></div>
                      <div className="info-cell" style={{ border: "none", padding: 0 }}><span className="info-k">Sharpe ratio</span><span className="info-v tnum">{backtest.sharpeRatio}</span></div>
                      <div className="info-cell" style={{ border: "none", padding: 0 }}><span className="info-k">Return</span><span className="info-v tnum" style={{ color: backtest.profitReturn >= 0 ? "var(--phosphor)" : "var(--signal)" }}>{backtest.profitReturn}%</span></div>
                    </div>
                  </div>
                )}
                {backtest && backtest.error && <div className="field-desc" style={{ color: "var(--signal)" }}>{backtest.error}</div>}
              </div>
              <div className="divider" />
              <div className="field-group">
                <span className="field-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><Info size={12} />Note</span>
                <div className="field-desc">Real-time Telegram alerts and always-on execution tracking need a persistent backend to run while your browser tab is closed — wire those into your own server once you've connected live data.</div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-secondary" onClick={() => setAdvancedOpen(false)}>Close</button>
              <button className="btn-primary" onClick={() => setAdvancedOpen(false)}><ShieldCheck size={12} style={{ marginRight: 6 }} />Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
