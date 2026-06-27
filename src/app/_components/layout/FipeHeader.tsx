// src/components/layout/FipeHeader.tsx
import React from "react";
import { CarFront } from "lucide-react";

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
    <header className="flex items-center justify-between gap-3 px-4 h-16 border-b border-white/10 bg-slate-900">
      <div className="flex items-center gap-3">
        {logoSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={logoSrc}
            alt="Logo"
            className={`h-7 ${onLogoClick ? "cursor-pointer" : "cursor-default"}`}
            onClick={onLogoClick}
          />
        ) : (
          <CarFront className="w-6 h-6 text-white" />
        )}
        <span className="text-white font-bold text-base truncate">
          {title}
        </span>
      </div>
    </header>
  );
};

export default FipeHeader;
