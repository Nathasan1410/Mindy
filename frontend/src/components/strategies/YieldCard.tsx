import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Shield, Zap } from "lucide-react"
import { type YieldOpportunity } from "@/lib/ai/groq-client"

interface YieldCardProps {
  opportunity: YieldOpportunity & {
    aiScore?: number
    aiReasoning?: string
  }
  onInvest?: () => void
}

export function YieldCard({ opportunity, onInvest }: YieldCardProps) {
  const aiScore = opportunity.aiScore ?? 0.5
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{opportunity.name}</CardTitle>
            <CardDescription>{opportunity.protocol}</CardDescription>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
            <Zap className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">
              Chain {opportunity.rollupChainId}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* APY */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            APY
          </div>
          <span className="text-2xl font-bold text-green-600">
            {opportunity.apy.toFixed(2)}%
          </span>
        </div>

        {/* TVL */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            TVL
          </div>
          <span className="font-semibold">
            ${formatTVL(opportunity.tvl)}
          </span>
        </div>

        {/* Risk Factors */}
        {opportunity.riskFactors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              Risk Factors
            </div>
            <div className="flex flex-wrap gap-1">
              {opportunity.riskFactors.map((factor) => (
                <span
                  key={factor}
                  className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                >
                  {formatRiskFactor(factor)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Score */}
        {aiScore !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Score</span>
              <span className="text-sm font-bold">{(aiScore * 100).toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(aiScore)}`}
                style={{ width: `${aiScore * 100}%` }}
              />
            </div>
            {opportunity.aiReasoning && (
              <p className="text-xs text-gray-600">{opportunity.aiReasoning}</p>
            )}
          </div>
        )}
      </CardContent>

      {onInvest && (
        <div className="px-6 pb-4">
          <Button onClick={onInvest} className="w-full">
            Invest
          </Button>
        </div>
      )}
    </Card>
  )
}

function formatTVL(tvl: number): string {
  if (tvl >= 1000000) {
    return `$${(tvl / 1000000).toFixed(1)}M`
  }
  if (tvl >= 1000) {
    return `$${(tvl / 1000).toFixed(0)}K`
  }
  return `$${tvl.toFixed(0)}`
}

function formatRiskFactor(factor: string): string {
  return factor
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getScoreColor(score: number): string {
  if (score >= 0.7) return "bg-green-500"
  if (score >= 0.5) return "bg-yellow-500"
  if (score >= 0.3) return "bg-orange-500"
  return "bg-red-500"
}
