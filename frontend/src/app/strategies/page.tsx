"use client"

import { useState } from "react"
import { WalletButton } from "@/components/shared/WalletButton"
import { YieldCard } from "@/components/strategies/YieldCard"
import { StrategyCard } from "@/components/strategies/StrategyCard"
import { useAIInsights } from "@/hooks/useAIInsights"
import { useStrategyManager, parseStrategy } from "@/hooks/useStrategyManager"
import { mockYieldOpportunities, mockStrategies } from "@/lib/yields/mock-data"
import { Brain, PieChart, ArrowLeftRight, Settings, Home, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/strategies", label: "Strategies", icon: Brain, active: true },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState<"opportunities" | "strategies">("opportunities")
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all")
  
  const { insights, analyzeYields, isLoading } = useAIInsights()
  const { strategies: contractStrategies } = useStrategyManager()

  // Filter opportunities
  const filteredOpportunities = mockYieldOpportunities.filter((opp) => {
    const matchesSearch = opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.protocol.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (riskFilter === "all") return matchesSearch
    
    const riskLevel = getRiskLevel(opp.riskFactors.length)
    return matchesSearch && riskLevel === riskFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mindy
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Yield Strategies</h2>
          <p className="text-gray-600">
            Discover and invest in AI-curated yield opportunities
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "opportunities"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Opportunities ({filteredOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab("strategies")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "strategies"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Strategies
          </button>
        </div>

        {/* Filters */}
        {activeTab === "opportunities" && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or protocol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
              <Button onClick={() => analyzeYields()} disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze with AI"}
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "opportunities" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <YieldCard
                key={opportunity.id}
                opportunity={{
                  ...opportunity,
                  aiScore: insights.find((i) => i.id === opportunity.id)?.aiScore,
                  aiReasoning: insights.find((i) => i.id === opportunity.id)?.aiReasoning,
                }}
                onInvest={() => console.log("Invest in", opportunity.name)}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={parseStrategy(strategy) || {
                  id: strategy.id,
                  name: strategy.name,
                  targetAPY: strategy.targetAPY,
                  riskScore: strategy.riskScore,
                  currentAllocation: BigInt(0),
                  isActive: strategy.isActive,
                  rollupChainId: strategy.rollupChainId,
                  reasoning: strategy.reasoning,
                }}
                onAllocate={() => console.log("Allocate to", strategy.name)}
                onRebalance={() => console.log("Rebalance", strategy.name)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function getRiskLevel(riskFactorCount: number): "low" | "medium" | "high" {
  if (riskFactorCount <= 1) return "low"
  if (riskFactorCount <= 2) return "medium"
  return "high"
}
