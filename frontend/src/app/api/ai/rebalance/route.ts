import { NextResponse } from "next/server"
import {
  generateRebalanceRecommendation,
  type PortfolioAllocation,
  type AIAnalysisResult,
} from "@/lib/ai/groq-client"

/**
 * POST /api/ai/rebalance
 * Generate AI-powered rebalance recommendation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      currentAllocations,
      analyzedOpportunities,
      riskTolerance,
    } = body as {
      currentAllocations: PortfolioAllocation[]
      analyzedOpportunities: AIAnalysisResult
      riskTolerance: "conservative" | "moderate" | "aggressive"
    }
    
    if (!currentAllocations || !analyzedOpportunities || !riskTolerance) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }
    
    const recommendation = await generateRebalanceRecommendation(
      currentAllocations,
      analyzedOpportunities,
      riskTolerance
    )
    
    return NextResponse.json({
      success: true,
      data: recommendation,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Rebalance error:", error)
    return NextResponse.json(
      { error: "Failed to generate rebalance recommendation", message: String(error) },
      { status: 500 }
    )
  }
}
