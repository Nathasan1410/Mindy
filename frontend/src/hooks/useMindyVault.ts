import { useContractWrite, useContractRead, usePrepareContractWrite } from "wagmi"
import { contracts } from "@/lib/contracts"
import { parseUnits, formatUnits } from "viem"

export function useMindyVault() {
  // Read vault info
  const { data: totalAssets } = useContractRead({
    address: contracts.MindyVault.address,
    abi: contracts.MindyVault.abi,
    functionName: "totalAssets",
  })

  const { data: totalSupply } = useContractRead({
    address: contracts.MindyVault.address,
    abi: contracts.MindyVault.abi,
    functionName: "totalSupply",
  })

  const { data: asset } = useContractRead({
    address: contracts.MindyVault.address,
    abi: contracts.MindyVault.abi,
    functionName: "asset",
  })

  // Prepare deposit
  const { config: depositConfig } = usePrepareContractWrite({
    address: contracts.MindyVault.address,
    abi: contracts.MindyVault.abi,
    functionName: "deposit",
    args: [parseUnits("100", 18)], // Example: 100 tokens
  })

  const { write: deposit } = useContractWrite({
    ...depositConfig,
  })

  // Prepare withdraw
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: contracts.MindyVault.address,
    abi: contracts.MindyVault.abi,
    functionName: "withdraw",
    args: [parseUnits("100", 18)], // Example: 100 shares
  })

  const { write: withdraw } = useContractWrite({
    ...withdrawConfig,
  })

  return {
    totalAssets,
    totalSupply,
    asset,
    deposit,
    withdraw,
  }
}

export function formatVaultShares(shares: bigint, decimals: number = 18): string {
  return formatUnits(shares, decimals)
}

export function formatVaultAssets(assets: bigint, decimals: number = 18): string {
  return formatUnits(assets, decimals)
}
