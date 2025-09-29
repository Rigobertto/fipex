// services/fipeApi.ts

// A URL base fornecida na documentação
const API_BASE_URL = "https://parallelum.com.br/fipe/api/v1";

// Tipos para ajudar com a autocompletação e segurança de tipo
export interface Marca {
  codigo: string;
  nome: string;
}

export interface Modelo {
  codigo: number;
  nome: string;
}

export interface Ano {
    codigo: string;
    nome: string;
}

export interface Valor {
    Valor: string;
    Marca: string;
    Modelo: string;
    AnoModelo: number;
    Combustivel: string;
    CodigoFipe: string;
    MesReferencia: string;
    TipoVeiculo: number;
    SiglaCombustivel: string;
}


// Função genérica para fazer as requisições
async function fetchFipeData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Falha ao buscar dados da FIPE:", error);
    throw error; // Propaga o erro para quem chamou a função
  }
}

// Funções específicas para cada endpoint da API
// Por enquanto, vamos focar em carros ('/carros')

export const getMarcas = async (): Promise<Marca[]> => {
  return fetchFipeData<Marca[]>('/carros/marcas');
};

export const getModelos = async (codigoMarca: string): Promise<{ modelos: Modelo[], anos: Ano[] }> => {
  if (!codigoMarca) throw new Error("Código da marca é obrigatório");
  return fetchFipeData<{ modelos: Modelo[], anos: Ano[] }>(`/carros/marcas/${codigoMarca}/modelos`);
};

export const getAnos = async (codigoMarca: string, codigoModelo: string): Promise<Ano[]> => {
    if (!codigoMarca || !codigoModelo) throw new Error("Código da marca e do modelo são obrigatórios");
    return fetchFipeData<Ano[]>(`/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`);
};

export const getValor = async (codigoMarca: string, codigoModelo: string, codigoAno: string): Promise<Valor> => {
    if (!codigoMarca || !codigoModelo || !codigoAno) throw new Error("Código da marca, modelo e ano são obrigatórios");
    return fetchFipeData<Valor>(`/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`);
};