"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMemo } from "react"

const chartConfig = {
  price: {
    label: "Valor (R$)",
    color: "#1677ff",
  },
} satisfies ChartConfig

type YearGroup = {
  x: string | number;
  values: number[];
}

interface YearBarChartProps {
  groups: YearGroup[];
  title?: string;
}

export function YearBarChart({ groups, title = "Distribuição por Ano (FIPE)" }: YearBarChartProps) {
  const chartData = useMemo(() => {
    return groups.map(g => {
      // Como geralmente há apenas um valor por ano na consulta da FIPE, pegamos a média
      const avgPrice = g.values.length > 0 
        ? g.values.reduce((a, b) => a + b, 0) / g.values.length 
        : 0;
        
      return {
        year: g.x.toString(),
        price: avgPrice,
      }
    })
  }, [groups])

  // Função para formatar como BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <Card className="h-full border-gray-200 shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Variação de preço do modelo conforme o ano</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={formatBRL}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              content={
                <ChartTooltipContent 
                  formatter={(value) => formatBRL(value as number)}
                />
              }
            />
            <Bar dataKey="price" fill="var(--color-price)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
