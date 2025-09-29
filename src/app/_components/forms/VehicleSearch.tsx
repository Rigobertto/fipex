import React, { useState, useEffect } from "react";
import { Button, Form, Select, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getMarcas, getModelos, getAnos, getValor, Marca, Modelo } from "@/app/(services)/fipeApi";

interface VehicleSearchProps {
  onResult: (data: any[]) => void; // envia array com todos os anos + valores
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ onResult }) => {
  const [form] = Form.useForm();

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState<string>("");
  const [modeloSelecionado, setModeloSelecionado] = useState<string>("");

  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingAnalise, setLoadingAnalise] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMarcas();
        setMarcas(data);
      } finally {
        setLoadingMarcas(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!marcaSelecionada) return;
    (async () => {
      setLoadingModelos(true);
      try {
        const data = await getModelos(marcaSelecionada);
        setModelos(data.modelos);
      } finally {
        setLoadingModelos(false);
      }
    })();
  }, [marcaSelecionada]);

  const handleAnalyze = async () => {
    await form.validateFields();
    if (!marcaSelecionada || !modeloSelecionado) return;

    setLoadingAnalise(true);
    try {
      const anos = await getAnos(marcaSelecionada, modeloSelecionado);
      const resultados = await Promise.all(
        anos.map(async (ano: any) => {
          const valor = await getValor(marcaSelecionada, modeloSelecionado, ano.codigo);
          return valor;
        })
      );
      onResult(resultados);
    } catch (error) {
      console.error("Erro ao carregar anos e valores:", error);
      onResult([]);
    } finally {
      setLoadingAnalise(false);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      style={{
        width: "100%",
        margin: 0,
        padding: 16,
        border: "1px solid #eaeaea",
        borderRadius: 12,
        background: "#fff",
      }}
      onFinish={handleAnalyze}
    >
      <Row gutter={[16, 16]} wrap>
        {/* Marca: expande */}
        <Col xs={24} flex="1 1 360px">
          <Form.Item label="Marca" name="marca" rules={[{ required: true, message: "Selecione a marca" }]}>
            <Select
              size="large"
              placeholder="Selecione uma marca"
              loading={loadingMarcas}
              showSearch
              allowClear
              optionFilterProp="label"
              onChange={(v) => {
                setMarcaSelecionada(v);
                setModeloSelecionado("");
                setModelos([]);
                form.setFieldsValue({ modelo: undefined });
                onResult([]); // limpa resultados anteriores
              }}
              options={marcas.map((m) => ({ label: m.nome, value: m.codigo }))}
            />
          </Form.Item>
        </Col>

        {/* Modelo: expande */}
        <Col xs={24} flex="1 1 360px">
          <Form.Item label="Modelo" name="modelo" rules={[{ required: true, message: "Selecione o modelo" }]}>
            <Select
              size="large"
              placeholder="Selecione um modelo"
              loading={loadingModelos}
              disabled={!marcaSelecionada}
              showSearch
              allowClear
              optionFilterProp="label"
              onChange={(v) => setModeloSelecionado(v)}
              options={modelos.map((m) => ({ label: m.nome, value: m.codigo }))}
            />
          </Form.Item>
        </Col>

        {/* Botão: largura só do conteúdo */}
        <Col xs={24} flex="0 0 220px">
          <Form.Item label=" " colon={false} style={{ margin: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SearchOutlined />}
              block
              loading={loadingAnalise}
              disabled={!marcaSelecionada || !modeloSelecionado}
            >
              Analisar
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default VehicleSearch;
