"use client"

import Link from "next/link"
import { WalletButton } from "@/components/shared/WalletButton"
import { Brain, PieChart, ArrowLeftRight, Settings } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: PieChart },
  { href: "/strategies", label: "Strategies", icon: Brain },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Home() {
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
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Yield Optimization
            </span>{" "}
            Across Initia
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Mindy automatically scans yield opportunities, analyzes risk/reward with AI, and optimizes your portfolio across Initia rollups.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Launch App
            </Link>
            <a
              href="https://docs.initia.xyz/hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-blue-600" />}
              title="AI Analysis"
              description="Advanced AI scores yield opportunities on risk, sustainability, and market conditions"
            />
            <FeatureCard
              icon={<ArrowLeftRight className="w-12 h-12 text-purple-600" />}
              title="Cross-Rollup"
              description="Automatically bridge funds to the highest-yield opportunities across Initia ecosystem"
            />
            <FeatureCard
              icon={<PieChart className="w-12 h-12 text-green-600" />}
              title="Auto-Compound"
              description="Set it and forget it - Mindy continuously optimizes and compounds your yields"
            />
          </div>

          {/* Initia Features */}
          <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Powered by Initia</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">⚡ Session Keys</h4>
                <p className="text-gray-600">
                  No repeated wallet approvals - grant once, AI executes seamlessly
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">🌉 Interwoven Bridge</h4>
                <p className="text-gray-600">
                  Instant cross-rollup transfers to chase the best yields
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">🆔 .init Usernames</h4>
                <p className="text-gray-600">
                  Human-readable identity across the Initia ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Built for the INITIATE Hackathon on Initia</p>
          <p className="text-sm mt-2">
            Mindy - Mind your yield, automatically
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
