"use client";

import React from 'react';
import {
  Breadcrumb, Col, Layout, Row, theme, Typography
} from 'antd';
import VehicleSearch from '../forms/VehicleSearch';
import DispersionCards from '../stats/DispersionCards';
import FipeHeader from './FipeHeader';
import FipeFooter from './FipeFooter';
import Boxplot from '../charts/Boxplot';

const { Title, Text } = Typography;
const { Content } = Layout;

const Dashboard: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [vehicleData, setVehicleData] = React.useState<any[]>([]);

  // Parser seguro para "R$ 123.456,78" — memoizado
  const parseBRL = React.useCallback((v: any) => {
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
      .map(v => parseBRL(v.Valor))
      .filter((n) => Number.isFinite(n));
  }, [vehicleData, parseBRL]);

  // Grupos por ano (para boxplot categorizado)
  const grupos = React.useMemo(() => {
    const map = new Map<string | number, number[]>();
    for (const v of vehicleData) {
      const ano = v.AnoModelo ?? "Sem Ano";
      const val = parseBRL(v.Valor);
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
    <Layout style={{ minHeight: "100vh" }}>
      <FipeHeader logoSrc="../../../logo.svg" onLogoClick={() => console.log("home")} />

      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Title level={2}>Selecione Marca e Modelo</Title>

          {/* Pesquisa */}
          <VehicleSearch onResult={setVehicleData} />

          {/* DADOS — só aparece após seleção/análise */}
          {vehicleData.length > 0 ? (
            <div style={{ margin: 20, width: '100%', borderRadius: 12, padding: 12 }}>
              <Title level={2}>
                VEÍCULO: {vehicleData[0].Marca} - {vehicleData[0].Modelo}
              </Title>

              <Row gutter={[16, 16]}>
                {vehicleData.map((v, index) => (
                  <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                    <div
                      style={{
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        padding: 12,
                        background: '#fafafa',
                      }}
                    >
                      <p><Text strong>Ano:</Text> {v.AnoModelo}</p>
                      <p><Text strong>Valor:</Text> {v.Valor}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Selecione marca e modelo e clique em <Text strong>Analisar</Text> para ver os dados.</Text>
            </div>
          )}

          {/* MEDIDAS — só aparece após seleção/análise */}
          {valores.length > 0 && (
            <>
              <Title level={2} style={{ margin: 20 }}>Medidas de Dispersão</Title>
              <DispersionCards
                values={valores}
                layout="horizontal"
                precision={2}
                population={false}
                locale="pt-BR"
              />
            </>
          )}
          {/* GRÁFICOS — só aparece após seleção/análise */}

          <div style={{ padding: 24, display: 'grid', gap: 24 }}>
          {/* Boxplot geral (um único grupo “Todos”) */}
            {valores.length > 0 && (
              <Boxplot
              values={valores}
              title="Distribuição de Valores (Todos)"
              height={340}
              />
            )}

            {/* Boxplot por ano (categorias) */}
            {grupos.length > 0 && (
              <Boxplot
                groups={grupos}  // [{ x: ano, values: number[] }, ...]
                title="Distribuição por Ano (FIPE)"
                height={380}
              />
            )}
          </div>

          {/* {valores.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <HistogramChart
                values={valores}
                bins={10}    // opcional: nº de classes (default = √n)
                title="Distribuição de Frequência (Histograma)"
                height={300}
              />
            </div>
          )} */}
        </div>


      </Content>

      <FipeFooter
        logoSrc="../../../logo.svg"
        brand="Analisador de Preço de Veículos • Tabela FIPE"
        version="v1.0.0"
        links={[]}
        rightNote="Rigoberto Fernandes"
      />
    </Layout>
  );
};

export default Dashboard;
