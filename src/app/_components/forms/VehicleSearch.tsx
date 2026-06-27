import React, { useState, useEffect } from "react";
import { Search, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { getMarcas, getModelos, getAnos, getValor, Marca, Modelo } from "@/app/(services)/fipeApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Ano = { code: string; name: string };

export interface ValorFipe {
  price: string;
  brand: string;
  model: string;
  modelYear: number;
  fuel: string;
  codeFipe: string;
  referenceMonth: string;
  vehicleType: number;
  fuelAcronym: string;
}

interface VehicleSearchProps {
  onResult: (data: ValorFipe[]) => void;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ onResult }) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState<string>("");
  const [modeloSelecionado, setModeloSelecionado] = useState<string>("");

  const [openMarca, setOpenMarca] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);

  const [loadingMarcas, setLoadingMarcas] = useState<boolean>(true);
  const [loadingModelos, setLoadingModelos] = useState<boolean>(false);
  const [loadingAnalise, setLoadingAnalise] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Carregar marcas
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

  // Carregar modelos quando marca mudar
  useEffect(() => {
    if (!marcaSelecionada) return;

    (async () => {
      setLoadingModelos(true);
      try {
        const data = await getModelos(marcaSelecionada);
        setModelos(data);
      } finally {
        setLoadingModelos(false);
      }
    })();
  }, [marcaSelecionada]);

  const handleMarcaChange = (value: string) => {
    setMarcaSelecionada(value);
    setModeloSelecionado("");
    setModelos([]);
    onResult([]);
    setErrorMsg("");
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!marcaSelecionada || !modeloSelecionado) {
      setErrorMsg("Selecione a marca e o modelo.");
      return;
    }
    setErrorMsg("");
    setLoadingAnalise(true);

    try {
      const anos = await getAnos(marcaSelecionada, modeloSelecionado);

      const resultados = await Promise.all(
        anos.map(async (ano) => {
          return await getValor(marcaSelecionada, modeloSelecionado, ano.code);
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
    <form
      className="w-full m-0 p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
      onSubmit={handleAnalyze}
    >
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Marca */}
        <div className="flex-1 w-full space-y-2 flex flex-col">
          <Label htmlFor="marca">Marca</Label>
          <Popover open={openMarca} onOpenChange={setOpenMarca}>
            <PopoverTrigger
              render={
                <Button
                  id="marca"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal h-10 border-gray-300"
                  disabled={loadingMarcas}
                />
              }
            >
              <span className="truncate">
                {marcaSelecionada
                  ? marcas.find((m) => m.code.toString() === marcaSelecionada)?.name
                  : (loadingMarcas ? "Carregando..." : "Selecione uma marca")}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar marca..." />
                <CommandList>
                  <CommandEmpty>Nenhuma marca encontrada.</CommandEmpty>
                  <CommandGroup>
                    {marcas.map((m) => (
                      <CommandItem
                        key={m.code}
                        value={m.name}
                        onSelect={() => {
                          handleMarcaChange(m.code.toString());
                          setOpenMarca(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            marcaSelecionada === m.code.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {m.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Modelo */}
        <div className="flex-1 w-full space-y-2 flex flex-col">
          <Label htmlFor="modelo">Modelo</Label>
          <Popover open={openModelo} onOpenChange={setOpenModelo}>
            <PopoverTrigger
              render={
                <Button
                  id="modelo"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal h-10 border-gray-300"
                  disabled={!marcaSelecionada || loadingModelos}
                />
              }
            >
              <span className="truncate">
                {modeloSelecionado
                  ? modelos.find((m) => m.code.toString() === modeloSelecionado)?.name
                  : (loadingModelos ? "Carregando..." : "Selecione um modelo")}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar modelo..." />
                <CommandList>
                  <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {modelos.map((m) => (
                      <CommandItem
                        key={m.code}
                        value={m.name}
                        onSelect={() => {
                          setModeloSelecionado(m.code.toString());
                          setErrorMsg("");
                          setOpenModelo(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            modeloSelecionado === m.code.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {m.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Botão */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <Button
            type="submit"
            className="w-full md:w-[220px] h-10"
            disabled={!marcaSelecionada || !modeloSelecionado || loadingAnalise}
          >
            {loadingAnalise ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Analisar
          </Button>
        </div>
      </div>

      {errorMsg && (
        <p className="text-red-500 text-sm mt-3 font-medium">{errorMsg}</p>
      )}
    </form>
  );
};

export default VehicleSearch;
