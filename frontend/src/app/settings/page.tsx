"use client"

import { useState } from "react"
import { WalletButton } from "@/components/shared/WalletButton"
import { useSessionKey } from "@/hooks/useSessionKey"
import { Brain, PieChart, ArrowLeftRight, Settings as SettingsIcon, Home, Key, Shield, Clock, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/strategies", label: "Strategies", icon: Brain },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", icon: SettingsIcon, active: true },
]

export default function SettingsPage() {
  const { grantSession, revokeSession } = useSessionKey()
  const [activeTab, setActiveTab] = useState<"sessions" | "preferences">("sessions")
  const [isGranting, setIsGranting] = useState(false)
  const [sessionDuration, setSessionDuration] = useState("24")

  const handleGrantSession = async () => {
    setIsGranting(true)
    try {
      await grantSession?.()
      console.log("Session granted")
    } catch (error) {
      console.error("Failed to grant session:", error)
    } finally {
      setIsGranting(false)
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
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-gray-600">
            Manage session keys and application preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "sessions"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Key className="w-4 h-4" />
            Session Keys
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "preferences"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Preferences
          </button>
        </div>

        {activeTab === "sessions" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Grant New Session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Grant New Session
                </CardTitle>
                <CardDescription>
                  Create a new session key for automated yield management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Duration</label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                  >
                    <option value="1">1 Hour</option>
                    <option value="6">6 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                    <option value="168">7 Days</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="space-y-2">
                    {[
                      { id: "deposit", label: "Deposit to Vault", enabled: true },
                      { id: "withdraw", label: "Withdraw from Vault", enabled: true },
                      { id: "rebalance", label: "Rebalance Portfolio", enabled: true },
                      { id: "bridge", label: "Cross-Rollup Bridge", enabled: false },
                    ].map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={permission.enabled}
                          className="rounded border-gray-300"
                        />
                        {permission.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Security Notice</p>
                      <p>
                        Session keys allow Mindy to execute transactions on your behalf
                        without requiring wallet confirmation for each action.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGrantSession}
                  disabled={isGranting}
                  className="w-full"
                >
                  {isGranting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Granting Session...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Grant Session Key
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Active Sessions
                </CardTitle>
                <CardDescription>
                  Manage your currently active session keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Mock Active Session */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-medium text-green-800">
                          Active Session
                        </span>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span>in 22 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permissions:</span>
                        <span>3 actions</span>
                      </div>
                    </div>
                  </div>

                  {/* No Sessions Placeholder */}
                  <div className="text-center py-8 text-gray-500">
                    <Key className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No other active sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Network Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Network</CardTitle>
                <CardDescription>Blockchain network configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Network</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    defaultValue="testnet"
                  >
                    <option value="local">Local (Anvil)</option>
                    <option value="testnet">Initia Testnet</option>
                    <option value="mainnet">Initia Mainnet (Coming Soon)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">RPC URL</label>
                  <Input
                    defaultValue="https://rpc.testnet.initia.xyz"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chain ID</label>
                  <Input defaultValue="initiation-2" disabled />
                </div>
              </CardContent>
            </Card>

            {/* AI Settings */}
            <Card>
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
                <CardDescription>Configure AI analysis settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Provider</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    defaultValue="groq"
                  >
                    <option value="groq">Groq (Llama 3.1)</option>
                    <option value="qwen">Alibaba Qwen</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    defaultValue="medium"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="medium">Balanced</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-Rebalance</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">
                      Enable automatic portfolio rebalancing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Transaction Alerts</p>
                    <p className="text-xs text-gray-500">
                      Get notified when transactions complete
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Yield Updates</p>
                    <p className="text-xs text-gray-500">
                      Notify when APY changes significantly
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">AI Insights</p>
                    <p className="text-xs text-gray-500">
                      Get AI-powered yield recommendations
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About Mindy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Version:</strong> 0.1.0
                  </p>
                  <p className="mb-2">
                    <strong>Built for:</strong> INITIATE Hackathon on Initia
                  </p>
                  <p>
                    Mindy is an AI-powered yield optimizer that automatically
                    scans, analyzes, and optimizes your DeFi portfolio across
                    Initia rollups.
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/Nathasan1410/Mindy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://docs.initia.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Initia Docs
                    </a>
                    <a
                      href="https://dorahacks.io/hackathon/initiate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Hackathon
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
