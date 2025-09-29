"use client";

import React from "react";
import { Histogram } from "@ant-design/plots";

type Props = {
  values: number[];         // dados numéricos crus
  bins?: number;            // nº de intervalos (default: sqrt(n))
  height?: number;
  title?: string;
};

const HistogramChart: React.FC<Props> = ({ values, bins, height = 320, title }) => {
  // se não vier nº de bins, usa sqrt(n)
  const nBins = bins ?? Math.ceil(Math.sqrt(values.length));

  // normaliza os dados para objeto { value }
  const data = values.map((v) => ({ value: v }));

  const config: any = {
    data,
    binField: "value",
    binNumber: nBins,
    tooltip: {
      fields: ["range", "count"],
      formatter: (d: any) => ({
        name: `${d.range[0]} - ${d.range[1]}`,
        value: d.count,
      }),
    },
    height,
    columnStyle: {
      lineWidth: 1,
      stroke: "#333",
    },
    interactions: [{ type: "element-highlight" }],
    xAxis: {
      title: { text: "Faixa de valores" },
    },
    yAxis: {
      title: { text: "Frequência" },
    },
  };

  return (
    <div className="flex flex-col gap-2">
      {title && <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
      <Histogram {...config} />
    </div>
  );
};

export default HistogramChart;
