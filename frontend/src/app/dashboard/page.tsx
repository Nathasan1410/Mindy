"use client"

import { WalletButton } from "@/components/shared/WalletButton"
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview"
import { AllocationChart } from "@/components/dashboard/AllocationChart"
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard"
import { usePortfolio } from "@/hooks/usePortfolio"
import { Brain, PieChart, ArrowLeftRight, Settings, Home } from "lucide-react"
import Link from "next/link"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, active: true },
  { href: "/strategies", label: "Strategies", icon: Brain },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function DashboardPage() {
  const { portfolio, isLoading } = usePortfolio()

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
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Monitor your portfolio and get AI-powered insights
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Portfolio & Allocation */}
          <div className="lg:col-span-2 space-y-6">
            <PortfolioOverview portfolio={portfolio} isLoading={isLoading} />
            
            {portfolio?.currentAllocation && portfolio.currentAllocation.length > 0 && (
              <AllocationChart allocations={portfolio.currentAllocation} />
            )}
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            <AIInsightsCard />
            
            {/* Quick Stats */}
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Strategies</span>
                  <span className="font-semibold">
                    {portfolio?.currentAllocation?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best APY</span>
                  <span className="font-semibold text-green-600">
                    {portfolio?.currentAllocation
                      ? Math.max(...portfolio.currentAllocation.map((a) => a.apy)).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg APY</span>
                  <span className="font-semibold text-blue-600">
                    {portfolio?.currentAllocation && portfolio.currentAllocation.length > 0
                      ? (
                          portfolio.currentAllocation.reduce((sum, a) => sum + a.apy, 0) /
                          portfolio.currentAllocation.length
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
