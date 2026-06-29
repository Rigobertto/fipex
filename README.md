# 📊 FIPEX – Analisador Estatístico de Preços de Veículos (Tabela FIPE)

FIPEX é uma aplicação web desenvolvida em **React + Next.js** que permite analisar preços de veículos utilizando dados da **Tabela FIPE**.  
O sistema conta com cálculo das medidas centrais, dispersão e gráficos estatísticos (Boxplot e Histograma) para facilitar a visualização da dispersão e distribuição dos valores da amostra.

<img width="1510" height="890" alt="image" src="https://github.com/user-attachments/assets/feaa9c02-c5b0-4a31-b639-5f4b0fe10c23" />

---

## 🚀 Funcionalidades

- 🔍 **Pesquisa por Marca e Modelo** diretamente na Tabela FIPE.  
- 📊 **Boxplot Geral e por Ano** para análise de valores mínimos, máximos, quartis e outliers.  
- 📈 **Histograma de Frequência** para distribuição dos preços.  
- 🧮 **Medidas de Dispersão** (média, mediana, variância, desvio médio, desvio padrão e coeficiente de variação).

---

## 🖼️ Screenshots
### Medidas Centrais
<img width="1378" height="533" alt="image" src="https://github.com/user-attachments/assets/aa31a081-003c-49d4-95b4-3cf4f01a2c3f" />

### Medidas de Dispersão
<img width="1380" height="597" alt="image" src="https://github.com/user-attachments/assets/03c7cd5d-bd9f-4bc6-94d2-8d958ad94f43" />

### Boxplot e Histograma
<img width="1367" height="533" alt="image" src="https://github.com/user-attachments/assets/4b37a82a-120d-4cd3-8d32-0e398e6bf906" />

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [Next.js 14](https://nextjs.org/)  
  - [React 19](https://react.dev/)  
  - [Shadcn UI](https://ui.shadcn.com/) (componentes visuais)
  - [TypeScript](https://www.typescriptlang.org/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [Spring Boot](https://spring.io/)
 
---

## 🏗️ Arquitetura do Projeto e API

O **FIPEX** segue uma arquitetura baseada em **Client-Side Rendering (CSR)** orquestrada pelo **Next.js 15 (App Router)**, focada na reatividade e cálculo instantâneo. A API construída com Spring Boot utiliza a seguinte estrutura:

### Informações Gerais

- **URL Base:** `https://fipe.parallelum.com.br/api/v2/`
- **Formato de Resposta:** `application/json`
- **Limitação (Plano Gratuito):** Até **1.000 requisições por dia** utilizando um token gratuito.

---

### Parâmetros Comuns (`{vehicleType}`)

Nas rotas abaixo, o parâmetro `{vehicleType}` define o tipo de veículo consultado. Os valores aceitos são:

| Valor | Descrição |
|--------|-----------|
| `cars` | Carros e utilitários leves |
| `motorcycles` | Motos e ciclomotores |
| `trucks` | Caminhões e micro-ônibus |

---

### Fluxo de Consulta

O fluxo tradicional da API segue uma estrutura hierárquica:

```text
Listar Marcas
      ↓
Listar Modelos
      ↓
Listar Anos
      ↓
Obter Preço do Veículo
```

---

### 1. Listar Marcas

Retorna todas as marcas cadastradas para o tipo de veículo informado.

- **Método:** `GET`
- **Endpoint:**

```http
/{vehicleType}/brands
```

#### Exemplo

```http
GET /cars/brands
```

---

### 2. Listar Modelos da Marca

Retorna todos os modelos pertencentes a uma marca específica.

- **Método:** `GET`
- **Endpoint:**

```http
/{vehicleType}/brands/{brandId}/models
```

#### Exemplo

```http
GET /cars/brands/59/models
```

---

### 3. Listar Anos de um Modelo

Retorna todos os anos disponíveis para um modelo específico, incluindo a diferenciação por tipo de combustível.

O campo `yearId` normalmente possui o formato:

```text
AAAA-C
```

Onde:

- `AAAA` = Ano do modelo
- `C` = Código do combustível

Exemplo:

```text
2014-3
```

- **Método:** `GET`
- **Endpoint:**

```http
/{vehicleType}/brands/{brandId}/models/{modelId}/years
```

#### Exemplo

```http
GET /cars/brands/59/models/5940/years
```

---

### 4. Obter Informações / Preço do Veículo

Retorna as informações completas e o preço médio atualizado do veículo com base na combinação de marca, modelo e ano.

- **Método:** `GET`
- **Endpoint:**

```http
/{vehicleType}/brands/{brandId}/models/{modelId}/years/{yearId}
```

#### Exemplo

```http
GET /cars/brands/59/models/5940/years/2014-3
```

### 🧩 Fluxo de Componentes
1. `Dashboard.tsx`: Componente "Pai" que gerencia os estados principais (veículo selecionado, dados recebidos).
2. `VehicleSearch.tsx`: Responsável por abrigar a interface de seleção e disparar os requests para a API utilizando a biblioteca de formulários e ComboBoxes (shadcn/ui).
3. `CentralCards` e `DispersionCards`: Componentes estatísticos que recebem os arrays numéricos "puros", calculando fórmulas matemáticas (Média, Mediana, Desvio Padrão, Variância, CV) localmente, sem depender de back-end.
4. `Boxplot` e `YearBarChart`: Gráficos montados sobre o **Recharts**. Recebem os dados pré-processados e calculam automaticamente os quartis (Q1, Q2, Q3) e os *outliers* antes de desenhar o layout SVG.

---

## ⚙️ Instalação

### Pré-requisitos
- Node.js 18 ou superior (recomendado LTS)  
- npm ou yarn  

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/rigobertto/fipex.git
cd fipex

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Execute o servidor de desenvolvimento
npm run dev
# ou
yarn dev

# 4. Abra no navegador
http://localhost:3000
