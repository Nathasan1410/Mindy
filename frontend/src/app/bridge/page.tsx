"use client"

import { useState } from "react"
import { WalletButton } from "@/components/shared/WalletButton"
import { useBridge, formatTransferStatus } from "@/hooks/useBridge"
import { Brain, PieChart, ArrowLeftRight, Settings, Home, ArrowRight, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/strategies", label: "Strategies", icon: Brain },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight, active: true },
  { href: "/settings", label: "Settings", icon: Settings },
]

const ROLLUPS = [
  { id: 1001, name: "Initia Main", color: "bg-blue-500" },
  { id: 1002, name: "Yield Rollup", color: "bg-green-500" },
  { id: 1003, name: "Stable Chain", color: "bg-purple-500" },
  { id: 1004, name: "GameFi Hub", color: "bg-orange-500" },
]

export default function BridgePage() {
  const { bridgeToRollup, pendingCount } = useBridge()
  const [fromRollup, setFromRollup] = useState(1001)
  const [toRollup, setToRollup] = useState(1002)
  const [amount, setAmount] = useState("")
  const [isBridging, setIsBridging] = useState(false)

  const handleBridge = async () => {
    setIsBridging(true)
    try {
      // In production, this would call the actual contract
      await bridgeToRollup?.()
      console.log("Bridge initiated")
    } catch (error) {
      console.error("Bridge failed:", error)
    } finally {
      setIsBridging(false)
    }
  }

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
          <h2 className="text-3xl font-bold mb-2">Bridge</h2>
          <p className="text-gray-600">
            Transfer funds across Initia rollups instantly
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bridge Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bridge Assets</CardTitle>
                <CardDescription>
                  Move your assets between different rollups in the Initia ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Rollup */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <select
                    value={fromRollup}
                    onChange={(e) => setFromRollup(Number(e.target.value))}
                    className="w-full px-4 py-3 border rounded-lg bg-white"
                  >
                    {ROLLUPS.map((rollup) => (
                      <option key={rollup.id} value={rollup.id}>
                        {rollup.name} (Chain {rollup.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrow Icon */}
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>

                {/* To Rollup */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <select
                    value={toRollup}
                    onChange={(e) => setToRollup(Number(e.target.value))}
                    className="w-full px-4 py-3 border rounded-lg bg-white"
                  >
                    {ROLLUPS.filter((r) => r.id !== fromRollup).map((rollup) => (
                      <option key={rollup.id} value={rollup.id}>
                        {rollup.name} (Chain {rollup.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pr-20"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
                      USDC
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Available: 1,000.00 USDC
                  </p>
                </div>

                {/* Bridge Info */}
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Time</span>
                    <span className="font-medium">~2-5 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bridge Fee</span>
                    <span className="font-medium">0.1 USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">You'll Receive</span>
                    <span className="font-medium text-green-600">
                      {amount ? (Number(amount) - 0.1).toFixed(2) : "0.00"} USDC
                    </span>
                  </div>
                </div>

                {/* Bridge Button */}
                <Button
                  onClick={handleBridge}
                  disabled={isBridging || !amount || Number(amount) <= 0}
                  className="w-full py-6 text-lg"
                >
                  {isBridging ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Bridging...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="w-5 h-5 mr-2" />
                      Bridge to {ROLLUPS.find((r) => r.id === toRollup)?.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Transfers */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Transfers</CardTitle>
                <CardDescription>
                  Track your cross-rollup transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingCount && pendingCount > 0 ? (
                  <div className="space-y-3">
                    {[1].map((transfer) => (
                      <div
                        key={transfer}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {ROLLUPS.find((r) => r.id === fromRollup)?.name} →{" "}
                            {ROLLUPS.find((r) => r.id === toRollup)?.name}
                          </span>
                          <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="text-sm text-gray-600">
                          100.00 USDC
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                          In Transit
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No pending transfers</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supported Rollups */}
            <Card>
              <CardHeader>
                <CardTitle>Supported Rollups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ROLLUPS.map((rollup) => (
                  <div
                    key={rollup.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-3 h-3 rounded-full ${rollup.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rollup.name}</p>
                      <p className="text-xs text-gray-500">Chain {rollup.id}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
