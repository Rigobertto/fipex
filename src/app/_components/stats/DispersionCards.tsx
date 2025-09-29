// src/components/stats/DispersionCards.tsx
import React from "react";
import { Flex, Typography } from "antd";
import StatCard from "../ui/Card";

const { Text } = Typography;

type Section = {
  title: string;
  content: React.ReactNode;
};

export type StatItem = {
  title: string;
  value: string | number;
  sections: Section[];
};

type Props =
  | {
      /** Calcula automaticamente a partir destes valores */
      values: number[];
      /** Layout dos cards */
      layout?: "vertical" | "horizontal";
      /** Casas decimais para números */
      precision?: number;
      /** Se true usa população (N); se false usa amostra (n-1) — padrão: amostra */
      population?: boolean;
      /** Locale para formatar números (padrão pt-BR) */
      locale?: string;
    }
  | {
      /** Renderiza cards prontos */
      stats: StatItem[];
      layout?: "vertical" | "horizontal";
    };

function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function median(arr: number[]) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function variance(arr: number[], pop = false) {
  const μ = mean(arr);
  const denom = pop ? arr.length : Math.max(1, arr.length - 1);
  const sum = arr.reduce((acc, x) => acc + Math.pow(x - μ, 2), 0);
  return sum / denom;
}
function stddev(arr: number[], pop = false) {
  return Math.sqrt(variance(arr, pop));
}
function cv(arr: number[], pop = false) {
  const μ = mean(arr);
  const σ = stddev(arr, pop);
  return μ === 0 ? 0 : (σ / μ) * 100;
}

function formatNumber(n: number, locale = "pt-BR", maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(n);
}

function buildAutoStats(
  values: number[],
  opt?: { precision?: number; population?: boolean; locale?: string }
): StatItem[] {
  const precision = opt?.precision ?? 2;
  // 🔽 Padrão agora é amostral (population = false)
  const population = opt?.population ?? false;
  const locale = opt?.locale ?? "pt-BR";

  const μ = mean(values);
  const med = median(values);
  const σ2 = variance(values, population);
  const σ = Math.sqrt(σ2);
  const CV = cv(values, population);
  const N = values.length;
  const sumSq = values.reduce((acc, x) => acc + Math.pow(x - μ, 2), 0);

  const denomLabel = population ? "N" : "n - 1";
  const denomValue = population ? N : Math.max(1, N - 1);
  // Use símbolo “s” para amostra, “σ” para população
  const sym = population ? "σ" : "s";

  return [
    {
      title: `Variância (${population ? "Populacional" : "Amostral"})`,
      value: formatNumber(σ2, locale, precision),
      sections: [
        { title: "Fórmula", content: <p>{sym}² = ∑(xi − μ)² / {denomLabel}</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                μ (média) = <Text strong>{formatNumber(μ, locale, precision)}</Text>
              </p>
              <p>
                {denomLabel} = <Text strong>{denomValue}</Text>
              </p>
              <p>
                ∑(xi − μ)² = <Text strong>{formatNumber(sumSq, locale, precision)}</Text>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              {sym}² = {formatNumber(sumSq, locale, precision)} / {denomValue} →{" "}
              <Text strong>{formatNumber(σ2, locale, precision)}</Text>
            </p>
          ),
        },
      ],
    },
    {
      title: `Desvio Padrão (${population ? "Populacional" : "Amostral"})`,
      value: formatNumber(σ, locale, precision),
      sections: [
        { title: "Fórmula", content: <p>{sym} = √( ∑(xi − μ)² / {denomLabel} )</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                μ (média) = <Text strong>{formatNumber(μ, locale, precision)}</Text>
              </p>
              <p>
                {denomLabel} = <Text strong>{denomValue}</Text>
              </p>
              <p>
                ∑(xi − μ)² = <Text strong>{formatNumber(sumSq, locale, precision)}</Text>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              {sym} = √{formatNumber(σ2, locale, precision)} ={" "}
              <Text strong>{formatNumber(σ, locale, precision)}</Text>
            </p>
          ),
        },
      ],
    },
    {
      title: "Coeficiente de Variação (CV)",
      value: `${formatNumber(CV, locale, precision)}%`,
      sections: [
        { title: "Fórmula", content: <p>CV = ({sym} / μ) × 100%</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                {sym} (desvio padrão) = <Text strong>{formatNumber(σ, locale, precision)}</Text>
              </p>
              <p>
                μ (média) = <Text strong>{formatNumber(μ, locale, precision)}</Text>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              CV = ({formatNumber(σ, locale, precision)} / {formatNumber(μ, locale, precision)}) × 100% ={" "}
              <Text strong>{formatNumber(CV, locale, precision)}%</Text>
            </p>
          ),
        },
      ],
    },
    {
      title: "Média",
      value: formatNumber(μ, locale, precision),
      sections: [
        { title: "Fórmula", content: <p>μ = (∑xi) / n</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                ∑xi = <Text strong>{formatNumber(values.reduce((a, b) => a + b, 0), locale, precision)}</Text>
              </p>
              <p>
                n = <Text strong>{N}</Text>
              </p>
            </>
          ),
        },
        {
          title: "Resultado:",
          content: (
            <p>
              μ = <Text strong>{formatNumber(μ, locale, precision)}</Text>
            </p>
          ),
        },
      ],
    },
    {
      title: "Mediana",
      value: formatNumber(med, locale, precision),
      sections: [
        { title: "Definição", content: <p>Valor central que divide a amostra em duas partes iguais</p> },
        {
          title: "Cálculo:",
          content: (
            <p>
              Mediana = <Text strong>{formatNumber(med, locale, precision)}</Text>
            </p>
          ),
        },
      ],
    },
  ];
}

const DispersionCards: React.FC<Props> = (props) => {
  const layout = (props as any).layout ?? "horizontal";

  const stats: StatItem[] =
    "values" in props
      ? buildAutoStats(props.values, {
          precision: (props as any).precision,
          population: (props as any).population, // padrão já é amostral (false)
          locale: (props as any).locale,
        })
      : (props as any).stats;

  return (
    <Flex vertical={layout === "vertical"} style={{ width: "100%" }} gap={16}>
      {stats.map((s) => (
        <StatCard key={s.title} title={s.title} value={s.value} sections={s.sections} />
      ))}
    </Flex>
  );
};

export default DispersionCards;
