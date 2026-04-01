import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { type Strategy } from "@/hooks/useStrategyManager"

interface StrategyCardProps {
  strategy: Strategy
  onAllocate?: () => void
  onRebalance?: () => void
}

export function StrategyCard({ strategy, onAllocate, onRebalance }: StrategyCardProps) {
  const riskLevel = getRiskLevel(strategy.riskScore)
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{strategy.name}</CardTitle>
            <CardDescription>Chain ID: {strategy.rollupChainId}</CardDescription>
          </div>
          {strategy.isActive ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* APY */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            Target APY
          </div>
          <span className="text-2xl font-bold text-green-600">
            {(strategy.targetAPY / 100).toFixed(2)}%
          </span>
        </div>

        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Brain className="w-4 h-4" />
            Risk Score: {strategy.riskScore}/100
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getRiskColor(riskLevel)}`}
              style={{ width: `${strategy.riskScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{getRiskLabel(riskLevel)}</p>
        </div>

        {/* Allocation */}
        <div className="space-y-1">
          <div className="text-sm text-gray-600">Current Allocation</div>
          <div className="text-lg font-semibold">
            {Number(strategy.currentAllocation) / 1e18} tokens
          </div>
        </div>

        {/* AI Reasoning */}
        {strategy.reasoning && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{strategy.reasoning}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {onAllocate && (
          <Button onClick={onAllocate} className="flex-1">
            Allocate
          </Button>
        )}
        {onRebalance && (
          <Button onClick={onRebalance} variant="outline" className="flex-1">
            Rebalance
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function getRiskLevel(score: number): "low" | "medium" | "high" | "extreme" {
  if (score < 30) return "low"
  if (score < 50) return "medium"
  if (score < 70) return "high"
  return "extreme"
}

function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "bg-green-500"
    case "medium":
      return "bg-yellow-500"
    case "high":
      return "bg-orange-500"
    case "extreme":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getRiskLabel(level: string): string {
  switch (level) {
    case "low":
      return "Low Risk - Stable returns"
    case "medium":
      return "Medium Risk - Balanced"
    case "high":
      return "High Risk - Higher potential returns"
    case "extreme":
      return "Extreme Risk - Very volatile"
    default:
      return "Unknown"
  }
}
