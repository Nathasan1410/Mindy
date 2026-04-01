"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { type Allocation } from "@/hooks/usePortfolio"

interface AllocationChartProps {
  allocations: Allocation[]
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

export function AllocationChart({ allocations }: AllocationChartProps) {
  const data = allocations.map((alloc, index) => ({
    name: alloc.strategyName,
    value: alloc.percentage,
    amount: alloc.amount,
    apy: alloc.apy,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Current distribution across strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}% ($${props.payload.amount.toLocaleString()})`,
                  props.payload.name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {allocations.map((alloc, index) => (
            <div
              key={alloc.strategyId}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{alloc.strategyName}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{alloc.percentage}%</div>
                <div className="text-xs text-gray-600">APY: {alloc.apy.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
