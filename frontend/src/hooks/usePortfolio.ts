import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useMindyVault } from "./useMindyVault"
import { useStrategyManager } from "./useStrategyManager"

export interface Portfolio {
  totalValue: number
  depositedAmount: number
  sharesOwned: number
  currentAllocation: Allocation[]
  pendingRewards: number
  totalEarned: number
}

export interface Allocation {
  strategyId: number
  strategyName: string
  amount: number
  percentage: number
  apy: number
}

export function usePortfolio() {
  const { address, isConnected } = useAccount()
  const { totalAssets, totalSupply, asset } = useMindyVault()
  const { strategies } = useStrategyManager()
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected || !address) {
      setPortfolio(null)
      return
    }

    const loadPortfolio = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // For now, use mock data - will be replaced with actual contract reads
        const mockPortfolio: Portfolio = {
          totalValue: 10000, // $10,000
          depositedAmount: 10000,
          sharesOwned: 10000,
          currentAllocation: [
            {
              strategyId: 0,
              strategyName: "INIT-USDC LP",
              amount: 2500,
              percentage: 25,
              apy: 24.5,
            },
            {
              strategyId: 1,
              strategyName: "INIT Staking",
              amount: 3000,
              percentage: 30,
              apy: 12.3,
            },
            {
              strategyId: 2,
              strategyName: "Leveraged ETH",
              amount: 2000,
              percentage: 20,
              apy: 45.8,
            },
            {
              strategyId: 3,
              strategyName: "Stable Vault",
              amount: 2500,
              percentage: 25,
              apy: 8.2,
            },
          ],
          pendingRewards: 125.50,
          totalEarned: 1250.75,
        }
        
        setPortfolio(mockPortfolio)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load portfolio")
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolio()
  }, [address, isConnected])

  return {
    portfolio,
    isLoading,
    error,
    refresh: () => {
      // Trigger refresh
      setPortfolio(null)
    },
  }
}
