export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { inputData, assetTicker, module } = req.body;

  if (!inputData) return res.status(400).json({ error: "No input data provided" });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "API key not configured" });

  const systemPrompt = `You are a Quantitative Data Scientist and Smart Money Intelligence Analyst with 20 years of experience analyzing institutional flow, whale behavior, and market manipulation patterns. You specialize in:

1. **Institutional Flow Analysis (13F-style)**: Parsing large position changes, ETF inflows/outflows, fund accumulation/distribution patterns.
2. **Liquidity Grab Detection**: Identifying stop hunts, liquidity sweeps, order block formations, and whale-driven price manipulation.
3. **Market Integrity Scoring**: Distinguishing between organic price movements driven by real news vs. manufactured moves for liquidity extraction.

You think deeply and methodically. You cross-reference multiple data points before drawing conclusions. You are cynical about "official" narratives and look for what smart money is actually doing vs. what is being communicated publicly.

Always respond in valid JSON only. No markdown, no code blocks, no preamble. Pure JSON.`;

  const userPrompt = `Analyze the following market data for ${assetTicker || "the specified asset"} using the ${module} framework.

MARKET DATA INPUT:
${inputData}

Perform a comprehensive analysis and return ONLY a JSON object with this exact structure:
{
  "integrityScore": <number 0-100, where 100 = completely legitimate move, 0 = pure manipulation>,
  "institutionalFlow": {
    "summary": "<2-3 sentence analysis of institutional positioning and what large players are likely doing>",
    "signals": [
      {"label": "<signal name>", "value": "<value or assessment>"},
      {"label": "<signal name>", "value": "<value or assessment>"},
      {"label": "<signal name>", "value": "<value or assessment>"}
    ]
  },
  "liquidityGrabs": {
    "summary": "<2-3 sentence analysis of detected liquidity events and whale behavior>",
    "events": [
      {"name": "<event name>", "severity": "<HIGH|MED|LOW>", "detail": "<specific detail about this event>"},
      {"name": "<event name>", "severity": "<HIGH|MED|LOW>", "detail": "<specific detail about this event>"}
    ]
  },
  "strategicConclusion": "<3-4 sentence actionable intelligence summary — what is smart money likely doing, what should a trader watch for, what is the probable next move>",
  "keyLevels": [
    {"label": "SUPPORT 1", "price": "<price level>"},
    {"label": "SUPPORT 2", "price": "<price level>"},
    {"label": "RESISTANCE 1", "price": "<price level>"},
    {"label": "RESISTANCE 2", "price": "<price level>"}
  ]
}

The integrityScore should reflect:
- 70-100: Move is backed by real institutional demand/supply, legitimate news catalyst, organic market structure
- 40-69: Mixed signals, some suspicious activity but not conclusive manipulation
- 0-39: Strong evidence of stop hunt, wash trading, coordinated manipulation, or manufactured narrative

Be precise, direct, and think like a quant who has seen every trick in the book. Use all available data points.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "interleaved-thinking-2025-05-14",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 16000,
        thinking: {
          type: "enabled",
          budget_tokens: 10000,
        },
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Claude API error");
    }

    const data = await response.json();

    // Extract text content (ignore thinking blocks)
    const textContent = data.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("");

    // Parse JSON from response
    const cleanJson = textContent.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ error: err.message || "Analysis failed" });
  }
}
