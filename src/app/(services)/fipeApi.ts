// services/fipeApi.ts

const API_BASE_URL = "https://fipe.parallelum.com.br/api/v2";

// Tipos alinhados à FIPE API v2
export interface Marca {
  code: string;
  name: string;
}

export interface Modelo {
  code: string;   // pode vir string
  name: string;
}

export interface Ano {
  code: string;
  name: string;
}

export interface Valor {
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

// Função genérica
async function fetchFipeData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar dados da FIPE:", error);
    throw error;
  }
}

// Endpoints FIPE API v2
export const getMarcas = async (): Promise<Marca[]> => {
  return fetchFipeData<Marca[]>(`/cars/brands`);
};

export const getModelos = async (codigoMarca: string): Promise<Modelo[]> => {
  if (!codigoMarca) throw new Error("Código da marca é obrigatório");
  return fetchFipeData<Modelo[]>(`/cars/brands/${codigoMarca}/models`);
};

export const getAnos = async (codigoMarca: string, codigoModelo: string): Promise<Ano[]> => {
  if (!codigoMarca || !codigoModelo) throw new Error("Código da marca e do modelo são obrigatórios");
  return fetchFipeData<Ano[]>(`/cars/brands/${codigoMarca}/models/${codigoModelo}/years`);
};

export const getValor = async (codigoMarca: string, codigoModelo: string, codigoAno: string): Promise<Valor> => {
  if (!codigoMarca || !codigoModelo || !codigoAno)
    throw new Error("Código da marca, modelo e ano são obrigatórios");
  return fetchFipeData<Valor>(
    `/cars/brands/${codigoMarca}/models/${codigoModelo}/years/${codigoAno}`
  );
};
