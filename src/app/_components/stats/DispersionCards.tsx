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
  const xbar = mean(arr);
  const denom = pop ? arr.length : Math.max(1, arr.length - 1);
  const sum = arr.reduce((acc, x) => acc + Math.pow(x - xbar, 2), 0);
  return sum / denom;
}
function stddev(arr: number[], pop = false) {
  return Math.sqrt(variance(arr, pop));
}
function cv(arr: number[], pop = false) {
  const xbar = mean(arr);
  const s = stddev(arr, pop);
  return xbar === 0 ? 0 : (s / xbar) * 100;
}

function formatNumber(n: number, locale = "pt-BR", maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(n);
}

function buildAutoStats(
  values: number[],
  opt?: { precision?: number; population?: boolean; locale?: string }
): StatItem[] {
  const precision = opt?.precision ?? 2;
  const population = opt?.population ?? false; // padrão amostral
  const locale = opt?.locale ?? "pt-BR";

  const xbar = mean(values);
  const s2 = variance(values, population);
  const s = Math.sqrt(s2);
  const CV = cv(values, population);
  const N = values.length;

  const sumSq = values.reduce((acc, x) => acc + Math.pow(x - xbar, 2), 0);
  const MADsum = values.reduce((acc, x) => acc + Math.abs(x - xbar), 0);
  const MAD = MADsum / N;

  const denomLabel = population ? "N" : "n - 1";
  const denomValue = population ? N : Math.max(1, N - 1);
  const sym = population ? "σ" : "s";

  return [
    {
      title: `Variância`,
      value: formatNumber(s2, locale, precision),
      sections: [
        { title: "Fórmula", content: <p>{sym}² = ∑(xi − x̄)² / {denomLabel}</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                x̄ = {" "}
                <span className="font-semibold">{formatNumber(xbar, locale, precision)}</span>
              </p>
              <p>
                {denomLabel} = <span className="font-semibold">{denomValue}</span>
              </p>
              <p>
                ∑(xi − x̄)² ={" "}
                <span className="font-semibold">{formatNumber(sumSq, locale, precision)}</span>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              {sym}² = {formatNumber(sumSq, locale, precision)} / {denomValue} →{" "}
              <span className="font-semibold">{formatNumber(s2, locale, precision)}</span>
            </p>
          ),
        },
      ],
    },

    {
      title: `Desvio Padrão`,
      value: formatNumber(s, locale, precision),
      sections: [
        { title: "Fórmula", content: <p>{sym} = √( ∑(xi − x̄)² / {denomLabel} )</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                x̄ = {" "}
                <span className="font-semibold">{formatNumber(xbar, locale, precision)}</span>
              </p>
              <p>
                {denomLabel} = <span className="font-semibold">{denomValue}</span>
              </p>
              <p>
                ∑(xi − x̄)² ={" "}
                <span className="font-semibold">{formatNumber(sumSq, locale, precision)}</span>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              {sym} = √{formatNumber(s2, locale, precision)} ={" "}
              <span className="font-semibold">{formatNumber(s, locale, precision)}</span>
            </p>
          ),
        },
      ],
    },

    {
      title: "Desvio Médio",
      value: formatNumber(MAD, locale, precision),
      sections: [
        {
          title: "Fórmula",
          content: <p>DM = ∑ |xi − x̄| / n</p>,
        },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                x̄ ={" "}
                <span className="font-semibold">{formatNumber(xbar, locale, precision)}</span>
              </p>
              <p>
                n = <span className="font-semibold">{N}</span>
              </p>
              <p>
                ∑ |xi − x̄| ={" "}
                <span className="font-semibold">{formatNumber(MADsum, locale, precision)}</span>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              DM = {formatNumber(MADsum, locale, precision)} / {N} →{" "}
              <span className="font-semibold">{formatNumber(MAD, locale, precision)}</span>
            </p>
          ),
        },
      ],
    },

    {
      title: "Coeficiente de Variação (CV)",
      value: `${formatNumber(CV, locale, precision)}%`,
      sections: [
        { title: "Fórmula", content: <p>CV = ({sym} / x̄) × 100%</p> },
        {
          title: "Onde:",
          content: (
            <>
              <p>
                {sym}  ={" "}
                <span className="font-semibold">{formatNumber(s, locale, precision)}</span>
              </p>
              <p>
                x̄ ={" "}
                <span className="font-semibold">{formatNumber(xbar, locale, precision)}</span>
              </p>
            </>
          ),
        },
        {
          title: "Cálculo:",
          content: (
            <p>
              CV = ({formatNumber(s, locale, precision)} /{" "}
              {formatNumber(xbar, locale, precision)}) × 100% ={" "}
              <span className="font-semibold">{formatNumber(CV, locale, precision)}%</span>
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
          population: props.population, 
          locale: props.locale,
        })
      : props.stats;

  return (
    <div className={`flex w-full gap-4 flex-wrap ${layout === "vertical" ? "flex-col" : "flex-col md:flex-row"}`}>
      {stats.map((s) => (
        <div key={s.title} className="flex-1 min-w-[250px]">
          <StatCard title={s.title} value={s.value} sections={s.sections} />
        </div>
      ))}
    </div>
  );
};

export default DispersionCards;
