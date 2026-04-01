import { useState, useCallback } from "react"
import { analyzeYields, generateRebalanceRecommendation, type YieldOpportunity, type RebalanceRecommendation } from "@/lib/ai/groq-client"
import { mockYieldOpportunities, mockStrategies } from "@/lib/yields/mock-data"

export function useAIInsights() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<YieldOpportunity[]>([])
  const [recommendation, setRecommendation] = useState<RebalanceRecommendation | null>(null)

  // Analyze yield opportunities
  const analyzeYields = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Use mock data for now, will be replaced with real data from contracts
      const result = await analyzeYields(mockYieldOpportunities)
      setInsights(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze yields")
      // Fallback to mock data with basic scoring
      const mockWithScores = mockYieldOpportunities.map(opp => ({
        ...opp,
        aiScore: calculateBasicScore(opp),
        aiReasoning: "Basic heuristic scoring (AI unavailable)",
      }))
      setInsights(mockWithScores)
      return mockWithScores
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Generate rebalance recommendation
  const getRebalanceRecommendation = useCallback(async (
    currentAllocation: number[],
    riskTolerance: number
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await generateRebalanceRecommendation(
        mockStrategies,
        currentAllocation,
        riskTolerance
      )
      setRecommendation(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate recommendation")
      // Return basic recommendation
      const basicRec: RebalanceRecommendation = {
        action: "HOLD",
        confidence: 0.5,
        reasoning: "Using basic heuristic - AI service unavailable",
        suggestedAllocations: currentAllocation.map(() => 20), // Equal distribution
      }
      setRecommendation(basicRec)
      return basicRec
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Chat with AI
  const chatWithAI = useCallback(async (message: string, context?: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      })
      
      if (!response.ok) throw new Error("Failed to get AI response")
      
      const data = await response.json()
      return data.response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to chat with AI")
      return "I'm currently unavailable, but I'd recommend checking the dashboard for yield insights."
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Basic heuristic scoring (fallback)
  const calculateBasicScore = (opportunity: YieldOpportunity): number => {
    const apyScore = Math.min(opportunity.apy / 100, 1) // Normalize APY
    const riskPenalty = opportunity.riskFactors.length * 0.15
    const tvlScore = Math.min(opportunity.tvl / 10000000, 1) // Normalize TVL
    
    return Math.max(0, Math.min(1, apyScore * 0.6 + tvlScore * 0.4 - riskPenalty))
  }

  return {
    isLoading,
    error,
    insights,
    recommendation,
    analyzeYields,
    getRebalanceRecommendation,
    chatWithAI,
  }
}
