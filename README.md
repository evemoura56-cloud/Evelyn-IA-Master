# Evelyn Mater – Hub local de personas e vagas

A Evelyn Mater roda totalmente em cima de um banco local (localStorage) e, opcionalmente, consulta um feed público de vagas reais quando você desejar importar novas oportunidades. Não é necessário Google Sheets, Google Apps Script ou qualquer projeto externo.

## Principais módulos

1. **Personas** – cadastre até 7 personas com nome, descrição, instruções (SYSTEM PROMPT), personalidade, tom, especialidades, foco, valores e interesses.
2. **Chat** – converse com qualquer persona. As respostas são geradas localmente de acordo com os campos configurados.
3. **Job Hub** – registre vagas manualmente ou importe vagas reais (Remotive) filtradas por data, vendo o nível de compatibilidade de cada persona com base em senioridade, stack, valores e modelo de trabalho.
4. **Links pré-preenchidos** – gere automaticamente links para candidatura contendo os parâmetros da vaga e da persona. Basta abrir, revisar e enviar manualmente.
5. **Candidaturas** – controle o funil registrando data, status, canal e qual persona cuidou de cada candidatura.
6. **Robô preenchedor** – gera um texto-base para abordar recrutadores utilizando o tom e as especialidades da persona escolhida.

## Banco de dados local

- O estado inicial fica em `frontend/src/data/defaultState.js`.
- A lógica de leitura/escrita mora em `frontend/src/services/localDatabase.js`.
- Todos os dados são persistidos na chave `evelyn-ia-master:db` do `localStorage`.
- Para zerar o sistema, execute no console do navegador:
  ```js
  localStorage.removeItem('evelyn-ia-master:db');
  ```
- É possível editar os dados iniciais ou criar rotinas personalizadas diretamente no módulo `localDatabase`.

## Busca de vagas reais

- A aba **Vagas** possui um módulo "Buscar vagas reais (24-72h)" integrado ao feed público da [Remotive](https://remotive.com/remote-jobs).
- Apenas vagas com publicação entre 24h e 72h atrás são listadas, garantindo links atuais.
- Use o campo de busca para filtrar por palavra-chave (ex.: "frontend", "designer") e clique em **Salvar no banco local** para transformar a vaga importada em um registro com compatibilidade das personas.
- A integração é somente leitura e roda direto no navegador da Evelyn Mater.

## Como rodar

1. **Instale as dependências**
   ```bash
   cd frontend
   npm install
   ```
2. **Ambiente de desenvolvimento**
   ```bash
   npm run dev
   ```
   O Vite abrirá em `http://localhost:5173`.
3. **Build de produção**
   ```bash
   npm run build
   ```
   Os arquivos finais ficam em `frontend/dist` e podem ser hospedados como site estático.

## Estrutura simplificada

```
frontend/src
├── api/                # Camada que conversa com o banco local
├── components/         # Layout e navegação
├── pages/              # Telas (Dashboard, Personas, Chat, Vagas, Links, etc.)
├── services/localDatabase.js
├── data/defaultState.js
└── styles/             # CSS compartilhado
```

## Perguntas frequentes

**Como adiciono mais personas?**
Use a aba "Personas" na aplicação. Ao atingir 7 personas, será exibido um aviso.

**Como gerar novamente os links pré-preenchidos?**
Abra a aba "Links pré-preenchidos" e clique em "Regerar lista". O cálculo leva em conta apenas vagas com compatibilidade ≥ 60%.

**Quero alterar o comportamento do chat. Onde mexo?**
Atualize a função `simulateChatResponse` dentro de `localDatabase.js`. Lá você controla o texto que aparece para cada mensagem.

Boas automações! ✨
