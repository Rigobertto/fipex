// src/components/layout/FipeHeader.tsx
import React from "react";
import { Layout, Typography } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Header } = Layout;

type Props = {
  /** Texto do título */
  title?: string;
  /** Caminho da imagem do logo (opcional). Se não passar, usa o ícone */
  logoSrc?: string;
  /** Callback opcional ao clicar no logo */
  onLogoClick?: () => void;
};

const FipeHeader: React.FC<Props> = ({
  title = "Analisador de Preço de Veículos - Tabela FIPE",
  logoSrc,
  onLogoClick,
}) => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingInline: 16,
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {logoSrc ? (
        <img
          src={logoSrc}
          alt="Logo"
          style={{ height: 28, cursor: onLogoClick ? "pointer" : "default" }}
          onClick={onLogoClick}
        />
      ) : (
        <CarOutlined style={{ fontSize: 24, color: "#fff" }} />
      )}

      <Typography.Text
        style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}
        ellipsis
      >
        {title}
      </Typography.Text>
    </Header>
  );
};

export default FipeHeader;
