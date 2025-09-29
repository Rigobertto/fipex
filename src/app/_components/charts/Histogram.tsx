"use client";

import React from "react";
import { Histogram } from "@ant-design/plots";
import type { HistogramConfig } from "@ant-design/plots";

type Props = {
  values: number[];  // dados numéricos crus
  bins?: number;     // nº de intervalos (default: sqrt(n))
  height?: number;
  title?: string;
};

type HistogramBinDatum = {
  range: [number, number];
  count: number;
};

const HistogramChart: React.FC<Props> = ({ values, bins, height = 320, title }) => {
  // nº de bins padrão = sqrt(n)
  const nBins = bins ?? Math.ceil(Math.sqrt(Math.max(values.length, 1)));

  // normaliza: { value }
  const data = React.useMemo(() => values.map((v) => ({ value: v })), [values]);

  // calcula binWidth a partir do range dos dados
  const binWidth = React.useMemo(() => {
    if (values.length === 0) return 1; // fallback seguro
    const min = Math.min(...values);
    const max = Math.max(...values);
    const width = (max - min) / Math.max(nBins, 1);
    return width > 0 ? width : 1; // evita zero quando todos valores são iguais
  }, [values, nBins]);

  const config: HistogramConfig = {
    data,
    binField: "value",
    binNumber: nBins,   // opcional, útil para intenção
    binWidth,           // requerido pelo tipo nessa versão
    height,
    columnStyle: { lineWidth: 1, stroke: "#333" },
    interactions: [{ type: "element-highlight" }],
    tooltip: {
      fields: ["range", "count"],
      formatter: (d: HistogramBinDatum) => ({
        name: `${d.range[0]} - ${d.range[1]}`,
        value: d.count,
      }),
    },
    xAxis: { title: { text: "Faixa de valores" } },
    yAxis: { title: { text: "Frequência" } },
  };

  return (
    <div className="flex flex-col gap-2">
      {title && <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
      <Histogram {...config} />
    </div>
  );
};

export default HistogramChart;
