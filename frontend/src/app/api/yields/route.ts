import { NextResponse } from "next/server"
import { type YieldOpportunity } from "@/lib/ai/groq-client"
import { mockYieldOpportunities } from "@/lib/yields/mock-data"

/**
 * GET /api/yields
 * Fetch yield opportunities from across Initia ecosystem
 */
export async function GET() {
  try {
    // For hackathon demo: return mock data
    // In production: fetch from actual protocols and on-chain data
    
    const opportunities: YieldOpportunity[] = mockYieldOpportunities
    
    return NextResponse.json({
      success: true,
      data: opportunities,
      timestamp: new Date().toISOString(),
      source: "mock", // Change to "live" when using real data
    })
  } catch (error) {
    console.error("Yield fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch yields", message: String(error) },
      { status: 500 }
    )
  }
}
