import { useContractWrite, useContractRead, usePrepareContractWrite } from "wagmi"
import { contracts } from "@/lib/contracts"
import { parseUnits } from "viem"

export enum TransferStatus {
  Pending = 0,
  InTransit = 1,
  Completed = 2,
  Failed = 3,
}

export function useBridge() {
  // Get transfer info
  const { data: transferInfo } = useContractRead({
    address: contracts.MindyYieldRouter.address,
    abi: contracts.MindyYieldRouter.abi,
    functionName: "getTransfer",
    args: [0], // transferId
  })

  // Get pending transfers count
  const { data: pendingCount } = useContractRead({
    address: contracts.MindyYieldRouter.address,
    abi: contracts.MindyYieldRouter.abi,
    functionName: "getPendingTransfersCount",
  })

  // Prepare bridge transfer
  const { config: bridgeConfig } = usePrepareContractWrite({
    address: contracts.MindyYieldRouter.address,
    abi: contracts.MindyYieldRouter.abi,
    functionName: "bridgeToRollup",
    args: [
      1002, // destinationRollupChainId
      parseUnits("100", 18), // amount
      "0x...", // recipient
      "0x...", // data
    ],
  })

  const { write: bridgeToRollup } = useContractWrite({
    ...bridgeConfig,
  })

  // Confirm transfer (for relayer)
  const { config: confirmConfig } = usePrepareContractWrite({
    address: contracts.MindyYieldRouter.address,
    abi: contracts.MindyYieldRouter.abi,
    functionName: "confirmTransfer",
    args: [0], // transferId
  })

  const { write: confirmTransfer } = useContractWrite({
    ...confirmConfig,
  })

  return {
    transferInfo,
    pendingCount,
    bridgeToRollup,
    confirmTransfer,
  }
}

export function formatTransferStatus(status: number): string {
  switch (status) {
    case TransferStatus.Pending:
      return "Pending"
    case TransferStatus.InTransit:
      return "In Transit"
    case TransferStatus.Completed:
      return "Completed"
    case TransferStatus.Failed:
      return "Failed"
    default:
      return "Unknown"
  }
}
