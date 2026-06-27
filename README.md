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
