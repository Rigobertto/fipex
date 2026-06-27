// src/components/layout/FipeFooter.tsx
import React from "react";
import { Github, Mail, CarFront } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    <footer className="px-6 py-8 sm:px-12 bg-slate-900 text-white/85 text-center border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Marca */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="h-7" />
          ) : (
            <CarFront className="w-5 h-5 text-gray-200" />
          )}
          <span className="font-semibold text-gray-200">
            {brand}
          </span>
          {version && (
            <span className="text-gray-400 ml-2">
              {version}
            </span>
          )}
        </div>

        {/* Links rápidos */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {links && links.length > 0 && links.map((l, index) => (
            <React.Fragment key={l.key}>
              {l.href ? (
                <a href={l.href} target="_blank" rel="noreferrer" className="text-gray-200 hover:text-white transition-colors">
                  {l.label}
                </a>
              ) : (
                <button onClick={l.onClick} className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  {l.label}
                </button>
              )}
              {index < links.length - 1 && (
                <Separator orientation="vertical" className="h-4 bg-white/20" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Direitos/nota */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <div className="flex gap-4">
            <a
              href="mailto:rigo.rfp@gmail.com"
              aria-label="Contato por e-mail"
              title="Contato"
              className="text-[#F15721] hover:text-orange-400 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/rigobertto"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="text-[#F15721] hover:text-orange-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <div className="mt-2 text-sm text-gray-300">
            © {year} {rightNote}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FipeFooter;
