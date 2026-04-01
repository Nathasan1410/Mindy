import type { InterwovenKitConfig } from "@initia/interwovenkit-react"

// Initia network configuration
export const initiaConfig: InterwovenKitConfig = {
  network: process.env.NEXT_PUBLIC_CHAIN_ID || "mindy-local",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:26657",
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || "Mindy",
  // Add more Initia-specific config as needed
}

export const CONTRACT_ADDRESSES = {
  MindyVault: process.env.MINDY_VAULT_ADDRESS || "",
  MindyStrategyManager: process.env.MINDY_STRATEGY_MANAGER_ADDRESS || "",
  MindySessionKeyModule: process.env.MINDY_SESSION_KEY_MODULE_ADDRESS || "",
  MindyYieldRouter: process.env.MINDY_YIELD_ROUTER_ADDRESS || "",
} as const

export const CHAIN_INFO = {
  id: process.env.NEXT_PUBLIC_CHAIN_ID || "mindy-local",
  name: process.env.NEXT_PUBLIC_CHAIN_NAME || "Mindy",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:26657",
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "",
}
