"use client";

import React from "react";
import { Box } from "@ant-design/plots";

/** Entrada alternativa 1: valores por grupo */
export type BoxplotGroupInput = {
  x: string | number;
  values: number[];
};

/** Entrada alternativa 2: valores “gerais” (um único grupo) */
export type BoxplotValuesInput = number[];

/** Saída interna (cinco números + outliers) */
export type BoxplotPoint = {
  x: string | number;
  y: [number, number, number, number, number]; // [min, q1, med, q3, max]
  outliers?: number[];
};

type Props = {
  /** Passe `groups` para boxplot por categoria… */
  groups?: BoxplotGroupInput[];
  /** …ou `values` para um boxplot único (“Geral”). */
  values?: BoxplotValuesInput;

  /** Rótulo usado quando `values` é passado (default: "Todos") */
  singleLabel?: string | number;

  /** Altura do gráfico */
  height?: number;

  /** Título opcional acima do gráfico */
  title?: string;

  /** Controla se mostra info de outliers no tooltip (cálculo sempre é feito) */
  showOutliersInTooltip?: boolean;
};

/* ------------------ HELPERS ESTATÍSTICOS ------------------ */
function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Quartis no método de Tukey: exclui a mediana quando n é ímpar */
function quartiles(sorted: number[]): { q1: number; q3: number } {
  const n = sorted.length;
  if (n <= 1) return { q1: sorted[0] ?? NaN, q3: sorted[n - 1] ?? NaN };
  const mid = Math.floor(n / 2);
  const lower = sorted.slice(0, mid);
  const upper = sorted.slice(n % 2 ? mid + 1 : mid);
  return { q1: median(lower), q3: median(upper) };
}

/** Constrói ponto do boxplot + outliers via regra 1.5*IQR */
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
    x: label,
    y: [min, q1, med, q3, max],
    outliers: outliers.length ? outliers : undefined,
  };
}

/** Converte entradas (groups/values) para BoxplotPoint[] */
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
    // Ordena pelo rótulo (se forem anos, funciona bem)
    return pts.sort((a, b) => String(a.x).localeCompare(String(b.x)));
  }

  if (values && values.length) {
    const p = buildPoint(singleLabel, values);
    return p ? [p] : [];
  }

  return [];
}

/* ------------------ COMPONENTE ------------------ */
const Boxplot: React.FC<Props> = ({
  groups,
  values,
  singleLabel = "Todos",
  height = 360,
  title,
  showOutliersInTooltip = true,
}) => {
  const dataset = React.useMemo(
    () => computeDataset(groups, values, singleLabel),
    [groups, values, singleLabel]
  );

  const config: any = {
    data: dataset,
    xField: "x",
    yField: "y", // [min, q1, median, q3, max]
    height,
    legend: false,
    boxStyle: { lineWidth: 1},
    tooltip: {
      customContent: (name: string, items: any[]) => {
        if (!items?.length) return "";
        const d = items[0]?.data as BoxplotPoint;
        if (!d) return "";

        const [min, q1, med, q3, max] = d.y;

        const outliersHtml =
          showOutliersInTooltip && d.outliers?.length
            ? `<div style="margin-top:6px">Outliers: <b>${d.outliers.join(", ")}</b></div>`
            : "";

        return `
          <div style="padding:8px 12px">
            <div style="font-weight:600;margin-bottom:6px">${name}</div>
            <div>min: <b>${min}</b></div>
            <div>Q1 : <b>${q1}</b></div>
            <div>Med : <b>${med}</b></div>
            <div>Q3 : <b>${q3}</b></div>
            <div>max: <b>${max}</b></div>
            ${outliersHtml}
          </div>
        `;
      },
    },
    annotations: [],
  };

  return (
    <div className="flex flex-col gap-2">
      {title && <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
      <Box {...config} />
    </div>
  );
};

export default Boxplot;
