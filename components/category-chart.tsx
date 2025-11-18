"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useCategories } from "@/hooks/use-categories"

interface CategoryChartProps {
  data: Array<{ category: string; amount: number; color: string }>
  category: string
}

export function CategoryChart({ data, category }: CategoryChartProps) {
  const colors = [
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#ef4444", // red-500
    "#eab308", // yellow-500
    "#8b5cf6", // violet-500
    "#14b8a6", // teal-500
    "#f97316", // orange-500
    "#84cc16", // lime-500
    "#ec4899", // pink-500
    "#0ea5e9", // sky-500
    "#d946ef", // fuchsia-500
    "#10b981", // emerald-500
    "#f43f5e", // rose-500
    "#a16207", // amber-700
  ]

  // Income: lime → dark green
  const incomeColors = [
    "#a3e635", // lime-400
    "#65a30d", // lime-600
    "#15803d", // green-700
    "#14532d"  // green-900
  ]

  // Expense: orange → red
  const expenseColors = [
    "#fb923c", // orange-400
    "#f97316", // orange-500
    "#ea580c", // orange-600
    "#c2410c", // orange-700
    "#dc2626", // red-600
    "#b91c1c", // red-700
    "#991b1b", // red-800
    "#7f1d1d"  // red-900
  ]

  const { expenseCategories } = useCategories()
  const expenseCategoryNames = expenseCategories.map((c) => c.name)
    
  const chartConfig = data.reduce(
    (config, item, index) => ({
      ...config,
      [item.category.toLowerCase()]: {
        label: item.category,
        color: colors[index % colors.length],
      },
    }),
    {},
  )

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(2)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {data.map((entry, index) => {
              const palette = category !== "all" ? colors : (expenseCategoryNames.includes(entry.category) ? expenseColors : incomeColors)
              return <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
            })}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
