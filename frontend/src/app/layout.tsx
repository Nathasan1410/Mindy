import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mindy - AI Yield Optimizer on Initia",
  description: "AI-powered cross-rollup yield optimization. Mind your yield, automatically.",
  keywords: ["DeFi", "Yield", "AI", "Initia", "Cross-chain", "Auto-compound"],
  authors: [{ name: "Mindy Team" }],
  openGraph: {
    title: "Mindy - AI Yield Optimizer",
    description: "AI-powered cross-rollup yield optimization on Initia",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
