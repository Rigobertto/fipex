"use client";

import React from 'react';
import VehicleSearch from '../forms/VehicleSearch';
import DispersionCards from '../stats/DispersionCards';
import CentralCards from '../stats/CentralCards';
import FipeHeader from './FipeHeader';
import FipeFooter from './FipeFooter';
import Boxplot from '../charts/Boxplot';
import { YearBarChart } from '../charts/YearBarChart';

const Dashboard: React.FC = () => {
  type ValorFipe = {
    price: string;
    brand: string;
    model: string;
    modelYear: number;
    fuel: string;
    codeFipe: string;
    referenceMonth: string;
    vehicleType: number;
    fuelAcronym: string;
  };

  const [vehicleData, setVehicleData] = React.useState<ValorFipe[]>([]);

  // Parser seguro para "R$ 123.456,78" — memoizado
  const parseBRL = React.useCallback((v: unknown) => {
    if (typeof v === 'number') return v;
    if (typeof v !== 'string') return NaN;
    return Number(
      v.replace(/[^\d,.-]/g, '') // remove R$, espaços e pontos
        .replace(/\./g, '')      // remove milhares
        .replace(',', '.')       // decimal
    );
  }, []);

  // Valores numéricos (para boxplot geral e cards)
  const valores = React.useMemo(() => {
    if (!vehicleData?.length) return [];
    return vehicleData
      .map(v => parseBRL(v.price))
      .filter((n) => Number.isFinite(n));
  }, [vehicleData, parseBRL]);

  // Grupos por ano (para boxplot categorizado)
  const grupos = React.useMemo(() => {
    const map = new Map<string | number, number[]>();
    for (const v of vehicleData) {
      const ano = v.modelYear ?? "Sem Ano";
      const val = parseBRL(v.price);
      if (!Number.isFinite(val)) continue;
      if (!map.has(ano)) map.set(ano, []);
      map.get(ano)!.push(val);
    }
    // Ordena por rótulo (se ano, ordena numericamente)
    return Array
      .from(map, ([x, values]) => ({ x, values }))
      .sort((a, b) => Number(a.x) - Number(b.x));
  }, [vehicleData, parseBRL]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <FipeHeader logoSrc="../../../logo.svg" onLogoClick={() => console.log("home")} />

      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8">
        <div className="bg-white min-h-[280px] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Selecione Marca e Modelo</h2>

          {/* Pesquisa */}
          <VehicleSearch onResult={setVehicleData} />

          {/* DADOS — só aparece após seleção/análise */}
          {vehicleData.length > 0 ? (
            <div className="mt-8 mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold mb-6 text-slate-800 uppercase">
                VEÍCULO: {vehicleData[0].brand} - {vehicleData[0].model}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {vehicleData.map((v, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
                  >
                    <p className="text-slate-600 mb-1"><span className="font-semibold text-slate-800">Ano:</span> {v.modelYear}</p>
                    <p className="text-slate-600"><span className="font-semibold text-slate-800">Valor:</span> {v.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-slate-500">Selecione marca e modelo e clique em <span className="font-semibold text-slate-700">Analisar</span> para ver os dados.</p>
            </div>
          )}

           {/* MEDIDAS CENTRAIS — só aparece após seleção/análise */}
          {valores.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Medidas Centrais</h2>
              <CentralCards
                values={valores}
                layout="horizontal"
                precision={2}
                population={false}
                locale="pt-BR"
              />
            </div>
          )}

          {/* MEDIDAS DISPERSÃO — só aparece após seleção/análise */}
          {valores.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Medidas de Dispersão</h2>
              <DispersionCards
                values={valores}
                layout="horizontal"
                precision={2}
                population={false}
                locale="pt-BR"
              />
            </div>
          )}
          {/* GRÁFICOS — só aparece após seleção/análise */}

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Boxplot geral (um único grupo “Todos”) */}
            {valores.length > 0 && (
              <Boxplot
              values={valores}
              title="Distribuição de Valores (Todos)"
              height={340}
              />
            )}

            {/* Gráfico de barras por ano (categorias) */}
            {grupos.length > 0 && (
              <YearBarChart
                groups={grupos}
                title="Distribuição de Preço por Ano (FIPE)"
              />
            )}
          </div>
        </div>
      </main>

      <FipeFooter
        logoSrc="../../../logo.svg"
        brand="Analisador de Preço de Veículos • Tabela FIPE"
        version="v1.0.0"
        links={[]}
        rightNote="Created by Rigoberto Fernandes"
      />
    </div>
  );
};

export default Dashboard;
