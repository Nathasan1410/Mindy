import { useContractWrite, useContractRead, usePrepareContractWrite } from "wagmi"
import { contracts } from "@/lib/contracts"

export interface SessionKey {
  key: string
  grantedAt: number
  expiresAt: number
  permissions: string[]
  isActive: boolean
}

export function useSessionKey() {
  // Check if session is active
  const { data: isActive } = useContractRead({
    address: contracts.MindySessionKeyModule.address,
    abi: contracts.MindySessionKeyModule.abi,
    functionName: "isSessionActive",
    args: ["0x..."], // session key address
  })

  // Get session info
  const { data: sessionInfo } = useContractRead({
    address: contracts.MindySessionKeyModule.address,
    abi: contracts.MindySessionKeyModule.abi,
    functionName: "getSessionInfo",
    args: ["0x..."], // session key address
  })

  // Grant session
  const { config: grantConfig } = usePrepareContractWrite({
    address: contracts.MindySessionKeyModule.address,
    abi: contracts.MindySessionKeyModule.abi,
    functionName: "grantSession",
    args: [
      "0x...", // delegate
      ["deposit", "withdraw"], // permissions
      Math.floor(Date.now() / 1000) + 86400, // expires in 24 hours
    ],
  })

  const { write: grantSession } = useContractWrite({
    ...grantConfig,
  })

  // Revoke session
  const { config: revokeConfig } = usePrepareContractWrite({
    address: contracts.MindySessionKeyModule.address,
    abi: contracts.MindySessionKeyModule.abi,
    functionName: "revokeSession",
    args: ["0x..."], // delegate
  })

  const { write: revokeSession } = useContractWrite({
    ...revokeConfig,
  })

  return {
    isActive,
    sessionInfo,
    grantSession,
    revokeSession,
  }
}
