import { type Address } from "viem"

// Contract ABIs - will be populated after forge build
import MindyVaultABI from "@/../abis/MindyVault.json" assert { type: "json" }
import MindyStrategyManagerABI from "@/../abis/MindyStrategyManager.json" assert { type: "json" }
import MindySessionKeyModuleABI from "@/../abis/MindySessionKeyModule.json" assert { type: "json" }
import MindyYieldRouterABI from "@/../abis/MindyYieldRouter.json" assert { type: "json" }

import { CONTRACT_ADDRESSES } from "./initia"

export const contracts = {
  MindyVault: {
    address: CONTRACT_ADDRESSES.MindyVault as Address,
    abi: MindyVaultABI.abi,
  },
  MindyStrategyManager: {
    address: CONTRACT_ADDRESSES.MindyStrategyManager as Address,
    abi: MindyStrategyManagerABI.abi,
  },
  MindySessionKeyModule: {
    address: CONTRACT_ADDRESSES.MindySessionKeyModule as Address,
    abi: MindySessionKeyModuleABI.abi,
  },
  MindyYieldRouter: {
    address: CONTRACT_ADDRESSES.MindyYieldRouter as Address,
    abi: MindyYieldRouterABI.abi,
  },
}

export type ContractName = keyof typeof contracts
export type ContractType = typeof contracts[ContractName]
