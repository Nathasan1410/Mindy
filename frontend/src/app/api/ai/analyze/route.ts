import { NextResponse } from "next/server"
import { analyzeYields, type YieldOpportunity } from "@/lib/ai/groq-client"

/**
 * POST /api/ai/analyze
 * Analyze yield opportunities with AI
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { opportunities } = body as { opportunities: YieldOpportunity[] }
    
    if (!opportunities || !Array.isArray(opportunities)) {
      return NextResponse.json(
        { error: "Invalid opportunities array" },
        { status: 400 }
      )
    }
    
    const analysis = await analyzeYields(opportunities)
    
    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI analyze error:", error)
    return NextResponse.json(
      { error: "Failed to analyze yields", message: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Mindy AI Analysis API",
    endpoints: {
      analyze: "POST /api/ai/analyze",
      rebalance: "POST /api/ai/rebalance",
      chat: "POST /api/ai/chat",
    },
  })
}
