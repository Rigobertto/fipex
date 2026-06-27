"use client";

import React, { useMemo } from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
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

export type BoxplotGroupInput = {
  x: string | number;
  values: number[];
};

export type BoxplotValuesInput = number[];

export type BoxplotPoint = {
  name: string | number;
  min: number;
  q1: number;
  med: number;
  q3: number;
  max: number;
  outliers?: number[];
};

type Props = {
  groups?: BoxplotGroupInput[];
  values?: BoxplotValuesInput;
  singleLabel?: string | number;
  height?: number;
  title?: string;
  showOutliersInTooltip?: boolean;
};

const chartConfig = {
  med: {
    label: "Mediana",
    color: "#1677ff",
  },
  min: { label: "Mínimo" },
  q1: { label: "Q1" },
  q3: { label: "Q3" },
  max: { label: "Máximo" },
} satisfies ChartConfig;

/* ------------------ HELPERS ESTATÍSTICOS ------------------ */
function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function quartiles(sorted: number[]): { q1: number; q3: number } {
  const n = sorted.length;
  if (n <= 1) return { q1: sorted[0] ?? NaN, q3: sorted[n - 1] ?? NaN };
  const mid = Math.floor(n / 2);
  const lower = sorted.slice(0, mid);
  const upper = sorted.slice(n % 2 ? mid + 1 : mid);
  return { q1: median(lower), q3: median(upper) };
}

function buildPoint(label: string | number, raw: number[]): BoxplotPoint | null {
  const data = raw.filter(Number.isFinite).sort((a, b) => a - b);
  if (data.length === 0) return null;

  const med = median(data);
  const { q1, q3 } = quartiles(data);
  const iqr = q3 - q1;

  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const inliers = data.filter((v) => v >= lowerFence && v <= upperFence);
  const outliers = data.filter((v) => v < lowerFence || v > upperFence);

  const min = (inliers.length ? inliers[0] : data[0]) as number;
  const max = (inliers.length ? inliers[inliers.length - 1] : data[data.length - 1]) as number;

  return {
    name: label,
    min,
    q1,
    med,
    q3,
    max,
    outliers: outliers.length ? outliers : undefined,
  };
}

function computeDataset(
  groups?: BoxplotGroupInput[],
  values?: number[],
  singleLabel: string | number = "Todos"
): BoxplotPoint[] {
  if (groups && groups.length) {
    const pts: BoxplotPoint[] = [];
    for (const g of groups) {
      const p = buildPoint(g.x, g.values);
      if (p) pts.push(p);
    }
    return pts.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  if (values && values.length) {
    const p = buildPoint(singleLabel, values);
    return p ? [p] : [];
  }

  return [];
}

/* ------------------ CUSTOM SHAPE ------------------ */
interface BoxPlotShapeProps {
  cx?: number;
  payload?: BoxplotPoint;
  yAxis?: {
    scale: (val: number) => number;
  };
}

const BoxPlotShape = (props: unknown) => {
  const { cx, payload, yAxis } = props as BoxPlotShapeProps;
  if (!yAxis || !yAxis.scale || cx === undefined || !payload) return null;

  const { min, q1, med, q3, max, outliers } = payload;
  const yMin = yAxis.scale(min);
  const yQ1 = yAxis.scale(q1);
  const yMed = yAxis.scale(med);
  const yQ3 = yAxis.scale(q3);
  const yMax = yAxis.scale(max);

  const boxWidth = 40;
  const halfWidth = boxWidth / 2;
  const x = cx - halfWidth;

  return (
    <g className="text-[#1677ff]">
      {/* Min whisker */}
      <line x1={cx - boxWidth * 0.3} y1={yMin} x2={cx + boxWidth * 0.3} y2={yMin} stroke="currentColor" strokeWidth={1.5} />
      {/* Lower whisker line */}
      <line x1={cx} y1={yMin} x2={cx} y2={yQ1} stroke="currentColor" strokeWidth={1.5} strokeDasharray="6 4" />

      {/* Box */}
      <rect x={cx - boxWidth / 2} y={Math.min(yQ1, yQ3)} width={boxWidth} height={Math.abs(yQ1 - yQ3)} fill="transparent" stroke="currentColor" strokeWidth={1.5} />

      {/* Median */}
      <line x1={x} y1={yMed} x2={x + boxWidth} y2={yMed} stroke="currentColor" strokeWidth={3} />

      {/* Upper whisker line */}
      <line x1={cx} y1={yQ3} x2={cx} y2={yMax} stroke="currentColor" strokeWidth={1.5} strokeDasharray="6 4" />
      {/* Max whisker */}
      <line x1={cx - boxWidth * 0.3} y1={yMax} x2={cx + boxWidth * 0.3} y2={yMax} stroke="currentColor" strokeWidth={1.5} />

      {/* Outliers */}
      {outliers && outliers.map((outlier: number, i: number) => {
        const yOut = yAxis.scale(outlier);
        return <circle key={i} cx={cx} cy={yOut} r={3} fill="currentColor" fillOpacity={0.5} stroke="none" />;
      })}
    </g>
  );
};

const formatBRL = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(val)
}

/* ------------------ COMPONENT ------------------ */
const Boxplot: React.FC<Props> = ({
  groups,
  values,
  singleLabel = "Todos",
  height = 360,
  title,
}) => {
  const dataset = useMemo(
    () => computeDataset(groups, values, singleLabel),
    [groups, values, singleLabel]
  );

  if (dataset.length === 0) return null;

  // Encontrar limites globais para o eixo Y
  let globalMin = Infinity;
  let globalMax = -Infinity;
  dataset.forEach(d => {
    if (d.min < globalMin) globalMin = d.min;
    if (d.outliers) {
      d.outliers.forEach(o => { if (o < globalMin) globalMin = o; });
    }
    if (d.max > globalMax) globalMax = d.max;
    if (d.outliers) {
      d.outliers.forEach(o => { if (o > globalMax) globalMax = o; });
    }
  });

  return (
    <Card className="h-full border-gray-200 shadow-sm rounded-xl">
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        <CardDescription>Visualização estatística de quartis e outliers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
          <ComposedChart data={dataset} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis
              domain={[globalMin * 0.95, globalMax * 1.05]}
              tickFormatter={formatBRL}
              tickLine={false}
              axisLine={false}
              width={80}
            />

            <ChartTooltip
              cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 40 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as BoxplotPoint;
                return (
                  <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg text-sm text-slate-800">
                    <div className="font-bold mb-2 pb-1 border-b border-gray-100">{d.name}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <span className="text-slate-500">Máximo:</span> <span className="font-medium text-right">{formatBRL(d.max)}</span>
                      <span className="text-slate-500">Q3:</span> <span className="font-medium text-right">{formatBRL(d.q3)}</span>
                      <span className="text-slate-500 font-semibold">Mediana:</span> <span className="font-bold text-right text-[#1677ff]">{formatBRL(d.med)}</span>
                      <span className="text-slate-500">Q1:</span> <span className="font-medium text-right">{formatBRL(d.q1)}</span>
                      <span className="text-slate-500">Mínimo:</span> <span className="font-medium text-right">{formatBRL(d.min)}</span>
                    </div>
                    {d.outliers && d.outliers.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-slate-500">
                        Outliers: {d.outliers.map(formatBRL).join(", ")}
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Scatter invisível apenas para engatilhar os dados corretamente para o tooltip e o shape */}
            <Scatter dataKey="med" shape={<BoxPlotShape />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Boxplot;
