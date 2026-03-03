import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const MODULES = ["INSTITUTIONAL FLOW", "LIQUIDITY RADAR", "INTEGRITY SCORE", "TERMINAL LOG"];

export default function SmartMoneyTerminal() {
  const [activeModule, setActiveModule] = useState(0);
  const [inputData, setInputData] = useState("");
  const [assetTicker, setAssetTicker] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([
    { time: new Date().toISOString().slice(11, 19), msg: "SYSTEM ONLINE — Smart Money Intelligence Terminal v1.0", type: "sys" },
    { time: new Date().toISOString().slice(11, 19), msg: "Claude Opus 4 engine loaded. Extended thinking: ACTIVE", type: "sys" },
    { time: new Date().toISOString().slice(11, 19), msg: "Awaiting input data...", type: "info" },
  ]);
  const [thinkingDots, setThinkingDots] = useState("");
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setThinkingDots(d => d.length >= 6 ? "" : d + "·");
    }, 200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const addLog = (msg, type = "info") => {
    const time = new Date().toISOString().slice(11, 19);
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  const handleAnalyze = async () => {
    if (!inputData.trim()) return;
    setIsLoading(true);
    setAnalysisResult(null);
    addLog(`Initiating analysis for: ${assetTicker || "UNSPECIFIED ASSET"}`, "exec");
    addLog("Engaging Claude Opus 4 extended thinking engine...", "exec");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData, assetTicker, module: MODULES[activeModule] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysisResult(data);
      addLog("Analysis complete. Results rendered.", "success");
      addLog(`Market Integrity Score: ${data.integrityScore}/100`, "success");
    } catch (err) {
      addLog(`ERROR: ${err.message}`, "error");
    }
    setIsLoading(false);
  };

  const scoreColor = (score) => {
    if (score >= 70) return "#4ade80";
    if (score >= 40) return "#fbbf24";
    return "#f87171";
  };

  const scoreLabel = (score) => {
    if (score >= 70) return "LEGITIMATE MOVE";
    if (score >= 40) return "SUSPICIOUS ACTIVITY";
    return "HIGH MANIPULATION RISK";
  };

  return (
    <>
      <Head>
        <title>Smart Money Intelligence Terminal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cormorant+Garamond:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cream: #F5ECD7;
          --cream-dim: #E8D9B8;
          --cream-deep: #D4C49A;
          --gold: #B8860B;
          --gold-bright: #D4A017;
          --gold-pale: #C9A84C;
          --dark: #0A0804;
          --dark-2: #120F07;
          --dark-3: #1C1710;
          --dark-4: #241E12;
          --dark-5: #2E2718;
          --border: rgba(184,134,11,0.3);
          --border-bright: rgba(184,134,11,0.7);
          --green: #4ade80;
          --red: #f87171;
          --yellow: #fbbf24;
          --mono: 'Share Tech Mono', monospace;
          --serif: 'Cormorant Garamond', serif;
          --space: 'Space Mono', monospace;
        }
        html, body { background: var(--dark); color: var(--cream); font-family: var(--mono); height: 100%; overflow-x: hidden; }
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background: 
            radial-gradient(ellipse at 20% 20%, rgba(184,134,11,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(184,134,11,0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--dark-2); }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

        .scanline {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
        }
        .terminal-glow { box-shadow: 0 0 30px rgba(184,134,11,0.08), inset 0 0 30px rgba(0,0,0,0.3); }
        .panel { background: var(--dark-2); border: 1px solid var(--border); }
        .panel-bright { border-color: var(--border-bright); }
        .gold-text { color: var(--gold-bright); }
        .cream-text { color: var(--cream); }
        .dim-text { color: var(--cream-deep); }
        .label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); font-family: var(--space); }
        
        .module-btn {
          font-family: var(--space); font-size: 9px; letter-spacing: 0.15em;
          padding: 8px 16px; cursor: pointer; border: 1px solid var(--border);
          background: transparent; color: var(--cream-deep);
          transition: all 0.2s; text-transform: uppercase;
        }
        .module-btn:hover { border-color: var(--gold); color: var(--gold-bright); }
        .module-btn.active { background: var(--dark-4); border-color: var(--gold-bright); color: var(--gold-bright); }

        .data-input {
          width: 100%; background: var(--dark-3); border: 1px solid var(--border);
          color: var(--cream); font-family: var(--mono); font-size: 11px;
          padding: 12px; resize: vertical; outline: none;
          transition: border-color 0.2s; line-height: 1.6;
        }
        .data-input:focus { border-color: var(--gold); }
        .data-input::placeholder { color: rgba(213,196,154,0.3); }

        .ticker-input {
          background: var(--dark-3); border: 1px solid var(--border);
          color: var(--gold-bright); font-family: var(--space); font-size: 13px;
          font-weight: 700; padding: 8px 12px; outline: none; width: 140px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .ticker-input:focus { border-color: var(--gold); }

        .run-btn {
          font-family: var(--space); font-size: 10px; letter-spacing: 0.2em;
          padding: 10px 28px; cursor: pointer; text-transform: uppercase;
          background: var(--gold); color: var(--dark); border: none; font-weight: 700;
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .run-btn:hover:not(:disabled) { background: var(--gold-bright); transform: translateY(-1px); }
        .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .score-ring {
          width: 120px; height: 120px; border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 3px solid; position: relative;
        }
        .score-ring::before {
          content: ''; position: absolute; inset: -6px; border-radius: 50%;
          border: 1px solid rgba(184,134,11,0.2);
        }

        .signal-bar {
          height: 4px; border-radius: 2px; margin-bottom: 4px;
          transition: width 1s ease-out;
        }

        .log-entry { font-size: 10px; line-height: 1.8; font-family: var(--mono); }
        .log-sys { color: var(--gold); }
        .log-exec { color: var(--cream-deep); }
        .log-success { color: var(--green); }
        .log-error { color: var(--red); }
        .log-info { color: rgba(213,196,154,0.5); }

        .thinking-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .result-section { border-left: 2px solid var(--border); padding-left: 16px; margin-bottom: 20px; }
        .result-section:hover { border-left-color: var(--gold); }

        .tag {
          display: inline-block; font-family: var(--space); font-size: 8px;
          letter-spacing: 0.15em; padding: 2px 8px; border: 1px solid;
          text-transform: uppercase;
        }
        .tag-bull { border-color: var(--green); color: var(--green); }
        .tag-bear { border-color: var(--red); color: var(--red); }
        .tag-neutral { border-color: var(--yellow); color: var(--yellow); }

        .grid-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image: 
            linear-gradient(rgba(184,134,11,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,134,11,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }

        .corner-tl::before, .corner-br::after {
          content: ''; position: absolute; width: 20px; height: 20px;
          border-color: var(--gold); border-style: solid;
        }
        .corner-tl::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .corner-br::after { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
      `}</style>

      <div className="scanline" />

      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", padding: "0" }}>
        {/* Header */}
        <header style={{ 
          borderBottom: "1px solid var(--border-bright)", 
          padding: "0 24px",
          background: "var(--dark-2)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "52px", position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ 
                width: "28px", height: "28px", border: "1px solid var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", color: "var(--gold-bright)"
              }}>◈</div>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: "15px", color: "var(--cream)", letterSpacing: "0.05em", lineHeight: 1 }}>
                  Smart Money Intelligence
                </div>
                <div style={{ fontFamily: "var(--space)", fontSize: "8px", color: "var(--gold)", letterSpacing: "0.2em" }}>
                  TERMINAL v1.0 — OPUS 4 ENGINE
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {["INSTITUTIONAL", "LIQUIDITY", "INTEGRITY", "LOGS"].map((m, i) => (
              <button key={i} className={`module-btn ${activeModule === i ? "active" : ""}`}
                onClick={() => setActiveModule(i)}>
                {m}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} className="thinking-pulse" />
            <span style={{ fontFamily: "var(--space)", fontSize: "9px", color: "var(--green)", letterSpacing: "0.15em" }}>LIVE</span>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr 280px", height: "calc(100vh - 52px)", gap: "0" }}>
          
          {/* LEFT: Input Panel */}
          <div style={{ borderRight: "1px solid var(--border)", padding: "20px", overflowY: "auto", background: "var(--dark)" }}>
            <div style={{ marginBottom: "20px" }}>
              <div className="label" style={{ marginBottom: "12px" }}>▸ Asset Identifier</div>
              <input
                className="ticker-input"
                placeholder="BTC / AAPL / ES1!"
                value={assetTicker}
                onChange={e => setAssetTicker(e.target.value.toUpperCase())}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div className="label" style={{ marginBottom: "12px" }}>▸ Analysis Module</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {MODULES.map((m, i) => (
                  <button key={i} className={`module-btn ${activeModule === i ? "active" : ""}`}
                    onClick={() => setActiveModule(i)}
                    style={{ textAlign: "left", padding: "8px 12px" }}>
                    [{String(i + 1).padStart(2, "0")}] {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div className="label" style={{ marginBottom: "8px" }}>▸ Market Data Input</div>
              <div style={{ fontSize: "9px", color: "rgba(213,196,154,0.4)", marginBottom: "8px", lineHeight: 1.6 }}>
                Paste: price action, volume data, news, 13F holdings, whale transactions, or any market intelligence.
              </div>
              <textarea
                className="data-input"
                rows={10}
                placeholder={`Example:\n\nBTC/USD — Current: $67,420\nLarge tx detected: 2,400 BTC moved from unknown wallet to Binance.\nCoinbase premium: -0.8%\nOpen Interest: +340M in 4h\nNews: BlackRock ETF inflow $240M today\n13F: Bridgewater added 1.2M shares NVDA...`}
                value={inputData}
                onChange={e => setInputData(e.target.value)}
              />
            </div>

            <button className="run-btn" onClick={handleAnalyze} disabled={isLoading || !inputData.trim()} style={{ width: "100%" }}>
              {isLoading ? `ANALYZING ${thinkingDots}` : "▶  EXECUTE ANALYSIS"}
            </button>

            {isLoading && (
              <div style={{ marginTop: "16px", padding: "12px", background: "var(--dark-3)", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--space)", fontSize: "9px", color: "var(--gold)", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  EXTENDED THINKING ACTIVE
                </div>
                {["Parsing institutional flow vectors...", "Detecting liquidity signatures...", "Calibrating integrity score..."].map((t, i) => (
                  <div key={i} style={{ fontSize: "9px", color: "rgba(213,196,154,0.4)", marginBottom: "4px" }} className="thinking-pulse">
                    · {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Results */}
          <div style={{ overflowY: "auto", padding: "24px", background: "var(--dark)", position: "relative" }}>
            <div className="grid-overlay" />
            <div style={{ position: "relative", zIndex: 1 }}>
              {!analysisResult && !isLoading && (
                <div style={{ 
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  height: "60vh", opacity: 0.3
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px", color: "var(--gold)" }}>◈</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--cream)", letterSpacing: "0.1em" }}>
                    Awaiting Intelligence Feed
                  </div>
                  <div style={{ fontFamily: "var(--space)", fontSize: "9px", color: "var(--gold)", marginTop: "8px", letterSpacing: "0.2em" }}>
                    INPUT DATA → EXECUTE ANALYSIS
                  </div>
                </div>
              )}

              {isLoading && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                  <div style={{ fontSize: "48px", marginBottom: "24px", color: "var(--gold)" }} className="thinking-pulse">◈</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "var(--cream)", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Claude Opus 4 Thinking{thinkingDots}
                  </div>
                  <div style={{ fontFamily: "var(--space)", fontSize: "9px", color: "var(--gold)", letterSpacing: "0.2em" }}>
                    EXTENDED REASONING ACTIVE — DO NOT INTERRUPT
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="fade-in">
                  {/* Header Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                    <div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "28px", color: "var(--cream)", letterSpacing: "0.05em" }}>
                        {assetTicker || "ASSET"} — {MODULES[activeModule]}
                      </div>
                      <div style={{ fontFamily: "var(--space)", fontSize: "9px", color: "var(--gold)", letterSpacing: "0.15em", marginTop: "4px" }}>
                        {new Date().toUTCString().toUpperCase()} · CLAUDE OPUS 4 · EXTENDED THINKING
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="score-ring" style={{ borderColor: scoreColor(analysisResult.integrityScore) }}>
                        <div style={{ fontFamily: "var(--space)", fontSize: "28px", fontWeight: 700, color: scoreColor(analysisResult.integrityScore), lineHeight: 1 }}>
                          {analysisResult.integrityScore}
                        </div>
                        <div style={{ fontFamily: "var(--space)", fontSize: "7px", color: "rgba(213,196,154,0.6)", letterSpacing: "0.1em", marginTop: "4px" }}>
                          INTEGRITY
                        </div>
                      </div>
                      <div style={{ fontFamily: "var(--space)", fontSize: "8px", color: scoreColor(analysisResult.integrityScore), marginTop: "8px", letterSpacing: "0.1em" }}>
                        {scoreLabel(analysisResult.integrityScore)}
                      </div>
                    </div>
                  </div>

                  {/* Institutional Flow */}
                  {analysisResult.institutionalFlow && (
                    <div className="result-section">
                      <div className="label" style={{ marginBottom: "12px" }}>◈ Institutional Flow Analysis</div>
                      <p style={{ fontSize: "12px", lineHeight: "1.8", color: "var(--cream-dim)", marginBottom: "12px" }}>
                        {analysisResult.institutionalFlow.summary}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                        {analysisResult.institutionalFlow.signals?.map((s, i) => (
                          <div key={i} style={{ padding: "10px", background: "var(--dark-3)", border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: "9px", color: "var(--gold)", marginBottom: "4px" }}>{s.label}</div>
                            <div style={{ fontSize: "13px", color: s.value?.includes("+") ? "var(--green)" : s.value?.includes("-") ? "var(--red)" : "var(--cream)" }}>
                              {s.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Liquidity Grabs */}
                  {analysisResult.liquidityGrabs && (
                    <div className="result-section">
                      <div className="label" style={{ marginBottom: "12px" }}>◈ Liquidity Grab Detection</div>
                      <p style={{ fontSize: "12px", lineHeight: "1.8", color: "var(--cream-dim)", marginBottom: "12px" }}>
                        {analysisResult.liquidityGrabs.summary}
                      </p>
                      {analysisResult.liquidityGrabs.events?.map((ev, i) => (
                        <div key={i} style={{ 
                          padding: "10px 14px", marginBottom: "8px",
                          background: "var(--dark-3)", 
                          borderLeft: `3px solid ${ev.severity === "HIGH" ? "var(--red)" : ev.severity === "MED" ? "var(--yellow)" : "var(--green)"}` 
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "var(--space)", fontSize: "10px", color: "var(--cream)" }}>{ev.name}</span>
                            <span className={`tag ${ev.severity === "HIGH" ? "tag-bear" : ev.severity === "MED" ? "tag-neutral" : "tag-bull"}`}>
                              {ev.severity}
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--cream-deep)" }}>{ev.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Strategic Conclusion */}
                  {analysisResult.strategicConclusion && (
                    <div className="result-section">
                      <div className="label" style={{ marginBottom: "12px" }}>◈ Strategic Intelligence</div>
                      <p style={{ fontSize: "12px", lineHeight: "1.8", color: "var(--cream-dim)", marginBottom: "16px" }}>
                        {analysisResult.strategicConclusion}
                      </p>
                      {analysisResult.keyLevels && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                          {analysisResult.keyLevels.map((l, i) => (
                            <div key={i} style={{ padding: "10px", background: "var(--dark-4)", border: "1px solid var(--border)", textAlign: "center" }}>
                              <div style={{ fontSize: "9px", color: "var(--gold)", marginBottom: "4px" }}>{l.label}</div>
                              <div style={{ fontFamily: "var(--space)", fontSize: "12px", fontWeight: 700, color: "var(--cream)" }}>{l.price}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Risk Warning */}
                  <div style={{ padding: "10px 14px", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", marginTop: "20px" }}>
                    <span style={{ fontFamily: "var(--space)", fontSize: "8px", color: "rgba(248,113,113,0.6)", letterSpacing: "0.1em" }}>
                      ⚠ DISCLAIMER: This analysis is AI-generated intelligence for informational purposes only. Not financial advice. Always apply your own judgment and risk management.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Terminal Log */}
          <div style={{ borderLeft: "1px solid var(--border)", background: "var(--dark-2)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="label">◈ Terminal Log</span>
              <span style={{ fontFamily: "var(--space)", fontSize: "8px", color: "var(--gold-pale)" }}>{logs.length} entries</span>
            </div>
            <div ref={logRef} style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
              {logs.map((l, i) => (
                <div key={i} className={`log-entry log-${l.type}`} style={{ marginBottom: "6px" }}>
                  <span style={{ opacity: 0.5, marginRight: "8px" }}>{l.time}</span>
                  {l.msg}
                </div>
              ))}
              {isLoading && (
                <div className="log-entry log-exec thinking-pulse">
                  {new Date().toISOString().slice(11, 19)} · Extended thinking in progress{thinkingDots}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
