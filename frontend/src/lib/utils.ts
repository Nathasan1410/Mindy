import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (num === undefined || num === null) return "0"
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatAPY(apy: number): string {
  return `${formatNumber(apy)}%`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function shortenString(str: string, maxLength: number = 20): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}
