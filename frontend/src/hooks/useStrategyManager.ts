import { useContractWrite, useContractRead, usePrepareContractWrite } from "wagmi"
import { contracts } from "@/lib/contracts"
import { parseUnits } from "viem"

export interface Strategy {
  id: number
  name: string
  targetAPY: number
  riskScore: number
  currentAllocation: bigint
  isActive: boolean
  rollupChainId: number
  reasoning: string
}

export function useStrategyManager() {
  // Get strategy count
  const { data: strategyCount } = useContractRead({
    address: contracts.MindyStrategyManager.address,
    abi: contracts.MindyStrategyManager.abi,
    functionName: "getStrategyCount",
  })

  // Get individual strategy
  const { data: strategy } = useContractRead({
    address: contracts.MindyStrategyManager.address,
    abi: contracts.MindyStrategyManager.abi,
    functionName: "getStrategy",
    args: [0], // Example: first strategy
  })

  // Get all strategies
  const { data: strategies } = useContractRead({
    address: contracts.MindyStrategyManager.address,
    abi: contracts.MindyStrategyManager.abi,
    functionName: "getAllStrategies",
  })

  // Prepare rebalance
  const { config: rebalanceConfig } = usePrepareContractWrite({
    address: contracts.MindyStrategyManager.address,
    abi: contracts.MindyStrategyManager.abi,
    functionName: "rebalance",
    args: [
      [0, 1], // strategyIds
      [parseUnits("500", 18), parseUnits("500", 18)], // allocations
      "AI rebalance recommendation", // reason
    ],
  })

  const { write: rebalance } = useContractWrite({
    ...rebalanceConfig,
  })

  // Update risk score
  const { config: updateRiskConfig } = usePrepareContractWrite({
    address: contracts.MindyStrategyManager.address,
    abi: contracts.MindyStrategyManager.abi,
    functionName: "updateRiskScore",
    args: [0, 50], // strategyId, newRiskScore
  })

  const { write: updateRiskScore } = useContractWrite({
    ...updateRiskConfig,
  })

  return {
    strategyCount,
    strategy,
    strategies,
    rebalance,
    updateRiskScore,
  }
}

export function parseStrategy(data: any): Strategy | null {
  if (!data) return null
  
  return {
    id: Number(data.id),
    name: data.name,
    targetAPY: Number(data.targetAPY),
    riskScore: Number(data.riskScore),
    currentAllocation: data.currentAllocation,
    isActive: data.isActive,
    rollupChainId: Number(data.rollupChainId),
    reasoning: data.reasoning,
  }
}
