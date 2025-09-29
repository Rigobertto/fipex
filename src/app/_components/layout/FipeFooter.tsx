// src/components/layout/FipeFooter.tsx
import React from "react";
import { Layout, Typography, Space, Row, Col, Divider } from "antd";
import { GithubOutlined, MailOutlined, ApiOutlined } from "@ant-design/icons";

const { Footer } = Layout;

type LinkItem = {
  key: string;
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type Props = {
  logoSrc?: string;
  brand?: string;          // texto da marca
  version?: string;        // ex.: "v1.2.3"
  links?: LinkItem[];      // links rápidos (opcional)
  rightNote?: string;      // ex.: "Criado por Lemarq Software"
};

const FipeFooter: React.FC<Props> = ({
  logoSrc,
  brand = "Analisador de Preço de Veículos • Tabela FIPE",
  version,
  links,
  rightNote = "Fipex",
}) => {
  const year = new Date().getFullYear();

  return (
    <Footer
      style={{
        padding: "24px 48px",
        //background: "rgba(255,255,255,0.12)",
        //borderTop: "1px solid #f0f0f0",
         textAlign: "center",
        background: "#001529",                 // mesma cor do Header
        color: "rgba(255,255,255,0.85)",       // texto claro
        borderTop: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Marca */}
        <Col xs={24} md={10}>
          <Space align="center" size={12} wrap>
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" style={{ height: 28 }} />
            ) : (
              <ApiOutlined style={{ fontSize: 22, color: "#f0f0f0" }} />
            )}
            <Typography.Text style={{ fontWeight: 600,  color: "#f0f0f0"  }}>
              {brand}
            </Typography.Text>
            {version && (
              <Typography.Text type="secondary" style={{ marginLeft: 8,  color: "#f0f0f0" }}>
                {version}
              </Typography.Text>
            )}
          </Space>
        </Col>

        {/* Links rápidos */}
        <Col xs={24} md={8}>
          {links && links.length > 0 && (
            <Space split={<Divider type="vertical"  />} wrap>
              {links.map((l) =>
                l.href ? (
                  <a key={l.key} href={l.href} target="_blank" rel="noreferrer" style={{ color: "#f0f0f0" }}>
                    {l.label}
                  </a>
                ) : (
                  <Typography.Link key={l.key} onClick={l.onClick}>
                    {l.label}
                  </Typography.Link>
                )
              )}
            </Space>
          )}
        </Col>

        {/* Direitos/nota */}
        <Col xs={24} md={6} style={{ textAlign: "right" }}>
          <Space size={10} wrap>
            <a style={{ color: "#F15721" }}
              href="rigo.rfp@gmail.com"
              aria-label="Contato por e-mail"
              title="Contato"
            >
              <MailOutlined />
            </a>
            <a style={{ color: "#F15721" }}
              href="https://github.com/rigobertto"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <GithubOutlined />
            </a>
          </Space>
          <div style={{ marginTop: 6 }}>
            <Typography.Text type="secondary" style={{ color: "#f0f0f0" }}> 
              © {year} {rightNote}
            </Typography.Text>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default FipeFooter;
