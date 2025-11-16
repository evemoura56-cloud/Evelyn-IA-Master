# Evelyn GEMS Hub – Personas + Job Hub + Planilha Inteligente

## Descrição Geral

O Evelyn GEMS Hub é um sistema completo projetado para centralizar a gestão de múltiplas personas de IA (GEMS), organizar um processo de busca de empregos (Job Hub) e automatizar a geração de textos para candidaturas, tudo isso utilizando uma arquitetura 100% gratuita.

O projeto combina um backend robusto em **Google Apps Script**, que orquestra os dados e a lógica de negócio, com um frontend moderno e reativo em **React + Vite**, garantindo uma experiência de usuário fluida e responsiva.

## Arquitetura

O sistema é dividido em três componentes principais:

1.  **Google Sheets (Banco de Dados e Painel de Controle):**
    *   Uma planilha centraliza todos os dados do sistema: configurações, personas (GEMS), vagas, candidaturas e um dashboard visual.
    *   Funciona como um painel de controle intuitivo, permitindo que o usuário visualize e edite os dados diretamente.

2.  **Google Apps Script (Backend):**
    *   Publicado como um Web App, funciona como uma API RESTful.
    *   Responsável por toda a lógica de negócio:
        *   Criação e gestão da planilha.
        *   Operações de CRUD (Criar, Ler, Atualizar, Deletar) para GEMS, Vagas e Candidaturas.
        *   Roteamento de chat, preparando o contexto para a integração com modelos de linguagem (LLM).
        *   Geração de textos de candidatura através do "robô preenchedor".

3.  **React + Vite (Frontend):**
    *   Uma Single Page Application (SPA) estática, totalmente responsiva.
    *   Consome a API do Google Apps Script.
    *   Oferece uma interface de usuário para interagir com as GEMS, gerenciar o Job Hub e usar o robô preenchedor.
    *   Pode ser hospedado gratuitamente em plataformas como GitHub Pages ou Vercel.

## Passo a Passo para Instalação e Uso

### 1. Setup do Backend (Google Apps Script)

1.  **Crie um novo projeto Apps Script:**
    *   Acesse [script.google.com/create](https://script.google.com/create).
    *   Dê um nome ao projeto, por exemplo: "Evelyn GEMS Hub Backend".

2.  **Copie o código:**
    *   Para cada arquivo na pasta `/apps-script` deste repositório, crie um arquivo correspondente no editor do Apps Script (`.gs`).
    *   Copie e cole o conteúdo de cada arquivo local para seu respectivo arquivo no projeto online.

3.  **Execute a função de inicialização:**
    *   No editor, selecione a função `initProject` no menu suspenso e clique em "Executar".
    *   Na primeira vez, será necessário autorizar as permissões que o script precisa (para gerenciar planilhas).
    *   Este passo criará automaticamente a planilha "Evelyn GEMS Hub – Painel Central" no seu Google Drive com todas as abas, formatações e dados de exemplo.

4.  **Implante o Web App:**
    *   Clique em "Implantar" > "Nova implantação".
    *   Selecione o tipo "Aplicativo da Web".
    *   Configure da seguinte forma:
        *   **Executar como:** "Eu" (Your Google Account)
        *   **Quem pode acessar:** "Qualquer pessoa"
    *   Clique em "Implantar".
    *   **Copie a URL do aplicativo da Web.** Você precisará dela para o frontend.

### 2. Uso da Planilha

*   Após a inicialização, você pode encontrar a planilha "Evelyn GEMS Hub – Painel Central" no seu Google Drive.
*   **Aba `CONFIG`:** Se você for integrar com a API do Gemini no futuro, preencha a `GEMINI_API_KEY` aqui.
*   **Aba `GEMS`:** Personalize suas personas. Adicione novos `SYSTEM_PROMPT`, ajuste o tom e as descrições.
*   **Abas `VAGAS` e `CANDIDATURAS`:** Use para gerenciar seu processo seletivo. Os dados inseridos pelo frontend aparecerão aqui.

### 3. Setup do Frontend (React)

1.  **Clone o repositório e instale as dependências:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd evelyn-gems-hub/frontend
    npm install
    ```

2.  **Configure a URL da API:**
    *   Crie um arquivo chamado `.env` dentro da pasta `/frontend`.
    *   Copie o conteúdo do arquivo `.env.example` para dentro do `.env`.
    *   Cole a URL do seu Web App do Apps Script na variável `VITE_API_BASE_URL`:
        ```
        VITE_API_BASE_URL="URL_DO_SEU_WEB_APP_AQUI"
        ```

3.  **Execute em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O sistema estará rodando localmente, geralmente em `http://localhost:5173`.

4.  **Compile para produção:**
    ```bash
    npm run build
    ```
    Isso criará a pasta `/dist` com os arquivos estáticos prontos para publicação.

### 4. Publicação do Frontend (Grátis)

*   **Vercel (Recomendado):**
    *   Crie uma conta na [Vercel](https://vercel.com/).
    *   Conecte seu repositório do GitHub.
    *   Importe o projeto e configure a variável de ambiente `VITE_API_BASE_URL` nas configurações do projeto na Vercel.
    *   A Vercel fará o deploy automático a cada `git push`.

*   **GitHub Pages:**
    *   Você pode usar o GitHub Actions para automatizar o build e o deploy para a branch `gh-pages`.

### 5. Como Usar Cada Tela

*   **Dashboard:** Visualize um resumo das suas atividades de busca por vagas.
*   **Chat:** Selecione uma de suas personas (GEMS) e converse com ela. A IA responderá com base no `SYSTEM_PROMPT` configurado na planilha.
*   **Vagas:** Cadastre e visualize as vagas de emprego para as quais você tem interesse.
*   **Candidaturas:** Registre cada candidatura associada a uma vaga, controlando o status do processo.
*   **Preenchedor:** Uma ferramenta de IA para gerar textos de candidatura personalizados. Escolha uma persona, forneça os dados da vaga e seu perfil, e receba uma mensagem customizada para enviar ao recrutador.

## Integração com GEMS/Gemini (Futuro)

A arquitetura foi projetada para uma integração simples com um modelo de linguagem real como o Gemini.

1.  **Obtenha uma API Key:**
    *   Acesse o [Google AI Studio](https://aistudio.google.com/) e crie sua chave de API.

2.  **Configure na Planilha:**
    *   Abra a planilha, vá para a aba `CONFIG` e cole sua chave na célula correspondente à `GEMINI_API_KEY`.

3.  **Ajuste o Código (se necessário):**
    *   O arquivo `/apps-script/LLMClient.gs` já tem a estrutura para chamar a API. Por padrão, ele está em modo "stub" (mock). Para ativar a chamada real, basta descomentar o bloco de código que usa `UrlFetchApp` e comentar a resposta mockada.

Com isso, suas GEMS, com os `SYSTEM_PROMPT` que você definiu, passarão a ser processadas pela IA do Gemini.

## Ideias de Evolução

*   **Extensão de Navegador:** Criar uma extensão para Chrome que envie o contexto de uma página de vaga (como o LinkedIn) diretamente para o Robô Preenchedor.
*   **Memória de Longo Prazo:** Implementar uma aba `CONVERSAS` para salvar o histórico de chats e permitir que a IA tenha memória sobre interações passadas.
*   **Autenticação de Usuário:** Adicionar um sistema de login para permitir que múltiplos usuários utilizem o sistema de forma privada.
*   **Web Scraping:** Criar um script (rodando em background via trigger) que busca vagas em sites pré-definidos e as cadastra automaticamente na aba `VAGAS`.
