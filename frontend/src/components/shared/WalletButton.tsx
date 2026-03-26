"use client"

import { useInterwovenKit } from "@initia/interwovenkit-react"
import { Button } from "@/components/ui/button"
import { formatAddress } from "@/lib/utils"

export function WalletButton() {
  const { isConnected, address, connect, disconnect, isConnecting } = useInterwovenKit()

  if (!isConnected) {
    return (
      <Button onClick={connect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={disconnect}>
      {formatAddress(address || "")}
    </Button>
  )
}
