"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { InterwovenKitProvider } from "@initia/interwovenkit-react"
import { initiaConfig } from "@/lib/initia"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  )

  return (
    <InterwovenKitProvider config={initiaConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </InterwovenKitProvider>
  )
}
