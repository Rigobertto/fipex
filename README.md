# 📊 FIPEX – Analisador Estatístico de Preços de Veículos (Tabela FIPE)

![FIPEX Dashboard Screenshot](/public/home-choose.png)

FIPEX é uma aplicação web desenvolvida em **React + Next.js** que permite analisar preços de veículos utilizando dados da **Tabela FIPE**.  
O sistema conta com cálculo das medidas de dispersão e gráficos estatísticos (Boxplot e Histograma) para facilitar a visualização da dispersão e distribuição dos valores da amostra.

---

## 🚀 Funcionalidades

- 🔍 **Pesquisa por Marca e Modelo** diretamente na Tabela FIPE.  
- 📊 **Boxplot Geral e por Ano** para análise de valores mínimos, máximos, quartis e outliers.  
- 📈 **Histograma de Frequência** para distribuição dos preços.  
- 🧮 **Medidas de Dispersão** (média, mediana, variância, desvio padrão, coeficiente de variação).

---

## 🖼️ Screenshots

### Medidas de Dispersão
![Search Screenshot](/public/medidas.png)

### Boxplot e Histograma
![Boxplot Histogram Screenshot](/public/boxplot.png)
![Boxplot Histogram Screenshot](/public/histogram.png)
---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [Next.js 14](https://nextjs.org/)  
  - [React 19](https://react.dev/)  
  - [Ant Design v5](https://ant.design/) (componentes visuais)  
  - [@ant-design/plots](https://charts.ant.design/) (gráficos com AntV)  
  - [TypeScript](https://www.typescriptlang.org/)  

- **Ferramentas**:
  - [FIPE API HTTP REST]([https://eslint.org/](https://deividfortuna.github.io/fipe/))
    
---

## 🏗️ Arquitetura do Projeto e API

O **FIPEX** segue uma arquitetura baseada em **Client-Side Rendering (CSR)** orquestrada pelo **Next.js 15 (App Router)**, focada na reatividade e cálculo instantâneo.

### 🌐 Consumo da API (Tabela FIPE)
O projeto consome a [API pública da Tabela FIPE](https://deividfortuna.github.io/fipe/) desenvolvida por Deivid Fortuna. 
O fluxo de requisições ocorre da seguinte forma:
1. **Busca de Marcas**: Ao carregar a página, o sistema busca todas as marcas de veículos disponíveis (`/marcas`).
2. **Busca de Modelos**: Ao selecionar uma marca, uma nova requisição busca os modelos associados àquela marca (`/marcas/{id}/modelos`).
3. **Análise de Dados (Anos e Valores)**: Ao clicar em "Analisar", o sistema busca **todos os anos disponíveis** daquele modelo específico. Para cada ano encontrado, é feita uma requisição em paralelo para resgatar o valor de avaliação daquele veículo.
4. **Tratamento de Dados**: Todos os preços (que vêm como strings formatadas em Real "R$ 12.345,00") são "limpos" e convertidos em arrays numéricos pelo componente principal (`Dashboard.tsx`).

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
git clone https://github.com/seu-usuario/fipex.git
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
