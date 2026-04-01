"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, RefreshCw, Lightbulb, TrendingUp, AlertCircle } from "lucide-react"
import { useAIInsights } from "@/hooks/useAIInsights"
import { type YieldOpportunity } from "@/lib/ai/groq-client"

export function AIInsightsCard() {
  const { isLoading, error, insights, analyzeYields } = useAIInsights()
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleAnalyze = async () => {
    await analyzeYields()
    setHasAnalyzed(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              AI Yield Insights
            </CardTitle>
            <CardDescription>
              AI-powered analysis of yield opportunities
            </CardDescription>
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading} size="sm">
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Analysis Error</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!hasAnalyzed && !isLoading && (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Click "Analyze" to get AI insights on current yield opportunities
            </p>
            <Button onClick={handleAnalyze}>
              Start Analysis
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {insights.length > 0 && (
          <div className="space-y-4">
            <div className="grid gap-3">
              {insights.slice(0, 3).map((opportunity, index) => (
                <InsightItem
                  key={opportunity.id}
                  opportunity={opportunity}
                  rank={index + 1}
                />
              ))}
            </div>
            
            {insights.length > 3 && (
              <p className="text-sm text-center text-gray-600">
                +{insights.length - 3} more opportunities analyzed
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface InsightItemProps {
  opportunity: YieldOpportunity & {
    aiScore?: number
    aiReasoning?: string
  }
  rank: number
}

function InsightItem({ opportunity, rank }: InsightItemProps) {
  const aiScore = opportunity.aiScore ?? 0.5
  
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">
            {rank}
          </div>
          <div>
            <p className="font-semibold">{opportunity.name}</p>
            <p className="text-xs text-gray-600">{opportunity.protocol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">{opportunity.apy.toFixed(1)}%</p>
          <p className="text-xs text-gray-600">Score: {(aiScore * 100).toFixed(0)}</p>
        </div>
      </div>
      
      {opportunity.aiReasoning && (
        <p className="text-xs text-gray-700">{opportunity.aiReasoning}</p>
      )}
    </div>
  )
}
