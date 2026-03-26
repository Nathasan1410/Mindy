import Groq from "groq-sdk"

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.QWEN_API_KEY || "",
})

// Model configuration
const MODELS = {
  ANALYSIS: "llama-3.1-70b-versatile", // Best for complex analysis
  CHAT: "llama-3.1-8b-instant", // Fast for chat
  FALLBACK: "llama-3.1-8b-instant",
} as const

/**
 * Analyze yield opportunities with AI
 * @param opportunities Array of yield opportunities to analyze
 * @returns AI analysis with risk scores and recommendations
 */
export async function analyzeYields(opportunities: YieldOpportunity[]): Promise<AIAnalysisResult> {
  try {
    const response = await groq.chat.completions.create({
      model: MODELS.ANALYSIS,
      temperature: 0.1, // Deterministic for analysis
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a DeFi yield analyst AI. Analyze yield opportunities and provide risk scores.
          
Output JSON with this structure:
{
  "analysis": [
    {
      "id": "opportunity ID",
      "riskScore": 0-100,
      "riskCategory": "Low" | "Medium" | "High",
      "factors": ["factor 1", "factor 2"],
      "recommendation": "Invest" | "Hold" | "Avoid",
      "reasoning": "Explanation"
    }
  ]
}`,
        },
        {
          role: "user",
          content: `Analyze these yield opportunities:\n\n${JSON.stringify(opportunities, null, 2)}`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("No response from AI")

    const result = JSON.parse(content) as AIAnalysisResult
    return result
  } catch (error) {
    console.error("AI analysis error:", error)
    // Fallback to heuristic scoring
    return fallbackAnalysis(opportunities)
  }
}

/**
 * Generate rebalance recommendation
 * @param currentAllocations Current portfolio allocations
 * @param analyzedOpportunities AI-analyzed yield opportunities
 * @param riskTolerance User's risk tolerance (conservative/moderate/aggressive)
 * @returns Rebalance recommendation
 */
export async function generateRebalanceRecommendation(
  currentAllocations: PortfolioAllocation[],
  analyzedOpportunities: AIAnalysisResult,
  riskTolerance: "conservative" | "moderate" | "aggressive"
): Promise<RebalanceRecommendation> {
  try {
    const response = await groq.chat.completions.create({
      model: MODELS.ANALYSIS,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a portfolio optimization AI. Generate optimal rebalance recommendations.

Output JSON with this structure:
{
  "allocations": [
    {
      "strategyId": number,
      "allocationBps": number, // basis points (10000 = 100%)
      "reason": "Explanation"
    }
  ],
  "expectedAPY": number,
  "riskScore": number,
  "reasoning": "Detailed explanation",
  "shouldExecute": boolean,
  "urgency": "Low" | "Medium" | "High"
}`,
        },
        {
          role: "user",
          content: `Current allocations: ${JSON.stringify(currentAllocations)}\n\nAnalyzed opportunities: ${JSON.stringify(analyzedOpportunities)}\n\nRisk tolerance: ${riskTolerance}`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("No response from AI")

    return JSON.parse(content) as RebalanceRecommendation
  } catch (error) {
    console.error("Rebalance recommendation error:", error)
    return generateFallbackRebalance(currentAllocations, analyzedOpportunities, riskTolerance)
  }
}

/**
 * Chat with AI about portfolio
 * @param question User's question
 * @param context Portfolio context and recent actions
 * @returns AI response stream
 */
export async function* chatWithAI(
  question: string,
  context: ChatContext
): AsyncGenerator<string> {
  try {
    const response = await groq.chat.completions.create({
      model: MODELS.CHAT,
      temperature: 0.7,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are Mindy, a friendly AI yield optimization assistant. 
You help users understand their portfolio, explain investment decisions, and answer DeFi questions.
Be concise, friendly, and avoid jargon when possible.`,
        },
        {
          role: "user",
          content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}`,
        },
      ],
    })

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || ""
      yield content
    }
  } catch (error) {
    console.error("Chat error:", error)
    yield "Sorry, I'm having trouble connecting right now. Please try again!"
  }
}

// ============ Fallback Functions (when AI unavailable) ============

