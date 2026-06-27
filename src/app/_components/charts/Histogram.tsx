"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Frequência",
    color: "#1677ff",
  },
} satisfies ChartConfig;

type Props = {
  values: number[];
  bins?: number;
  height?: number;
  title?: string;
};

const HistogramChart: React.FC<Props> = ({ values, bins, height = 320, title }) => {
  // Configura a quantidade de bins
  const nBins = bins ?? Math.max(1, Math.ceil(Math.sqrt(Math.max(values.length, 1))));

  const chartData = useMemo(() => {
    if (values.length === 0) return [];
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Evita divisão por zero
    const binWidth = max === min ? 1 : (max - min) / nBins;
    
    // Inicializa bins
    const binData = Array.from({ length: nBins }).map((_, i) => {
      const rangeStart = min + i * binWidth;
      const rangeEnd = i === nBins - 1 ? max : min + (i + 1) * binWidth;
      
      return {
        rangeStart,
        rangeEnd,
        label: `${new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 }).format(rangeStart)} - ${new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 }).format(rangeEnd)}`,
        count: 0
      };
    });

    // Conta os valores
    values.forEach(v => {
      let binIndex = Math.floor((v - min) / binWidth);
      if (binIndex >= nBins) binIndex = nBins - 1; // Para o valor máximo
      if (binIndex < 0) binIndex = 0;
      binData[binIndex].count += 1;
    });

    return binData;
  }, [values, nBins]);

  if (chartData.length === 0) return null;

  return (
    <Card className="h-full border-gray-200 shadow-sm rounded-xl">
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        <CardDescription>Distribuição de frequência dos valores</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              width={40}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg text-sm text-slate-800">
                    <div className="font-bold mb-2 pb-1 border-b border-gray-100">{d.label}</div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Frequência:</span>
                      <span className="font-bold text-[#1677ff]">{d.count}</span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HistogramChart;
