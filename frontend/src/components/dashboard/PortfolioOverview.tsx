import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, PieChart, Wallet } from "lucide-react"
import { type Portfolio } from "@/hooks/usePortfolio"

interface PortfolioOverviewProps {
  portfolio: Portfolio | null
  isLoading: boolean
}

export function PortfolioOverview({ portfolio, isLoading }: PortfolioOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!portfolio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Connect wallet to view portfolio</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const stats = [
    {
      label: "Total Value",
      value: `$${portfolio.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Deposited",
      value: `$${portfolio.depositedAmount.toLocaleString()}`,
      icon: Wallet,
      color: "text-blue-600",
    },
    {
      label: "Pending Rewards",
      value: `$${portfolio.pendingRewards.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Total Earned",
      value: `$${portfolio.totalEarned.toLocaleString()}`,
      icon: PieChart,
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
        <CardDescription>Your Mindy vault performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className={`p-3 bg-white rounded-full shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