function fallbackAnalysis(opportunities: YieldOpportunity[]): AIAnalysisResult {
  // Simple heuristic scoring
  const analysis = opportunities.map((opp) => {
    let riskScore = 50
    
    // Adjust based on APY (higher APY = higher risk)
    if (opp.apy > 50) riskScore += 20
    else if (opp.apy > 20) riskScore += 10
    
    // Adjust based on TVL (higher TVL = lower risk)
    if (opp.tvl < 100000) riskScore += 15
    else if (opp.tvl < 1000000) riskScore += 5
    
    riskScore = Math.min(100, Math.max(0, riskScore))
    
    let riskCategory: "Low" | "Medium" | "High" = "Medium"
    if (riskScore < 40) riskCategory = "Low"
    else if (riskScore > 65) riskCategory = "High"
    
    let recommendation: "Invest" | "Hold" | "Avoid" = "Hold"
    if (riskScore < 50 && opp.apy > 10) recommendation = "Invest"
    else if (riskScore > 70) recommendation = "Avoid"
    
    return {
      id: opp.id,
      riskScore,
      riskCategory,
      factors: [
        opp.apy > 30 ? "High APY" : "Moderate APY",
        opp.tvl > 1000000 ? "High TVL" : "Low TVL",
      ],
      recommendation,
      reasoning: `Risk score ${riskScore}/100 based on APY ${opp.apy}% and TVL $${opp.tvl}`,
    }
  })
  
  return { analysis }
}

function generateFallbackRebalance(
  currentAllocations: PortfolioAllocation[],
  analyzedOpportunities: AIAnalysisResult,
  riskTolerance: string
): RebalanceRecommendation {
  // Simple allocation based on risk scores
  const lowRisk = analyzedOpportunities.analysis.filter((a) => a.riskScore < 40)
  const medRisk = analyzedOpportunities.analysis.filter((a) => a.riskScore >= 40 && a.riskScore <= 65)
  const highRisk = analyzedOpportunities.analysis.filter((a) => a.riskScore > 65)
  
  let target: typeof lowRisk
  if (riskTolerance === "conservative") target = lowRisk
  else if (riskTolerance === "aggressive") target = [...lowRisk, ...medRisk, ...highRisk]
  else target = [...lowRisk, ...medRisk]
  
  if (target.length === 0) {
    return {
      allocations: [],
      expectedAPY: 0,
      riskScore: 0,
      reasoning: "No suitable opportunities found",
      shouldExecute: false,
      urgency: "Low",
    }
  }
  
  const allocationPerStrategy = 10000 / target.length
  const allocations = target.map((t) => ({
    strategyId: parseInt(t.id),
    allocationBps: Math.round(allocationPerStrategy),
    reason: `Risk score ${t.riskScore} fits ${riskTolerance} profile`,
  }))
  
  return {
    allocations,
    expectedAPY: target.reduce((sum, t) => sum + 15, 0) / target.length, // Simplified
    riskScore: target.reduce((sum, t) => sum + t.riskScore, 0) / target.length,
    reasoning: `Diversified across ${target.length} strategies based on ${riskTolerance} risk tolerance`,
    shouldExecute: true,
    urgency: "Medium",
  }
}

// ============ Types ============

export interface YieldOpportunity {
  id: string
  name: string
  protocol: string
  rollupChainId: number
  apy: number
  tvl: number
  riskFactors: string[]
  token: string
  lastUpdated: string
}

export interface AIAnalysisResult {
  analysis: Array<{
    id: string
    riskScore: number
    riskCategory: "Low" | "Medium" | "High"
    factors: string[]
    recommendation: "Invest" | "Hold" | "Avoid"
    reasoning: string
  }>
}

export interface PortfolioAllocation {
  strategyId: number
  allocationBps: number
  currentAPY: number
}

export interface RebalanceRecommendation {
  allocations: Array<{
    strategyId: number
    allocationBps: number
    reason: string
  }>
  expectedAPY: number
  riskScore: number
  reasoning: string
  shouldExecute: boolean
  urgency: "Low" | "Medium" | "High"
}

export interface ChatContext {
  portfolioValue: number
  currentAPY: number
  recentRebalances: string[]
  activeStrategies: number
}
