// src/components/stats/DispersionCards.tsx
import React from "react";
import StatCard from "../ui/Card";

type Section = {
  title: string;
  content: React.ReactNode;
};

export type StatItem = {
  title: string;
  value: string | number;
  sections: Section[];
};

type BaseProps = {
  /** Layout dos cards */
  layout?: "vertical" | "horizontal";
};

type AutoProps = BaseProps & {
  /** Calcula automaticamente a partir destes valores */
  values: number[];
  /** Casas decimais para números */
  precision?: number;
  /** Se true usa população (N); se false usa amostra (n-1) — padrão: amostra */
  population?: boolean;
  /** Locale para formatar números (padrão pt-BR) */
  locale?: string;
};

type ManualProps = BaseProps & {
  /** Renderiza cards prontos */
  stats: StatItem[];
};

type Props = AutoProps | ManualProps;

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
  // Padrão amostral (population = false)
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
  const sym = population ? "σ" : "s";

  return [
    {
      title: "Média",
      value: formatNumber(μ, locale, precision),
      sections: [
        { title: "Fórmula", content: <p>x̄ = (∑xi) / n</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                ∑xi = <span className="font-semibold">{formatNumber(values.reduce((a, b) => a + b, 0), locale, precision)}</span>
              </p>
              <p>
                n = <span className="font-semibold">{N}</span>
              </p>
            </>
          ),
        },
        {
          title: "Resultado:",
          content: (
            <p>
              x̄ = <span className="font-semibold">{formatNumber(μ, locale, precision)}</span>
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
              Mediana = <span className="font-semibold">{formatNumber(med, locale, precision)}</span>
            </p>
          ),
        },
      ],
    },
  ];
}

const DispersionCards: React.FC<Props> = (props) => {
  const layout: NonNullable<Props["layout"]> = props.layout ?? "horizontal";

  const stats: StatItem[] =
    "values" in props
      ? buildAutoStats(props.values, {
          precision: props.precision,
          population: props.population, // padrão já é amostral (false)
          locale: props.locale,
        })
      : props.stats;

  return (
    <div className={`flex w-full gap-4 ${layout === "vertical" ? "flex-col" : "flex-col md:flex-row"}`}>
      {stats.map((s) => (
        <StatCard key={s.title} title={s.title} value={s.value} sections={s.sections} />
      ))}
    </div>
  );
};

export default DispersionCards;