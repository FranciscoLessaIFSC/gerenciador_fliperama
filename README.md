# 🕹️ Arcade Manager

O **Arcade Manager** é um ecossistema completo para gerenciamento de casas de fliperama e arenas de jogos eletrônicos. O sistema é composto por uma API robusta de alta performance baseada em eventos, um banco de dados relacional leve e interfaces dinâmicas divididas em dois escopos de experiência: o **Painel do Cliente** (Totem de Autoatendimento) e o **Painel Administrativo** (Backoffice corporativo).

---

## 🚀 Tecnologias Utilizadas

### Backend & Banco de Dados
* **Node.js** com **TypeScript** para tipagem estática e segurança em tempo de desenvolvimento.
* **Fastify**: Framework web focado em baixo overhead e máxima velocidade de resposta.
* **Fastify Type Provider Zod**: Acoplamento estrito do **Zod** para validação de esquemas em tempo real de payloads de entrada/saída.
* **Prisma ORM**: Modelagem de dados abstrata com geração nativa de tipagens corporativas.
* **SQLite**: Banco de Dados relacional embarcado ideal para servidores locais de arcade.

### Frontend
* **HTML5 Nativo & Vanilla JavaScript (ES6+)**: Sem frameworks pesados, garantindo carregamento instantâneo nos terminais.
* **Chart.js**: Renderização assíncrona de gráficos analíticos de tendência de jogabilidade e faturamento.
* **Bootstrap 5 (Modais Isolados)**: Utilizado pontualmente para caixas de diálogo fluidas no painel de usuários.

---

## 📊 Arquitetura do Banco de Dados (Prisma Schema)

O núcleo do sistema opera através de relacionamentos relacionais estritos projetados para consistência de dados em transações financeiras e registros de alta pontuação (*High Scores*):

* **Card**: Identificador físico RFID/Serial de cada cliente, centralizando o saldo (`balance`) e o histórico de pontuações.
* **Machine & Game**: Mapeamento físico das cabines de fliperama e os softwares/regras de jogos embarcados nelas.
* **Score & Match**: Auditoria e histórico de partidas executadas por cartão, tempo de duração e pontuações conquistadas.
* **Employee & Permission**: Controle de acesso por funções de funcionários (Caixas, Gerentes, Mantenedores e Administradores).
* **Discount**: Mecanismo de cupons e campanhas promocionais de crédito para recarga de totens.
* **FinancialTransaction & Sale**: Ledger financeiro estrito com histórico imutável de recargas, resgates de tickets e vendas de produtos físicos da lanchonete.

---

## 🖥️ Módulos do Sistema

### 1. Painel do Cliente (Totem / App)
* **Tela de Acesso**: Captura e propagação de UID via Query String, emulando a aproximação de um cartão RFID físico.
* **Dashboard Principal**: Exibe em tempo real o saldo de créditos e pontuação total acumulada com o histórico dos últimos 5 jogos jogados.
* **Ranking Global**: Filtro dinâmico assíncrono para verificar os recordes de pontuação por máquina ou por jogador.
* **Compra e Troca de Créditos**: Mutação direta no banco de dados via transações ACID do Prisma para acréscimo de saldo via Pix simulado ou troca direta de pontos de score acumulados por novas fichas.

### 2. Painel Administrativo (Backoffice)
* **Dashboard Central**: Gráficos minimalistas e KPIs em tempo real monitorando partidas por hora, cartões em circulação e faturamento financeiro do dia.
* **Gestão de Usuários**: Listagem completa de clientes com abertura de modal assíncrono para varredura do histórico de partidas de cartões específicos.
* **Status de Máquinas**: Monitoramento em tempo real do faturamento acumulado individual e estado operacional (Online / Em Manutenção).
* **Controle de Funcionários & Pagamento**: Módulo avançado que cruza dados de ponto biométrico (`Attendance`) para cálculo de horas trabalhadas e faltas, permitindo criar, editar e estornar transações salariais.
* **Promoções e Estoque**: CRUDs completos desenvolvidos com formulários em `<dialog>` nativo para controlar cupons ativos e níveis críticos de mercadorias no inventário.

---

## 🔧 Instalação e Execução

### Pré-requisitos
* Node.js LTS (Versão 18 ou superior)
* NPM ou Yarn

### Passo a Passo

1. **Clonar o Repositório e Instalar Dependências**
   ```bash
   git clone https://github.com
   cd arcade-manager
   npm install
   ```

2. **Configuração e Migração do Banco de Dados**
   Gere o client do Prisma e execute os arquivos de migração para estruturar o arquivo SQLite local:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Popular o Banco com Dados de Teste (Mock DB)**
   Execute o script de semente (*seed*) automatizado para gerar cartões de teste (`RFID_DEFAULT_123`), máquinas, funcionários e pontuações idênticas aos mocks visuais das páginas:
   ```bash
   npx prisma db seed
   ```

4. **Iniciar o Servidor Backend (Fastify)**
   ```bash
   npm run dev
   # O servidor iniciará em http://localhost:3000 com CORS liberado para o frontend
   ```

5. **Executar o Frontend**
   Como as interfaces foram estruturadas em Vanilla JS nativo, basta abrir o arquivo `index.html` da raiz utilizando a extensão **Live Server** do VSCode ou simplesmente dando um duplo clique no arquivo para abrir no navegador.

---

## 🔒 Segurança de Renderização (Prevenção de Erros de Canvas)
As rotas analíticas e os controladores JavaScript do Frontend foram blindados contra estouros de memória do motor do navegador. O script destrói instâncias órfãs de gráficos ativos (`chartInstance.destroy()`) antes de desenhar novos fluxos temporais, anulando o erro crítico `Canvas is already in use` durante a alternância rápida de abas do menu administrativo.

---

## 👥 Desenvolvedores

Este sistema foi idealizado e desenvolvido por:

* **Francisco Lessa**
* **Arthur Moro**
* **Samuel Boita**
* **Taynan Bringhenti**
* **Luigi Pretto**
